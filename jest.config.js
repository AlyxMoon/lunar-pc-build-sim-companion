module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts, vue}',
    '!src/main.ts',
  ],
  coverageDirectory: '<rootDir>/tests/coverage',
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  roots: [
    '<rootDir>/tests/unit',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
}
