//

import notifierRefresh from './notifier/refresh'
import updateNotifiers from './updateNotifiers'

const refreshNotifier = (absintheSocket, notifier) => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier))

  return notifier
}

export default refreshNotifier
