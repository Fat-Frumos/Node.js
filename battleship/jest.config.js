export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.jsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
