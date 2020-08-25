//      

                                      

const cancel =                                   ({
  activeObservers,
  canceledObservers,
  ...rest
}                             ) => ({
  ...rest,
  isActive: false,
  activeObservers: [],
  canceledObservers: [...activeObservers, ...canceledObservers]
});

export default cancel;
