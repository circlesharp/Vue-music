import path from 'path';
import url from 'url';
import fs from 'fs';

// const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

let cnt = 1;

export default function gatherRemovedExportsPlugin() {
  return {
    name: 'gatherRemovedExportsPlugin',
    renderChunk(code, chunk) {
      const deps = [];
      for (const moduleKey in chunk.modules) {
        const dep = {
          path: moduleKey,
          renderedExports: chunk.modules[moduleKey]?.renderedExports,
          removedExports: chunk.modules[moduleKey]?.removedExports,
        };

        deps.push(dep);
      }

      fs.writeFileSync(
        path.resolve(__dirname, `./rollup-deps-${cnt++}.json`),
        JSON.stringify(deps)
      );
    },
  };
}
