import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // La recette interroge la base : les suites ne doivent pas se marcher
    // dessus, et la machine ne dispose que de deux cœurs.
    fileParallelism: false,
    environment: 'node',
    testTimeout: 30_000,
  },
});
