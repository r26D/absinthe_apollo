/**
 * Returns a new Array with elements appended to the one given.
 */
const arrayAppendFn = (
  elements,
  array
) => [...array, ...elements]
//Original code used curry to do this - but i'm removing the dep
const arrayAppend = (array, elements) => {
  if (elements === undefined) {
    return (e) => arrayAppendFn(array, e)
  }
  return arrayAppendFn(array, elements)
}
export default arrayAppend


