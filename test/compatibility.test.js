/**
 * @jest-environment jsdom
 */

// Helper to dynamically import ESM bundle path relative to repo root
async function loadModule (path) {
  return await import(new URL(path, import.meta.url))
}

describe('Bundle compatibility', () => {
  test('Node bundle exposes full features (vm enabled)', async () => {
    const { default: Lolit } = await loadModule('../dist/lolit.node.mjs')
    expect(Lolit.options.vm).toBe(true)

    // compile a simple expression and ensure it evaluates using VM
    const tplFn = Lolit.compile.call(Lolit, '${ 40 + 2 }')
    const result = tplFn({})
    expect(result).toBe('42')
  })

  test('Browser bundle is DOM-safe (vm disabled)', async () => {
    const { default: LolitBrowser } = await loadModule('../dist/lolit.browser.mjs')
    expect(LolitBrowser.options.vm).toBe(false)

    const tplFn = LolitBrowser.compile.call(LolitBrowser, '${ 21 * 2 }')
    const result = tplFn({})
    expect(result).toBe('42')
  })
}) 