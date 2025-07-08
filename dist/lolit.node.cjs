'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vm = require('vm');
var litHtml = require('lit-html');
var path = require('path');
var fs = require('fs');

async function resolve (parts, ...values) {
  // Resolve promises
  const resolvedValues = await Promise.all(
    values.map(v => 
      typeof v === 'object' && v.constructor?.name === 'Promise' ? v : v
    )
  );

  // Monta a string final, intercalando as partes fixas com os valores resolvidos
  let str = parts[0];
  resolvedValues.forEach((value, index) => {
    str += value + parts[index + 1];
  });

  return str
}

/**
 * A marker class for content that should not be escaped.
 * @class
 * @param {string} value - The value to be marked as safe.
 */
class SafeString {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return String(this.value)
  }
}

/**
 * Converts a class info object into a space-separated string of active classes.
 * @param {Object} classInfo - An object with class names as keys and boolean values indicating if the class is active.
 * @returns {string} A space-separated string of active class names.
 */
function classMap(classInfo) {
  const activeClasses = Object.keys(classInfo).filter(key => classInfo[key]);
  return activeClasses.join(' ')
}

/**
 * Converts a style info object into a CSS style string.
 * @param {Object} styleInfo - An object with style properties as keys and their values.
 * @returns {string} A semicolon-separated string of CSS styles.
 */
