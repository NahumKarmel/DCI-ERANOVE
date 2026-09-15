import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      // Chemin d'import du projet, aligné sur tsconfig.json.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // `server-only` n'existe qu'à la compilation Next ; voir la doublure.
      'server-only': fileURLToPath(
        new URL('./tests/aides/server-only.ts', import.meta.url),
      ),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // La recette interroge la base : les suites ne doivent pas se marcher
    // dessus, et la machine ne dispose que de deux cœurs.
    fileParallelism: false,
    environment: 'node',
    testTimeout: 30_000,
  },
});
