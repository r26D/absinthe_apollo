//      

                                      

const reactivate =                                   (
  notifier                             
) => (notifier.isActive ? notifier : {...notifier, isActive: true});

export default reactivate;
