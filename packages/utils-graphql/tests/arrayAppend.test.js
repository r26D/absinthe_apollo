import arrayAppend from '../src/arrayAppend'

test('makes a function that can unshift on new element if you only give it 1 argument', () => {
  const baseArray = [1, 2]
  const updater = arrayAppend(baseArray)

  expect(updater([3])).toStrictEqual([3, 1, 2])
  expect(baseArray).toStrictEqual([1,2])
  expect(updater([3,4])).toStrictEqual([3,4, 1, 2])
  expect(baseArray).toStrictEqual([1,2])
})

test('unshifts the element if you give it two arguments', () => {
  const baseArray = [1, 2]

  expect(arrayAppend(baseArray,[3])).toStrictEqual([3, 1, 2])
  expect(baseArray).toStrictEqual([1,2])
  expect(arrayAppend(baseArray,[3,4])).toStrictEqual([3,4, 1, 2])
  expect(baseArray).toStrictEqual([1,2])
})