import { TranslateFunction } from '@kazama-defi/localization'
import { ManagerFeeType } from '@kazama-defi/position-managers'

export function getReadableManagerFeeType(t: TranslateFunction, feeType: ManagerFeeType) {
  switch (feeType) {
    case ManagerFeeType.LP_REWARDS:
      return t('% of LP rewards')
    default:
      return ''
  }
}
