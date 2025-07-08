/**
 * Renders a template with the given scope and options.
 * @param {string} content - The template string to render.
 * @param {Object} [scope={}] - The data object to use as the scope for rendering.
 * @param {Object} [options={}] - Configuration options for rendering.
 * @returns {string} The rendered template as a string.
 */
export default function render (content, scope = {}, options = {}) {
  Object.assign(this.options, options)
  const template = this.compile(content, options)
  return template(scope)
}
