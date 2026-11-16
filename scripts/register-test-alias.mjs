import { register } from "node:module"

// Node's test runner does not read tsconfig paths. This loads the @/ alias
// before the tests import pricing.ts and checkout.ts.
register(new URL("./resolve-at-alias.mjs", import.meta.url))
