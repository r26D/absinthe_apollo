//      

import observerNotifyAll from "./observer/notifyAll";

                                             

const notifyActive =                                   (
  notifier                             ,
  event       
) => {
  observerNotifyAll(notifier.activeObservers, event);

  return notifier;
};

export default notifyActive;
