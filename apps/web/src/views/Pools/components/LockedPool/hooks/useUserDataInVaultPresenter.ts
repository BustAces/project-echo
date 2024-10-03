import { useTranslation } from '@kazama-defi/localization'
import { convertTimeToMilliseconds, distanceToNowStrict } from 'utils/timeHelper'
import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'

interface UserData {
  lockEndTime: string
  lockStartTime: string
  burnStartTime?: string
}

interface UserDataInVaultPresenter {
  weekDuration: string
  remainingTime: string
  lockEndDate: string
  secondDuration: number
  burnStartTime?: string
}

type UserDataInVaultPresenterFn = (args: UserData) => UserDataInVaultPresenter

const useUserDataInVaultPresenter: UserDataInVaultPresenterFn = ({ lockEndTime, lockStartTime }) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const secondDuration = Number(lockEndTime) - Number(lockStartTime)

  const lockEndTimeMilliseconds = convertTimeToMilliseconds(lockEndTime)

  let lockEndDate = ''
  let burnStartTime = ''

  try {
    const _lockEndDate = new Date(lockEndTimeMilliseconds)
    lockEndDate = _lockEndDate.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const _burnStartTime = new Date(lockEndTimeMilliseconds + 7 * 24 * 60 * 60 * 1000)
    burnStartTime = _burnStartTime.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch (_) {
    // ignore invalid format
  }

  return {
    weekDuration: formatSecondsToWeeks(secondDuration),
    remainingTime: distanceToNowStrict(lockEndTimeMilliseconds),
    lockEndDate,
    secondDuration,
    burnStartTime,
  }
}

export default useUserDataInVaultPresenter
