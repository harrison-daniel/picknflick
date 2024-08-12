// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app directory
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  // Remove or comment out the setupFilesAfterEnv if not needed
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

module.exports = createJestConfig(customJestConfig);
