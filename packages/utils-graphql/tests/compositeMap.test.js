import compositeMap from '../src/compositeMap'

test('handles mappping for an array', () => {
  const baseArray = [1, 2]
  const mapper = (x) => x + 10


  expect(compositeMap(mapper, baseArray)).toStrictEqual([11,12])
  expect(baseArray).toStrictEqual([1,2])
})
test('handles mappping for an object', () => {
  const baseObj = { "name": "Sam", "age": 21}

  const mapper = (value, key, obj) => {
    return  `${key} is ${value}`
  }

  expect(compositeMap(mapper, baseObj)).toStrictEqual({ "name": "name is Sam", "age": "age is 21"})
  expect(baseObj).toStrictEqual({ "name": "Sam", "age": 21})
})
test("Requires 2 arguments", () => {
  const mapper = (x) => x + 10

  expect(() => compositeMap(mapper)).toThrow("compositeMap is no longer curried -you must provide two arguments to this function");

});