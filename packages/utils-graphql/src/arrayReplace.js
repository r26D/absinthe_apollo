/**
 * Returns a new Array with the result of having replaced the elements at the
 * given index with the ones specified.
 */
const arrayReplaceFn = (
  index,
  elements,
  array
) => [
  ...array.slice(0, index),
  ...elements,
  ...array.slice(index + elements.length)
]

const arrayReplace = (index,
                      elements,
                      array) => {
  if (index === undefined || elements === undefined || array === undefined) {
    throw 'arrayReplace is no longer curried -you must provide 3 arguments to this function'
  }

  return arrayReplaceFn(index,
    elements,
    array)
}
export default arrayReplace