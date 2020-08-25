//      

import {remove as arrayRemove} from "@jumpn/utils-array";

                                                

const removeObserver = (observers, observer) =>
  arrayRemove(observers.indexOf(observer), 1, observers);

const unobserve =                                   (
  {activeObservers, ...rest}                             ,
  observer                             
) => ({
  ...rest,
  activeObservers: removeObserver(activeObservers, observer)
});

export default unobserve;
