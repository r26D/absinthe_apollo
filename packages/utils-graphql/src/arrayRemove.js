/**
 * Returns a new Array with the result of having removed the specified amount
 * (count) of elements at the given index.
 */
const arrayRemoveFn = (
  index,
  count,
  array
) => [...array.slice(0, index), ...array.slice(index + count)]
//Original code used curry to do this - but i'm removing the dep
const arrayRemove = (index,
                     count,
                     array) => {
  if (index === undefined || count === undefined || array === undefined) {
    throw 'arrayRemove is no longer curried -you must provide 3 arguments to this function'
  }

  return arrayRemoveFn(index,
    count,
    array)
}
export default arrayRemove