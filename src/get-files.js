import { readdirSync, statSync } from 'fs'
import { join } from 'path'

/**
 * Recursively searches for files in a directory that match a given pattern.
 * @param {string} dir - The directory to search in.
 * @param {RegExp} pattern - The pattern to match against the file names.
 * @returns {string[]} An array of file paths that match the pattern.
 */
export default function (dir, pattern) {
  let files = []

  function walk(directory) {
    const items = readdirSync(directory)
    for (const item of items) {
      const itemPath = join(directory, item)
      const stats = statSync(itemPath)
      if (stats.isDirectory()) {
        walk(itemPath) // Recursivamente percorre subdiretórios
      } else if (stats.isFile() && item.match(pattern)) {
        files.push(itemPath) // Adiciona o caminho do arquivo se corresponder ao padrão
      }
    }
  }

  walk(dir)
  return files
}