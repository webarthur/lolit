import { html } from 'lit-html'
import { getResolveFunction } from '../resolve-sync.js'
import parseError from '../parse-error.js'
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
} from '../directives.js'

// Browser-safe compile: identical API but semantically simplified
export default function compile (template, options = {}) {
  const context = {
    ...this?.options?.context,
    ...(options.context || {})
  }

  options = { ...this?.options, ...options }

  const {
    openDelimiter,
    closeDelimiter,
    async: isAsync,
    filename,
    escapeHtml: useEscapeHtml,
  } = options

  const partials = this?.partials || {}

  let escapedTemplate = template
  if (openDelimiter !== '${') {
    escapedTemplate = escapedTemplate
      .replace(/\$\{/g, '\\\${')
      .replace(openDelimiter, '${')
  }
  if (closeDelimiter !== '}') {
    escapedTemplate = escapedTemplate.replace(closeDelimiter, '}')
  }

  // Provide default escape when requested
  options.escapeHtml = useEscapeHtml ? escapeHtml : (str) => str

  try {
    const resolve = getResolveFunction(options)
    const Lolit = this
    // In the browser não existe "vm", então sempre usamos Function
    return (scope = {}) => {
      const sandbox = {
        ...partials,
        ...context,
        ...scope,
        partial () { return Lolit.resolvePartial.apply(Lolit, arguments) },
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
        _resolve: resolve,
      }

      // Cria função dinâmica; se async, devolve Promise
      const fnBody = `with(this) { return ${isAsync ? 'this._resolve' : ''}\`${escapedTemplate}\`; }`
      const fn = new Function(fnBody)
      return fn.call(sandbox)
    }
  }
  catch (e) {
    const errorDetails = parseError(e, template)
    throw errorDetails
  }
}

function escapeHtml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
} 