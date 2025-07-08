import compile from './src/browser/compile.js'
import resolve from './src/resolve.js'
import resolvePartial from './src/resolve-partial.js'
import render from './src/render.js'
import renderFile from './src/render-file.js'
import use from './src/use.js'

const defaultOptions = {
  root: '/',
  context: {},
  async: false,
  openDelimiter: '${',
  closeDelimiter: '}',
  filename: undefined,
  vm: false, // browser não usa vm
  directives: true,
  partials: {},
  fileExtension: '.lit.html',
  escapeHtml: true,
}

export default class Lolit {
  static partials = {}
  static options = defaultOptions
  partials = {}
  options = defaultOptions

  constructor (options = {}) {
    this.options = { ...Lolit.options, ...options }
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