import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'lolit.js',
    output: [
      { file: 'dist/lolit.mjs', format: 'esm' },
      { file: 'dist/lolit.cjs', format: 'cjs' }
    ],
    plugins: [resolve(), commonjs()]
  }
]