function styleMap(styleInfo) {
  const styles = Object.keys(styleInfo)
    .filter(key => styleInfo[key] !== undefined && styleInfo[key] !== null)
    .map(key => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}: ${styleInfo[key]}`);
  return styles.join('; ')
}

/**
 * Repeats a template function over an iterable.
 * @param {Iterable} iterable - The iterable to loop over.
 * @param {Function} templateFunc - The function to apply to each item in the iterable.
 * @returns {Array} An array of results from applying the template function to each item.
 */
function repeat(iterable, templateFunc) {
  let result = [];
  for (const item of iterable) {
    result.push(templateFunc(item));
  }
  return result
}

/**
 * Maps a function over an iterable.
 * @param {Iterable} iterable - The iterable to map over.
 * @param {Function} mapFunc - The function to apply to each item in the iterable.
 * @returns {Array} An array of results from applying the map function to each item.
 */
function map(iterable, mapFunc) {
  let result = [];
  for (const item of iterable) {
    result.push(mapFunc(item));
  }
  return result
}

/**
 * Generates a string of numbers in a range.
 * @param {number} end - The end of the range (exclusive).
 * @param {number} [start=0] - The start of the range (inclusive).
 * @param {number} [step=1] - The step size between numbers.
 * @returns {string} A concatenated string of numbers in the range.
 */
function range(end, start = 0, step = 1) {
  let result = '';
  for (let i = start; i < end; i += step) {
    result += String(i);
  }
  return result
}

/**
 * Joins an iterable with a separator.
 * @param {Iterable} iterable - The iterable to join.
 * @param {string} joiner - The separator to use between elements.
 * @returns {Array} An array of elements with the joiner inserted between them.
 */
function join(iterable, joiner) {
  let result = [];
  let first = true;
  for (const item of iterable) {
    if (!first) {
      result.push(joiner);
    }
    result.push(item);
    first = false;
  }
  return result
}

/**
 * Marks a string as safe HTML content that should not be escaped.
 * @param {string} value - The HTML content to mark as safe.
 * @returns {SafeString} A SafeString instance containing the safe HTML.
 */
function unsafeHTML(value) {
  return new SafeString(String(value))
}

/**
 * Marks a string as safe MathML content that should not be escaped.
 * @param {string} value - The MathML content to mark as safe.
 * @returns {SafeString} A SafeString instance containing the safe MathML.
 */
function unsafeMathML(value) {
  return new SafeString(String(value))
}

/**
 * Marks a string as safe SVG content that should not be escaped.
 * @param {string} value - The SVG content to mark as safe.
 * @returns {SafeString} A SafeString instance containing the safe SVG.
 */
function unsafeSVG(value) {
  return new SafeString(String(value))
}

/**
 * Returns a string representation of a value if it is defined, otherwise an empty string.
 * @param {*} value - The value to check.
 * @returns {string} The string representation of the value if defined, otherwise an empty string.
 */
function ifDefined(value) {
  return value !== undefined && value !== null ? String(value) : ''
}

/**
 * Executes a function based on a condition.
 * @param {boolean} condition - The condition to evaluate.
 * @param {Function} trueCase - The function to execute if the condition is true.
 * @param {Function} [falseCase] - The function to execute if the condition is false.
 * @returns {*} The result of the executed function, or undefined if no function is executed.
 */
function when(condition, trueCase, falseCase) {
  if (condition) {
    return trueCase()
  } else if (falseCase) {
    return falseCase()
  }
  return undefined
}

/**
 * Chooses a function to execute based on a value matching cases.
 * @param {*} value - The value to match against cases.
 * @param {Array<Array<*|Function>>} cases - An array of [caseValue, func] pairs to match against.
 * @param {Function} [defaultCase] - The default function to execute if no cases match.
 * @returns {*} The result of the executed function, or undefined if no function is executed.
 */
function choose(value, cases, defaultCase) {
  for (const [caseValue, func] of cases) {
    if (value === caseValue) {
      return func()
    }
  }
  if (defaultCase) {
    return defaultCase()
  }
  return undefined
}

/**
 * Determines if the context is an unquoted HTML attribute.
 * @param {string} prevString - The string before the current position.
 * @param {string} nextString - The string after the current position.
 * @returns {boolean} True if the context is an unquoted HTML attribute, false otherwise.
 */
function isUnquotedAttributeContext(prevString, nextString) {
  // A simplified heuristic: check if the previous string ends with an unquoted '=' and the next string doesn't start with a quote.
  // This does NOT cover all edge cases of HTML parsing but handles common lit-html attribute patterns.
  const endsWithUnquotedEquals = /=\s*$/
    .test(prevString) && !/=\s*["']/
    .test(prevString.substring(prevString.lastIndexOf('=') + 1));
  const startsWithNoQuote = !/^["\']/
    .test(nextString.trim());
  
  return endsWithUnquotedEquals && startsWithNoQuote
}

/**
 * Returns a function that synchronously resolves template literals with values, handling escaping and special cases.
 * @param {Object} options - The options object containing the escapeHtml function.
 * @returns {Function} A function that resolves template literals with values.
 */
function getResolveFunction(options = {}) {
  const { escapeHtml } = options;

  /**
   * Synchronously resolves template literals with values, handling escaping and special cases.
   * @param {Array<string>} strings - The array of string parts from the template literal.
   * @param {...*} values - The values to interpolate into the template.
   * @returns {string} The resolved and escaped string.
   */
  function resolveSync(strings, ...values) {
    let parts = [strings[0]];
  
    for (let i = 0; i < values.length; i++) {
      let value = values[i];
  
      // Handle null, undefined and empty string
      if (value === null || value === undefined || value === '') {
        parts.push('');
        parts.push(strings[i + 1]);
        continue
      }
  
      // Handle array values
      if (Array.isArray(value)) {
        for (const item of value) {
          parts.push(resolveSync(['', ''], item));
        }
        parts.push(strings[i + 1]);
        continue
      }
  
      // If it's a lit-html TemplateResult object
      if (typeof value === 'object' && value !== null && value._$litType$) {
        let resolvedTemplateResult = resolveSync(value.strings, ...value.values);
        // If the template result contains spaces and is in an unquoted attribute context,
        // it might need quoting, but this is handled by the general logic below.
        parts.push(resolvedTemplateResult);
        parts.push(strings[i + 1]);
        continue
      }
  
      let resolvedValueString;
      // Handle plain JavaScript objects that are not TemplateResult or SafeString.
      // If a plain object's toString() is '[object Object]', we'll default to an empty string.
      if (typeof value === 'object' && value !== null && !(value instanceof SafeString)) {
          if (value.constructor === Object) {
              resolvedValueString = ''; // Default plain objects to an empty string
          } 
          else {
              resolvedValueString = String(value);
          }
      } 
      else {
          resolvedValueString = String(value);
      }
  
      // First, apply general HTML escaping unless it's a SafeString
      if (!(value instanceof SafeString)) {
        resolvedValueString = escapeHtml(resolvedValueString);
      }
  
      // Then, apply quoting and escaping if it's an unquoted HTML attribute value
      if (isUnquotedAttributeContext(strings[i], strings[i + 1])) {
          // Always wrap in quotes and escape existing double quotes within the string
          resolvedValueString = `"${resolvedValueString.replace(/"/g, '&quot;')}"`;
      }
  
      parts.push(resolvedValueString);
      parts.push(strings[i + 1]);
  
    }
  
    return parts.join('')
  }

  if (options.async) {
    return async function resolveAsync(strings, ...values) {
      // Resolve promises and non-promise values using resolveSync
      const resolvedValues = await Promise.all(
        values.map(async v => {
          let resolved = v;
          if (typeof v === 'object' && v.constructor?.name === 'Promise') {
            resolved = await v;
          }
          // Interpret context using resolveSync for non-promise values, including nested structures
          // For simple values, resolveSync will just convert to string and escape if needed.
          return resolveSync(['', ''], resolved)
        })
      );

      // Monta a string final, intercalando as partes fixas com os valores resolvidos
      let str = strings[0];
      resolvedValues.forEach((value, index) => {
        str += value + strings[index + 1];
      });

      return str
    }
  }
  
  return resolveSync
  
}

/**
 * Parses an error object to extract detailed information including the line number and a snippet of the problematic HTML code.
 * @param {Error} error - The error object containing stack information.
 * @param {string} html - The HTML content associated with the error.
 * @returns {string} A formatted string with error details and a code snippet if a line number is found, otherwise the full error stack.
 */
function parseError (error, html) {
  const stackLines = error.stack.split("\n");
  const errorLine = stackLines[0];
  const match = stackLines[1].match(/<anonymous>:(\d+):\d+/);
  if (match) {
    const lineNumber = parseInt(match[1], 10);
    const htmlLines = html.split("\n");
    const errorSnippet = htmlLines
      .slice(Math.max(0, lineNumber - 2), lineNumber + 1)
      .join("\n");
    return `${errorLine}\n\nFile: ${error.filename}\n\nError Occurred at Line ${lineNumber}:\n${errorSnippet}`
  }

  // Fallback if line number couldn't be determined
  return error.stack 
}

