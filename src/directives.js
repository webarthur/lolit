

/**
 * A marker class for content that should not be escaped.
 * @class
 * @param {string} value - The value to be marked as safe.
 */
class SafeString {
  constructor(value) {
    this.value = value
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
  const activeClasses = Object.keys(classInfo).filter(key => classInfo[key])
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
    .map(key => `${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}: ${styleInfo[key]}`)
  return styles.join('; ')
}

/**
 * Repeats a template function over an iterable.
 * @param {Iterable} iterable - The iterable to loop over.
 * @param {Function} templateFunc - The function to apply to each item in the iterable.
 * @returns {Array} An array of results from applying the template function to each item.
 */
function repeat(iterable, templateFunc) {
  let result = []
  for (const item of iterable) {
    result.push(templateFunc(item))
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
  let result = []
  for (const item of iterable) {
    result.push(mapFunc(item))
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
  let result = ''
  for (let i = start; i < end; i += step) {
    result += String(i)
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
  let result = []
  let first = true
  for (const item of iterable) {
    if (!first) {
      result.push(joiner)
    }
    result.push(item)
    first = false
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

export {
  SafeString,
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
}
