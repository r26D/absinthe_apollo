import arrayRemove from '../src/arrayRemove'


test('returns function that can do the removal ', () => {
  const baseArray = [1, 2, 3, 4]

  expect(arrayRemove(0, 0, baseArray)).toStrictEqual([1, 2, 3, 4])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayRemove(0, 1, baseArray)).toStrictEqual([2, 3, 4])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayRemove(0, 2, baseArray)).toStrictEqual([3, 4])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
  expect(arrayRemove(0, 50, baseArray)).toStrictEqual([])
  expect(baseArray).toStrictEqual([1, 2, 3, 4])
})

test('Requires 3 arguments', () => {
  expect(() => arrayRemove()).toThrow('arrayRemove is no longer curried -you must provide 3 arguments to this function')

  expect(() => arrayRemove(0)).toThrow('arrayRemove is no longer curried -you must provide 3 arguments to this function')
  expect(() => arrayRemove(0, 1)).toThrow('arrayRemove is no longer curried -you must provide 3 arguments to this function')

})