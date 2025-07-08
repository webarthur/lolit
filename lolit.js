import compile from './src/compile.js'
import resolve from './src/resolve.js'
import resolvePartial from './src/resolve-partial.js'
import render from './src/render.js'
import renderFile from './src/render-file.js'
import use from './src/use.js'

/**
 * Instance-specific configuration options for the Lolit instance.
 * @type {Object}
 * @property {string} root - The root directory for resolving templates.
 * @property {Object} context - The context object for rendering templates.
 * @property {boolean} async - Whether to render templates asynchronously.
 * @property {string} openDelimiter - The opening delimiter for template expressions.
 * @property {string} closeDelimiter - The closing delimiter for template expressions.
 * @property {string|undefined} filename - The name of the file being rendered.
 * @property {boolean} vm - Whether to use the VM module for rendering.
 * @property {boolean} directives - Whether to enable custom directives.
 * @property {Object} partials - Custom partials for the templates.
 * @property {string} fileExtension - The extension of the files to be used as partials.
 * @property {boolean} escapeHtml - Whether to escape HTML entities.
 */
const defaultOptions = {
  root: process.cwd(),
  context: {},
  async: false,
  openDelimiter: '${',
  closeDelimiter: '}',
  filename: undefined,
  vm: true,
  directives: true,
  partials: {},
  fileExtension: '.lit.html',
  escapeHtml: true,
}
/**
 * Lolit - A templating engine for rendering dynamic content.
 * This class provides methods for compiling and rendering templates with customizable options.
 */
export default class Lolit {

  /**
   * Default partials for the Lolit class.
   * @type {Object}
   * @static
   */
  static partials = {}

  static options = defaultOptions
  /**
   * Instance-specific partials for the Lolit instance.
   * @type {Object}
   */
  partials = {}

  options = defaultOptions

  /**
   * Creates a new instance of Lolit with custom options.
   * @param {Object} [options={}] - Custom configuration options to override defaults.
   */
  constructor(options = {}) {
    this.options = {
      ...Lolit.options,
      ...options
    }
  }

  static compile = compile
  static resolve = resolve
  static resolvePartial = resolvePartial
  static render = render
  static renderFile = renderFile
  static use = use

  compile = compile
  resolve = resolve
  resolvePartial = resolvePartial
  render = render
  renderFile = renderFile
  use = use

}

export { Lolit }
