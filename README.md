# Lolit

A powerful and flexible templating engine for JavaScript that uses **native JavaScript template literals**. Unlike traditional templating engines that require complex parsing, Lolit compiles templates directly to native JavaScript functions using template literals, providing maximum performance with minimal footprint. 

Supports both server-side and client-side rendering with optional lit-html integration.

## Features

- ⚡ **Native template literals** - Zero-overhead rendering without complex parsing
- 🚀 **Fast template compilation** - Compile templates to optimized native JavaScript functions
- 🔄 **Async support** - Handle asynchronous operations in templates
- 🧩 **Partial templates** - Reusable template components
- 🛡️ **HTML escaping** - Automatic XSS protection (configurable)
- 🎨 **Built-in directives** - Rich set of directives for common template operations
- 📁 **File-based templates** - Load templates from files
- ⚙️ **Highly configurable** - Customizable delimiters, root paths, and more

## Installation

```bash
npm install lolit
```

## Basic Usage

```javascript
import lolit from 'lolit'

// Simple template rendering
const result = lolit.render('<h1>Hello ${name}!</h1>', { name: 'World' })

// Render from file contents
const result = lolit.renderFile('template.lit.html', { name: 'World' })

// Compile template for reuse
const template = lolit.compile('<h1>Hello ${name}!</h1>')
const result = template({ name: 'World' })
```

## Why Lolit?

### Native Template Literals = Maximum Performance

Lolit's core innovation is compiling templates directly to **native JavaScript template literals**, eliminating the overhead of traditional templating engines. This brings several benefits:

- **Zero runtime overhead** - Templates execute as fast as native JavaScript
- **Smaller bundle size** - No heavy parsing or virtual DOM libraries
- **Familiar syntax** - Uses standard JavaScript template literal syntax
- **Better performance** - Direct string interpolation without abstraction layers
- **Easier debugging** - Generated functions are readable JavaScript code

## Examples

### Template Compilation

```javascript
import lolit from 'lolit'

// Compile a template
const template = lolit.compile('<div class="greeting">Hello ${name}!</div>')

// Use the compiled template
const result = template({ name: 'Alice' })
console.log(result) // <div class="greeting">Hello Alice!</div>
```

### File-based Templates

```javascript
// Load and render from file
const result = lolit.renderFile('templates/welcome.lit.html', { 
  name: 'Mr Anderson' 
})
```

### Object and Array Support

```javascript
// Object properties
const template = lolit.compile(`
  <p>Movie: ${movie.name} (${movie.year})</p>
`)
const result = template({ 
  movie: { name: 'The Matrix', year: 1999 } 
})

// Array access
const petTemplate = lolit.compile(`
  <p>My pets: ${pets[0]} and ${pets[1]}</p>
`)
const petResult = petTemplate({ pets: ['rabbit', 'dog'] })
```

## Configuration Options

Lolit provides extensive configuration options to customize its behavior. You can configure options globally or per instance.

### Creating a Configured Instance

```javascript
import { Lolit } from 'lolit'

const renderer = new Lolit({
  root: './templates',
  async: true,
  escapeHtml: false,
  fileExtension: '.html',
  openDelimiter: '{{',
  closeDelimiter: '}}'
})
```

### Complete Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `root` | `string` | `process.cwd()` | Root directory for resolving template files and partials |
| `async` | `boolean` | `false` | Enable asynchronous template rendering and async function support |
| `escapeHtml` | `boolean` | `true` | Automatically escape HTML entities to prevent XSS attacks |
| `openDelimiter` | `string` | `'${'` | Opening delimiter for template expressions |
| `closeDelimiter` | `string` | `'}'` | Closing delimiter for template expressions |
| `fileExtension` | `string` | `'.lit.html'` | Default file extension when resolving partials |
| `filename` | `string` | `undefined` | Name of the current file being rendered (for error reporting) |
| `vm` | `boolean` | `true` | Use Node.js VM module for template execution |
| `directives` | `boolean` | `true` | Enable built-in directives support |
| `context` | `object` | `{}` | Global context object available to all templates |
| `partials` | `object` | `{}` | Pre-registered partial templates |

### Option Examples

#### Custom Delimiters

```javascript
const renderer = new Lolit({
  openDelimiter: '{{',
  closeDelimiter: '}}'
})

const template = renderer.compile('<h1>Hello {{name}}!</h1>')
const result = template({ name: 'World' })
console.log(result) // <h1>Hello World!</h1>
```

#### Root Directory Configuration

```javascript
const renderer = new Lolit({
  root: './src/templates',
  fileExtension: '.html'
})

// Will look for partials in ./src/templates/*.html
renderer.use('header')
```

#### Global Context

```javascript
const renderer = new Lolit({
  context: {
    siteName: 'My Website',
    version: '1.0.0',
    currentYear: new Date().getFullYear()
  }
})

const template = renderer.compile('<footer>${siteName} © ${currentYear} - v${version}</footer>')
const result = template({})
console.log(result) // <footer>My Website © 2024 - v1.0.0</footer>
```

#### Async Configuration

```javascript
const asyncRenderer = new Lolit({
  async: true,
  context: {
    fetchData: async (url) => {
      const response = await fetch(url)
      return response.json()
    }
  }
})

const template = asyncRenderer.compile('<div>Data: ${fetchData("/api/data")}</div>')
const result = await template({})
```

#### Security Configuration

