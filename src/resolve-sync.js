import { SafeString } from './directives.js'

/**
 * Determines if the context is an unquoted HTML attribute.
 * @param {string} prevString - The string before the current position.
 * @param {string} nextString - The string after the current position.
 * @returns {boolean} True if the context is an unquoted HTML attribute, false otherwise.
 */
export function isUnquotedAttributeContext(prevString, nextString) {
  // A simplified heuristic: check if the previous string ends with an unquoted '=' and the next string doesn't start with a quote.
  // This does NOT cover all edge cases of HTML parsing but handles common lit-html attribute patterns.
  const endsWithUnquotedEquals = /=\s*$/
    .test(prevString) && !/=\s*["']/
    .test(prevString.substring(prevString.lastIndexOf('=') + 1))
  const startsWithNoQuote = !/^["\']/
    .test(nextString.trim())
  
  return endsWithUnquotedEquals && startsWithNoQuote
}

/**
 * Returns a function that synchronously resolves template literals with values, handling escaping and special cases.
 * @param {Object} options - The options object containing the escapeHtml function.
 * @returns {Function} A function that resolves template literals with values.
 */
export function getResolveFunction(options = {}) {
  const { escapeHtml } = options

  /**
   * Synchronously resolves template literals with values, handling escaping and special cases.
   * @param {Array<string>} strings - The array of string parts from the template literal.
   * @param {...*} values - The values to interpolate into the template.
   * @returns {string} The resolved and escaped string.
   */
  function resolveSync(strings, ...values) {
    let parts = [strings[0]]
  
    for (let i = 0; i < values.length; i++) {
      let value = values[i]
  
      // Handle null, undefined and empty string
      if (value === null || value === undefined || value === '') {
        parts.push('')
        parts.push(strings[i + 1])
        continue
      }
  
      // Handle array values
      if (Array.isArray(value)) {
        for (const item of value) {
          parts.push(resolveSync(['', ''], item))
        }
        parts.push(strings[i + 1])
        continue
      }
  
      // If it's a lit-html TemplateResult object
      if (typeof value === 'object' && value !== null && value._$litType$) {
        let resolvedTemplateResult = resolveSync(value.strings, ...value.values)
        // If the template result contains spaces and is in an unquoted attribute context,
        // it might need quoting, but this is handled by the general logic below.
        parts.push(resolvedTemplateResult)
        parts.push(strings[i + 1])
        continue
      }
  
      let resolvedValueString
      // Handle plain JavaScript objects that are not TemplateResult or SafeString.
      // If a plain object's toString() is '[object Object]', we'll default to an empty string.
      if (typeof value === 'object' && value !== null && !(value instanceof SafeString)) {
          if (value.constructor === Object) {
              resolvedValueString = '' // Default plain objects to an empty string
          } 
          else {
              resolvedValueString = String(value)
          }
      } 
      else {
          resolvedValueString = String(value)
      }
  
      // First, apply general HTML escaping unless it's a SafeString
      if (!(value instanceof SafeString)) {
        resolvedValueString = escapeHtml(resolvedValueString)
      }
  
      // Then, apply quoting and escaping if it's an unquoted HTML attribute value
      if (isUnquotedAttributeContext(strings[i], strings[i + 1])) {
          // Always wrap in quotes and escape existing double quotes within the string
          resolvedValueString = `"${resolvedValueString.replace(/"/g, '&quot;')}"`
      }
  
      parts.push(resolvedValueString)
      parts.push(strings[i + 1])
  
    }
  
    return parts.join('')
  }

  if (options.async) {
    return async function resolveAsync(strings, ...values) {
      // Resolve promises and non-promise values using resolveSync
      const resolvedValues = await Promise.all(
        values.map(async v => {
          let resolved = v
          if (typeof v === 'object' && v.constructor?.name === 'Promise') {
            resolved = await v
          }
          // Interpret context using resolveSync for non-promise values, including nested structures
          // For simple values, resolveSync will just convert to string and escape if needed.
          return resolveSync(['', ''], resolved)
        })
      )

      // Monta a string final, intercalando as partes fixas com os valores resolvidos
      let str = strings[0]
      resolvedValues.forEach((value, index) => {
        str += value + strings[index + 1]
      })

      return str
    }
  }
  
  return resolveSync
  
}
