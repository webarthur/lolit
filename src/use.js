import { relative } from 'path'
import { readFileSync } from 'fs'
import getFiles from './get-files.js'

/**
 * Registers a template or a directory of templates as partials for rendering.
 * @param {string} arg1 - The name of the partial or the directory path relative to options.root.
 * @param {Object|string} [options={}] - Configuration options or a string of template code.
 * @param {string} [options.code] - The template code as a string.
 * @param {string} [options.file] - Path to a file containing template code.
 * @param {string} [options.root] - Root directory for resolving template files.
 * @param {string} [options.filename] - Filename for error reporting.
 * @param {boolean} [options._isPartial] - Internal flag to indicate if it's a partial.
 * @returns {Promise<void>} - Resolves when the partials are registered.
 */
export default async function use(arg1, options = {}) {
  if (typeof options === 'string') {
    options = { code: options }
  }
  else if (options.file) {
    options.code = readFileSync(options.file, 'utf8')
  }

  if (options.code) {
    this.partials[arg1] = this.compile(options.code, { ...this.options, ...options })
  }
  else {
    options = { ...this.options, ...options, _isPartial: true }
    const dir = arg1
    getFiles(`${options.root}/${dir}`, new RegExp(`\\${options.fileExtension}$`, 'i'))
      .forEach(file => {
        const template = readFileSync(file, 'utf8')
        const name = relative(`${options.root}/${dir}`, file).replace(new RegExp(`\\${options.fileExtension}$`, 'i'), '')
        options.filename = file
        this.partials[name] = this.compile(template, options)
      })
  }
}
