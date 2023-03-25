import compositeHasIn from '../src/compositeHasIn'

test('handles if the items are deeply equal at the right path - array', () => {
  const baseArray = [1, 2, [1, 2]]


  expect(compositeHasIn([0], 1, baseArray)).toBeTruthy()
  expect(compositeHasIn([1], 1, baseArray)).toBeFalsy()
  expect(compositeHasIn([2, 0], 1, baseArray)).toBeTruthy()

})

test('handles if the items are deeply equal at the right path - object', () => {
  const invoice = { id: 1, name: '21' }
  const alt_invoice = { id: 1, name: '21', bad: true }
  const baseObj = {
    name: 'Sam',
    age: 21,
    address: { street: '123 Main St.' },
    invoices: [invoice]
  }


  expect(compositeHasIn(['name'], 'Sam', baseObj)).toBeTruthy()
  expect(compositeHasIn(['age'], 'Same', baseObj)).toBeFalsy()
  expect(compositeHasIn(['invoices', 0], invoice, baseObj)).toBeTruthy()
  expect(compositeHasIn(['invoices', 0], alt_invoice, baseObj)).toBeFalsy()

})
test('can return a function that is curried', () => {
  const invoice = { id: 1, name: '21' }
  const baseObj = {
    name: 'Sam',
    age: 21,
    address: { street: '123 Main St.' },
    invoices: [invoice]
  }
  const finderWithPathValue = compositeHasIn(['name'], 'Sam')
  const finderWithPath = compositeHasIn(['name'])

  expect(finderWithPathValue(baseObj)).toBeTruthy()
  expect(finderWithPathValue({ name: 'Will' })).toBeFalsy()

  expect(finderWithPath('Sam', baseObj)).toBeTruthy()
  expect(finderWithPath('Sam', { name: 'Will' })).toBeFalsy()
})