import { Environment } from 'vitest/environments';

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Setting up Prisma test environment');

    return {
      async teardown() {
        console.log('Tearing down Prisma test environment');
      },
    };
  },
};
