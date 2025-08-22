# Security notes: bcrypt testing stub

We previously had a root-level file named `test-bcrypt.js` containing non-code content, which caused TypeScript/JS parsers to report thousands of errors during builds. That file has been removed to avoid noise.

If you need to test bcrypt locally, create a one-off script under `scripts/` (e.g. `scripts/test-bcrypt.mjs`) and run it directly with Node. Avoid placing test scripts at the repository root where they can be picked up by build tools.

Example snippet:

```js
// scripts/test-bcrypt.mjs
import bcrypt from 'bcryptjs';

const password = 'example';
const hash = await bcrypt.hash(password, 10);
console.log({ hash, matches: await bcrypt.compare(password, hash) });
```

Note: Types are shimmed via `types/bcryptjs.d.ts` for the application code; for scripts, use JS/ESM and avoid bringing them into the app's TypeScript project.
