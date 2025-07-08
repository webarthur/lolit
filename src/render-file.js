import { join } from 'path'
import { readFileSync } from 'fs'

/**
 * Renders a template from a file with the given scope and options.
 * @param {string} filePath - The path to the template file to render.
 * @param {Object} [scope={}] - The data object to use as the scope for rendering.
 * @param {Object} [options={}] - Configuration options for rendering.
 * @returns {string} The rendered template as a string.
 */
export default function renderFile (filePath, scope = {}, options = {}) {
  const { root, filename = filePath } = options

  let fullPath = filePath
  if (!fullPath.startsWith("/")) {
    filePath = join(root || process.cwd(), filename)
  }

  const fileContent = readFileSync(fullPath, "utf-8")
  return this.render(fileContent, scope, { ...options, filename })
}