/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * @param {string} str - The input string to escape.
 * @returns {string} The escaped string with HTML entities replaced.
 */
function escapeHtml(str) {
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
function compile(template, options = {}) {
  const context = {
    ...this.options.context,
    ...(options.context || {})
  };

  options = { ...this.options, ...options };

  const {
    openDelimiter,
    closeDelimiter,
    vm: useVM,
    async: useAsync,
    filename,
    litHtml: litHtml$1,
    escapeHtml: useEscapeHtml,
  } = options;

  const partials = this.partials || {};

  let escapedTemplate = template;
  if (openDelimiter !== '${') {
    escapedTemplate = escapedTemplate
      .replace(/\$\{/g, '\\${')
      .replace(openDelimiter, '${');
  }
  if (closeDelimiter !== '}') {
    escapedTemplate = escapedTemplate
      .replace(closeDelimiter, '}');
    // .replace(/\}/g, '\\}')
  }

  options.escapeHtml = useEscapeHtml ? escapeHtml : (str) => str;

  try {
    const resolve = getResolveFunction(options);
    const Lolit = this;
    if (useVM) {
      return (scope) => {
        const templatePrefix = options._isPartial ? 'html' : 'resolve';
        const script = new vm.Script(templatePrefix + '`' + (template) + '`', {
          filename,
          displayErrors: true,
        });
        const sandbox = {
          ...partials,
          ...context,
          ...scope,
          partial() { return Lolit.resolvePartial.apply(Lolit, arguments) },
          html: litHtml.html,
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
        };
        const contextifiedSandbox = vm.createContext(sandbox);
        return script.runInContext(contextifiedSandbox)
      }
    }
    else {
      return new Function('scope', `with(scope) { return ${async ? 'scope._resolve' : ''}\`${escapedTemplate}\`; }`)
    }
  }
  catch (e) {
    const errorDetails = parseError(e, template);
    throw errorDetails
  }
}

function resolvePartial (name, scope = {}, options = {}) {
  if (!this.partials[name]) {
    throw(new Error('Partial not found: ' + name))
  }
  return this.partials[name](scope, options)
}

/**
 * Renders a template with the given scope and options.
 * @param {string} content - The template string to render.
 * @param {Object} [scope={}] - The data object to use as the scope for rendering.
 * @param {Object} [options={}] - Configuration options for rendering.
 * @returns {string} The rendered template as a string.
 */
function render (content, scope = {}, options = {}) {
  Object.assign(this.options, options);
  const template = this.compile(content, options);
  return template(scope)
}

/**
 * Renders a template from a file with the given scope and options.
 * @param {string} filePath - The path to the template file to render.
 * @param {Object} [scope={}] - The data object to use as the scope for rendering.
 * @param {Object} [options={}] - Configuration options for rendering.
 * @returns {string} The rendered template as a string.
 */
function renderFile (filePath, scope = {}, options = {}) {
  const { root, filename = filePath } = options;

  let fullPath = filePath;
  if (!fullPath.startsWith("/")) {
    filePath = path.join(root || process.cwd(), filename);
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  return this.render(fileContent, scope, { ...options, filename })
}

/**
 * Recursively searches for files in a directory that match a given pattern.
 * @param {string} dir - The directory to search in.
 * @param {RegExp} pattern - The pattern to match against the file names.
 * @returns {string[]} An array of file paths that match the pattern.
 */
function getFiles (dir, pattern) {
  let files = [];

  function walk(directory) {
    const items = fs.readdirSync(directory);
    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        walk(itemPath); // Recursivamente percorre subdiretórios
      } else if (stats.isFile() && item.match(pattern)) {
        files.push(itemPath); // Adiciona o caminho do arquivo se corresponder ao padrão
      }
    }
  }

  walk(dir);
  return files
}

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
async function use(arg1, options = {}) {
  if (typeof options === 'string') {
    options = { code: options };
  }
  else if (options.file) {
    options.code = fs.readFileSync(options.file, 'utf8');
  }

  if (options.code) {
    this.partials[arg1] = this.compile(options.code, { ...this.options, ...options });
  }
  else {
    options = { ...this.options, ...options, _isPartial: true };
    const dir = arg1;
    getFiles(`${options.root}/${dir}`, new RegExp(`\\${options.fileExtension}$`, 'i'))
      .forEach(file => {
        const template = fs.readFileSync(file, 'utf8');
        const name = path.relative(`${options.root}/${dir}`, file).replace(new RegExp(`\\${options.fileExtension}$`, 'i'), '');
        options.filename = file;
        this.partials[name] = this.compile(template, options);
      });
  }
}

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
};
/**
 * Lolit - A templating engine for rendering dynamic content.
 * This class provides methods for compiling and rendering templates with customizable options.
 */
class Lolit {

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
    };
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

exports.Lolit = Lolit;
exports.default = Lolit;
