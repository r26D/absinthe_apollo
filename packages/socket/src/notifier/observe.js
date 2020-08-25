//      

                                                

const observe =                                   (
  {activeObservers, ...rest}                             ,
  observer                             
) => ({
  ...rest,
  activeObservers: [...activeObservers, observer],
  isActive: true
});

export default observe;
