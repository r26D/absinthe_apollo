//      

                                            
                                               

                                           

const updateNotifiers = (
  absintheSocket                ,
  updater                                     
) => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
