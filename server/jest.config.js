/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  silent: false, //false lets jest to show console.log,
  detectOpenHandles: true, //see which test has problems instead of seeing some circular json thing
};