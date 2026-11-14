import { existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const extensions = [".ts", ".tsx", ".js", ".mjs"]

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context)

  const base = join(root, specifier.slice(2))
  const candidates = [base, ...extensions.map((extension) => base + extension)]
  const match = candidates.find((candidate) => existsSync(candidate))
  if (!match) return nextResolve(specifier, context)
  return nextResolve(pathToFileURL(match).href, context)
}
