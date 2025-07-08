import vm from 'vm'
import { html } from 'lit-html'
import resolve from './resolve.js'
import { getResolveFunction } from './resolve-sync.js'
import parseError from './parse-error.js'
import {
  classMap,
  styleMap,
  repeat,
  map,
  range,
  join,
  unsafeHTML,
  unsafeMathML,
  unsafeSVG,
  ifDefined,
  when,
  choose,
} from './directives.js'


/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * @param {string} str - The input string to escape.
 * @returns {string} The escaped string with HTML entities replaced.
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Compiles a template string into a renderable function.
 * @param {string} template - The template string to compile.
 * @param {Object} [options={}] - Configuration options for compilation.
 * @param {string} [options.openDelimiter='${'] - The opening delimiter for template expressions.
 * @param {string} [options.closeDelimiter='}'] - The closing delimiter for template expressions.
 * @param {boolean} [options.vm=true] - Whether to use the VM module for sandboxed execution.
 * @param {boolean} [options.async=false] - Whether to use asynchronous resolution.
 * @param {string} [options.filename] - The filename for error reporting.
 * @param {Object} [options.context] - Additional context to include in the sandbox.
 * @returns {Function} A function that takes a scope object and returns the rendered template.
 * @throws {string} Detailed error information if compilation fails.
 */
export default function compile(template, options = {}) {
  const context = {
    ...this.options.context,
    ...(options.context || {})
  }

  options = { ...this.options, ...options }

  const {
    openDelimiter,
    closeDelimiter,
    vm: useVM,
    async: useAsync,
    filename,
    litHtml,
    escapeHtml: useEscapeHtml,
  } = options

  const partials = this.partials || {}

  let escapedTemplate = template
  if (openDelimiter !== '${') {
    escapedTemplate = escapedTemplate
      .replace(/\$\{/g, '\\${')
      .replace(openDelimiter, '${')
  }
  if (closeDelimiter !== '}') {
    escapedTemplate = escapedTemplate
      .replace(closeDelimiter, '}')
    // .replace(/\}/g, '\\}')
  }

  options.escapeHtml = useEscapeHtml ? escapeHtml : (str) => str

  try {
    const resolve = getResolveFunction(options)
    const Lolit = this
    if (useVM) {
      return (scope) => {
        const templatePrefix = options._isPartial ? 'html' : 'resolve'
        const script = new vm.Script(templatePrefix + '`' + (template) + '`', {
          filename,
          displayErrors: true,
        })
        const sandbox = {
          ...partials,
          ...context,
          ...scope,
          partial() { return Lolit.resolvePartial.apply(Lolit, arguments) },
          html,
          unsafeHTML,
          when,
          repeat,
          styleMap,
          unsafeMathML,
          unsafeSVG,
          range,
          map,
          choose,
          classMap,
          ifDefined,
          join,
          nothing: '',
          resolve,
        }
        const contextifiedSandbox = vm.createContext(sandbox)
        return script.runInContext(contextifiedSandbox)
      }
    }
    else {
      return new Function('scope', `with(scope) { return ${async ? 'scope._resolve' : ''}\`${escapedTemplate}\`; }`)
    }
  }
  catch (e) {
    const errorDetails = parseError(e, template)
    throw errorDetails
  }
}

