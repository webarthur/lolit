import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [
  // Node (backend)
  {
    input: 'lolit.node.js',
    external: ['vm', 'fs', 'path', 'lit-html'],
    output: [
      { file: 'dist/lolit.node.mjs', format: 'esm' },
      { file: 'dist/lolit.node.cjs', format: 'cjs', exports: 'named' }
    ],
    plugins: [resolve(), commonjs()]
  },
  // Browser (frontend)
  {
    input: 'lolit.browser.js',
    output: [
      { file: 'dist/lolit.browser.mjs', format: 'esm' },
      { file: 'dist/lolit.browser.cjs', format: 'cjs', exports: 'named' }
    ],
    plugins: [resolve({ browser: true, preferBuiltins: false }), commonjs()]
  }
]
