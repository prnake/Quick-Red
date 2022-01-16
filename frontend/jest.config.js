module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "vue"],
  reporters: ['default', 'jest-sonar'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.vue',
    '!src/**/components/**/*.vue'
  ],
  coverageDirectory: '<rootDir>/coverage',
  'collectCoverage': true,
  'coverageReporters': [
    'lcov',
    'text-summary'
  ],
  testURL: 'http://localhost/'
}
