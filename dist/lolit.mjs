import vm from 'vm';
import { join as join$1, relative } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.trustedTypes,s=i?i.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o="?"+h,n=`<${o}>`,r=document,l=()=>r.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r.createTreeWalker(r,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s?s.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i?i.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.0");

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
    litHtml,
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
          html: x,
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
    filePath = join$1(root || process.cwd(), filename);
  }

  const fileContent = readFileSync(fullPath, "utf-8");
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
    const items = readdirSync(directory);
    for (const item of items) {
      const itemPath = join$1(directory, item);
      const stats = statSync(itemPath);
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
    options.code = readFileSync(options.file, 'utf8');
  }

  if (options.code) {
    this.partials[arg1] = this.compile(options.code, { ...this.options, ...options });
  }
  else {
    options = { ...this.options, ...options, _isPartial: true };
    const dir = arg1;
    getFiles(`${options.root}/${dir}`, new RegExp(`\\${options.fileExtension}$`, 'i'))
      .forEach(file => {
        const template = readFileSync(file, 'utf8');
        const name = relative(`${options.root}/${dir}`, file).replace(new RegExp(`\\${options.fileExtension}$`, 'i'), '');
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

export { Lolit, Lolit as default };
