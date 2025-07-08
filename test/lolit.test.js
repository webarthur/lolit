import lolit from '../lolit.js'
import { Lolit } from '../lolit.js'
import assert from 'assert'
import { html } from 'lit-html'

describe('lolit', () => {

  it('should be a class', () => {
    assert.equal(typeof Lolit, 'function')
  })

  it('should throw SyntaxError for invalid template syntax', () => {
    const templateEngine = new Lolit()
    assert.throws(() => templateEngine.render('<h1>Welcome ${user.firstName} ${```user.lastName}</h1>'), /SyntaxError/)
  })

  it('should render without using lit-html for simple email template', () => {
    const emailRenderer = new Lolit({ litHtml: false })
    const emailContent = emailRenderer.render('<h2>Hello ${customerName}!</h2>', { customerName: 'Maria Silva' })
    assert.equal(emailContent, '<h2>Hello Maria Silva!</h2>')
  })

  it('should support async operations for fetching weather data', async () => {
    const asyncRenderer = new Lolit({ async: true })
    const weatherTemplate = await asyncRenderer.render('Today in ${city}: ${getWeather()}', { 
      city: 'New York',
      getWeather: async () => 'Sunny, 75°F' 
    })
    assert.equal(weatherTemplate, 'Today in New York: Sunny, 75°F')
  })

  it('can disable HTML escaping for trusted admin content', () => {
    const adminRenderer = new Lolit({ escapeHtml: false })
    const adminPanel = adminRenderer.render('<div>Status: ${statusMessage}</div>', { 
      statusMessage: '<span class="success">System Online</span>' 
    })
    assert.equal(adminPanel, '<div>Status: <span class="success">System Online</span></div>')
  })

  it('can instantiate Lolit for blog posts', () => {
    const blogRenderer = new Lolit()
    const blogPost = blogRenderer.render('<article><h1>${title}</h1></article>', { title: 'Chocolate Cake Recipe' })
    assert.equal(blogPost, '<article><h1>Chocolate Cake Recipe</h1></article>')
  })

  it('should support partials for reusable product card', () => {
    const shopRenderer = new Lolit()
    shopRenderer.use('test')
    const productPage = shopRenderer.render('Product: ${test({ name: "Smartphone" })}')
    assert.equal(productPage, 'Product: <p>Hello Smartphone</p>')
  })

  it('should support partials with explicit partial function for user profile', () => {
    const profileRenderer = new Lolit()
    profileRenderer.use('test')
    const userProfile = profileRenderer.render('User: ${partial("test", { name: "Ana Costa" })}')
    assert.equal(userProfile, 'User: <p>Hello Ana Costa</p>')
  })

  it('should compile from file for newsletter template', () => {
    const newsletter = lolit.renderFile('test/test.lit.html', { name: 'John Smith' })
    assert.equal(newsletter, '<p>Hello John Smith</p>')
  })

  it('should render restaurant menu from string', () => {
    const menuItem = lolit.render('<div class="dish">${dishName}</div>', { dishName: 'Grilled Salmon' })
    assert.equal(menuItem, '<div class="dish">Grilled Salmon</div>')
  })

  it('should be a function', () => {
    assert.equal(typeof lolit, 'function')
  })

  it('compile to a function for static footer', () => {
    const footerTemplate = lolit.compile('<footer>© 2024 My Company</footer>')
    assert.equal(footerTemplate(), '<footer>© 2024 My Company</footer>')
  })

  it('empty input works for placeholder content', () => {
    const emptyTemplate = lolit.compile('')
    assert.equal(emptyTemplate(), '')
  })

  it('variables work for customer greeting', () => {
    const greetingTemplate = lolit.compile('<h1>Welcome, ${customerName}!</h1>')
    assert.equal(greetingTemplate({ customerName: 'Carlos Oliveira' }), '<h1>Welcome, Carlos Oliveira!</h1>')
  })

  it('should support nothing for optional content', () => {
    const optionalTemplate = lolit.compile('<div class="notification">${nothing}</div>')
    assert.equal(optionalTemplate({}), '<div class="notification"></div>')
  })

  it('variables work with objects for employee info', () => {
    const employeeTemplate = lolit.compile('<p>Employee: ${employee.firstName} ${employee.lastName}</p>')
    const employeeData = { employee: { firstName: 'Fernanda', lastName: 'Santos' } }
    assert.equal(employeeTemplate(employeeData), '<p>Employee: Fernanda Santos</p>')
  })

  it('variables work with arrays for pet names', () => {
    const petTemplate = lolit.compile('<p>My pets: ${pets[0]} and ${pets[1]}</p>')
    const petData = { pets: ['Rex', 'Mimi'] }
    assert.equal(petTemplate(petData), '<p>My pets: Rex and Mimi</p>')
  })

  it('should remove null, undefined, empty string, and nothing values from notification', () => {
    const notificationTemplate = lolit.compile('<div class="alert">${null}${undefined}${""}${nothing}</div>')
    assert.equal(notificationTemplate({}), '<div class="alert"></div>')
  })

  it('should escape HTML in user comments', () => {
    const commentTemplate = lolit.compile('<div class="comment">${userComment}</div>')
    const maliciousComment = { userComment: '<script>alert("Hacked!")</script>' }
    assert.equal(commentTemplate(maliciousComment), '<div class="comment">&lt;script&gt;alert(&quot;Hacked!&quot;)&lt;/script&gt;</div>')
  })

  it('should support repeat for navigation menu', () => {
    const menuItems = [html`<li>Home</li>`, html`<li>Products</li>`, html`<li>Contact</li>`]
    const navTemplate = lolit.compile('<ul class="nav">${menuItems}</ul>')
    assert.equal(navTemplate({ menuItems }), '<ul class="nav"><li>Home</li><li>Products</li><li>Contact</li></ul>')
  })

  it('should support unsafeHTML for rich text content', () => {
    const contentTemplate = lolit.compile('<div class="content">${unsafeHTML(htmlContent)}</div>')
    const richContent = { htmlContent: '<strong>Special offer</strong>: <em>50% off</em>' }
    assert.equal(contentTemplate(richContent), '<div class="content"><strong>Special offer</strong>: <em>50% off</em></div>')
  })

  it('should support unsafeSVG for icons', () => {
    const iconTemplate = lolit.compile('<button>${unsafeSVG(icon)}</button>')
    const iconData = { icon: '<svg viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg>' }
    assert.equal(iconTemplate(iconData), '<button><svg viewBox="0 0 24 24"><path d="M12 2l10 10-10 10L2 12z"/></svg></button>')
  })

  it('should support unsafeMathML for mathematical formulas', () => {
    const formulaTemplate = lolit.compile('<div class="equation">${unsafeMathML(formula)}</div>')
    const mathData = { formula: '<math><mi>E</mi><mo>=</mo><mi>mc</mi><msup><mi>c</mi><mn>2</mn></msup></math>' }
    assert.equal(formulaTemplate(mathData), '<div class="equation"><math><mi>E</mi><mo>=</mo><mi>mc</mi><msup><mi>c</mi><mn>2</mn></msup></math></div>')
  })

  it('should support when for conditional promotion banner', () => {
    const promoTemplate = lolit.compile('<div>${when(hasPromotion, () => "Sale Active!", () => "No promotions available")}</div>')
    assert.equal(promoTemplate({ hasPromotion: true }), '<div>Sale Active!</div>')
    assert.equal(promoTemplate({ hasPromotion: false }), '<div>No promotions available</div>')
  })

  it('should support repeat for shopping cart items', () => {
    const cartTemplate = lolit.compile('<div class="cart">${repeat(products, (product) => html`<div class="item">${product}</div>`)}</div>')
    const cartData = { products: ['Gaming Laptop', 'Wireless Mouse', 'Mechanical Keyboard'] }
    assert.equal(cartTemplate(cartData), '<div class="cart"><div class="item">Gaming Laptop</div><div class="item">Wireless Mouse</div><div class="item">Mechanical Keyboard</div></div>')
  })

  it('should support styleMap for dynamic product styling', () => {
    const productTemplate = lolit.compile('<div class="product" style="${styleMap({ backgroundColor: "lightblue", padding: "20px", borderRadius: "8px" })}">Premium Laptop</div>')
    assert.equal(productTemplate({}), '<div class="product" style="background-color: lightblue; padding: 20px; border-radius: 8px">Premium Laptop</div>')
  })

  it('should support classMap for button states', () => {
    const buttonTemplate = lolit.compile('<button class="${classMap({ active: true, disabled: false, premium: true })}">Buy Now</button>')
    assert.equal(buttonTemplate({}), '<button class="active premium">Buy Now</button>')
  })

  it('should support range for pagination', () => {
    const paginationTemplate = lolit.compile('<div class="pages">${range(5)}</div>')
    assert.equal(paginationTemplate({}), '<div class="pages">01234</div>')
  })

  it('should support map for fruit list', () => {
    const fruitTemplate = lolit.compile('<ul>${map(fruits, (fruit) => html`<li>* ${fruit}</li>`)}</ul>')
    const fruitData = { fruits: ['Apple', 'Banana', 'Orange', 'Mango'] }
    assert.equal(fruitTemplate(fruitData), '<ul><li>* Apple</li><li>* Banana</li><li>* Orange</li><li>* Mango</li></ul>')
  })

  it('should support join for tags display', () => {
    const tagsTemplate = lolit.compile('<div class="tags">Tags: ${join(tags, " • ")}</div>')
    const blogPost = { tags: ['JavaScript', 'Frontend', 'Templates', 'Lit-HTML'] }
    assert.equal(tagsTemplate(blogPost), '<div class="tags">Tags: JavaScript • Frontend • Templates • Lit-HTML</div>')
  })

  it('should support choose for navigation sections', () => {
    const navigationTemplate = lolit.compile("<main>${choose(currentPage, [\
      ['home', () => html`<h1>Home Page</h1>`],\
      ['about', () => html`<h1>About Us</h1>`],\
      ['contact', () => html`<h1>Contact</h1>`],\
      ['products', () => html`<h1>Products</h1>`]\
    ])}</main>")
    assert.equal(navigationTemplate({ currentPage: 'products' }), '<main><h1>Products</h1></main>')
  })

})



