import { errorsToString } from '../src'


test("Generates string version of the GraphqlError", () => {
  const gqlRespose = {
    errors: [
      {message: "First Error", locations: [{column: 10, line: 2}]},
      {message: "Second Error", locations: [{column: 2, line: 4}]}
    ]
  }
  expect(errorsToString(gqlRespose.errors)).toStrictEqual("First Error (2:10)\nSecond Error (4:2)")

})