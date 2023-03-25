import arrayReplace from '../src/arrayReplace'


test('returns function that can do the replacement ', () => {
  const baseArray = [1, 2, 3, 4]

  expect(arrayReplace(0, [10, 11], baseArray)).toStrictEqual([10, 11, 3, 4])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayReplace(1, [10, 11], baseArray)).toStrictEqual([1, 10, 11, 4])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayReplace(2, [10, 11], baseArray)).toStrictEqual([1, 2, 10, 11])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayReplace(50, [10, 11], baseArray)).toStrictEqual([1, 2, 3, 4, 10, 11])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
})

test('Requires 3 arguments', () => {
  expect(() => arrayReplace()).toThrow('arrayReplace is no longer curried -you must provide 3 arguments to this function')

  expect(() => arrayReplace(0)).toThrow('arrayReplace is no longer curried -you must provide 3 arguments to this function')
  expect(() => arrayReplace(0, 1)).toThrow('arrayReplace is no longer curried -you must provide 3 arguments to this function')

})