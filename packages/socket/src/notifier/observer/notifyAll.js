//      

                                              

const getNotifier = (handlerName, payload) => observer =>
  observer[handlerName] && observer[handlerName](payload);

const getHandlerName = ({name}) => `on${name}`;

const notifyAll =                                   (
  observers                                             ,
  event       
) => observers.forEach(getNotifier(getHandlerName(event), event.payload));

export default notifyAll;
