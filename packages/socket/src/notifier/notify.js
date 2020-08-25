//      

import observerNotifyAll from "./observer/notifyAll";

                                             

const getObservers = ({activeObservers, canceledObservers}) => [
  ...activeObservers,
  ...canceledObservers
];

const notify =                                   (
  notifier                             ,
  event       
) => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
