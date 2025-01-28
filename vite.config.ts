import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    workspace: [
      {
        extends: true,
        test: {
          include: ['src/http/**/*.spec.ts'],
          name: 'e2e',
          environment: 'prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
});
