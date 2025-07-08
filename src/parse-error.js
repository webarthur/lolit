/**
 * Parses an error object to extract detailed information including the line number and a snippet of the problematic HTML code.
 * @param {Error} error - The error object containing stack information.
 * @param {string} html - The HTML content associated with the error.
 * @returns {string} A formatted string with error details and a code snippet if a line number is found, otherwise the full error stack.
 */
export default function parseError (error, html) {
  const stackLines = error.stack.split("\n")
  const errorLine = stackLines[0]
  const match = stackLines[1].match(/<anonymous>:(\d+):\d+/)
  if (match) {
    const lineNumber = parseInt(match[1], 10)
    const htmlLines = html.split("\n")
    const errorSnippet = htmlLines
      .slice(Math.max(0, lineNumber - 2), lineNumber + 1)
      .join("\n")
    return `${errorLine}\n\nFile: ${error.filename}\n\nError Occurred at Line ${lineNumber}:\n${errorSnippet}`
  }

  // Fallback if line number couldn't be determined
  return error.stack 
}