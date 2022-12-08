import notifierRefresh from './notifier/refresh.js'
import updateNotifiers from './updateNotifiers.js'

const refreshNotifier = (absintheSocket, notifier) => {
  updateNotifiers(absintheSocket, notifierRefresh(notifier))

  return notifier
}

export default refreshNotifier
