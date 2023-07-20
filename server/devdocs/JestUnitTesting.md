# Jest Unit Testing 

This document will talk about how to use Jest for unit testing.

## Creating Tests

To create a Jest test: 
1. Locate a location where you would like to store your test. A good location is near the class files you are testing.
2. Create a new file with a .test.ts extension. E.g. Artifact.test.ts
3. Inside the file create a describe statement. This is where you can group tests.
```
describe("Artifact Tests", ()=> {
    ...
})
```
4. Inside the second arg of the describe statement create a new test statement.
```
describe("Artifact Tests", ()=> {
    test("Equiping a artifact grants the player its stats and effects", ()=>{
        ...
    })
})
```
5. Use expect() statements to run checks that can be used to match expected value with computed values. In the example below, we are expecting the status of an artifact to be selected.
```
describe("Artifact Tests", ()=> {
    test("Equiping a artifact grants the player its stats and effects", ()=>{
        ...
        expect(fullyUpgradedTestArtifact.data.status).toBe("selected");
        ...
    })
})
```


## Running Tests

To run all tests on the server:
1. Change into the server directory
2. npm run test
```
cd server
npm run test
```

### Running test that matches a pattern

You can choose which test to run with the -t flag and a pattern. All test names that matches the pattern will be ran.
```
// runs only the tests that matches 'Dungeon Manager'
npm run test -t 'Dungeon Manager'
```