```javascript
// For trusted content (admin panels, etc.)
const trustedRenderer = new Lolit({
  escapeHtml: false,
  vm: true
})

// For user-generated content (maximum security)
const secureRenderer = new Lolit({
  escapeHtml: true,
  vm: false,
  directives: false  // Disable built-in directives
})
```

## Advanced Features

### Async Templates

```javascript
import { Lolit } from 'lolit'

const asyncRenderer = new Lolit({ async: true })

const result = await asyncRenderer.render(
  'Weather: ${getWeather()}',
  { 
    getWeather: async () => {
      // Simulate API call
      return 'Sunny, 75°F'
    }
  }
)
```

### Partial Templates

```javascript
import { Lolit } from 'lolit'

const renderer = new Lolit()

// Register a partial (loads from file system)
renderer.use('path/to/partials')

// Use the partial in templates
const result = renderer.render(`
  User: ${partial("userCard", { name: "John" })}
`)

// Or use the partial as a function
const result = renderer.render(`
  User: ${userCard({ name: "John" })}
`)
```

### HTML Escaping Control

```javascript
import { Lolit } from 'lolit'

// Disable HTML escaping for trusted content
const adminRenderer = new Lolit({ escapeHtml: false })

const result = adminRenderer.render(
  '<div>Status: ${statusMessage}</div>',
  { statusMessage: '<span class="success">Online</span>' }
)
```

## Directives

Lolit offers built-in directive functions with names similar to lit-html, but custom implementations optimized for its template literal approach.

| Directive | Purpose |
|-----------|---------|
| `classMap(obj)` | Turns an object of class toggles into a class string |
| `styleMap(obj)` | Converts an object of styles to an inline style string |
| `repeat(arr, fn)` | Loops over an iterable and renders a fragment for each item |
| `map(arr, fn)` | Maps an array to fragments (alias for repeat) |
| `range(n [, start, step])` | Generates a numeric range as a string |
| `join(arr, sep)` | Joins array items with a separator |
| `unsafeHTML(str)` | Inserts raw HTML without escaping |
| `unsafeSVG(str)` | Inserts raw SVG markup without escaping |
| `unsafeMathML(str)` | Inserts raw MathML markup without escaping |
| `ifDefined(val)` | Renders a value only if it is defined/non-null |
| `when(cond, t, f)` | Conditional rendering helper |
| `choose(val, cases, def?)` | Switch/case style helper for selective rendering |

### Safe HTML Rendering

**unsafeHTML(content)** - Renders raw HTML content without escaping. Use with trusted content only.

```html
<div>${unsafeHTML(content)}</div>
```

**unsafeSVG(svg)** - Renders raw SVG content without escaping.

```html
<button>${unsafeSVG(icon)}</button>
```

**unsafeMathML(math)** - Renders raw MathML content without escaping.

```html
<div class="equation">${unsafeMathML(formula)}</div>
```

### Conditional Rendering

**when(condition, trueValue, falseValue)** - Renders different content based on a condition.

```html
<div>${when(hasPromotion, () => "Sale Active!", () => "Regular prices")}</div>
```

### List Rendering

**repeat(array, callback)** - Iterates over an array and renders content for each item.

```html
<ul>${repeat(items, (item) => html`<li>${item}</li>`)}</ul>
```

**map(array, callback)** - Maps over an array and renders content for each item.

```html
<ul>${map(fruits, (fruit) => html`<li>${fruit}</li>`)}</ul>
```

### Style and Class Management

**styleMap(styles)** - Converts an object of styles to a CSS style string.

```html
<div style="${styleMap({ color: 'red', padding: '10px' })}">Styled content</div>
```

**classMap(classes)** - Converts an object of class conditions to a CSS class string.

```html
<button class="${classMap({ active: true, disabled: false })}">Button</button>
```

### Other Directives

**join(array, separator)** - Joins array elements into a string with a separator.

```html
<div>Tags: ${join(tags, ' • ')}</div>
```

**range(count)** - Generates a sequence of numbers from 0 to count-1.

```html
<div>Pages: ${range(5)}</div>
```

**choose(value, choices)** - Selects and renders content based on a matching value.

```html
<main>
  ${choose(currentPage, [
    ['home', () => html`<h1>Home Page</h1>`],
    ['about', () => html`<h1>About Us</h1>`],
    ['contact', () => html`<h1>Contact</h1>`]
  ])}
</main>
```

## Special Values

Lolit handles special values that render as empty content:

```javascript
// These values render as empty content
const template = lolit.compile('<div>${value}</div>')

template({ value: null })        // <div></div>
template({ value: undefined })   // <div></div>
template({ value: '' })          // <div></div>
template({ value: nothing })     // <div></div> (special nothing value)
```

## Error Handling

Lolit provides helpful error messages for template syntax issues:

```javascript
try {
  lolit.compile('<div>Invalid ${syntax```here}</div>')
} catch (error) {
  console.error('Template syntax error:', error.message)
}
```

## API Reference

### Static Methods

- `lolit.compile(template, options)` - Compile template to function
- `lolit.render(template, data, options)` - Render template with data
- `lolit.renderFile(filename, data, options)` - Render template from file
- `lolit.use(partialName, options)` - Register partial template

### Instance Methods

- `new Lolit(options)` - Create configured instance
- `instance.compile(template)` - Compile with instance options
- `instance.render(template, data)` - Render with instance options
- `instance.renderFile(filename, data)` - Render file with instance options
- `instance.use(partialName)` - Register partial with instance

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
