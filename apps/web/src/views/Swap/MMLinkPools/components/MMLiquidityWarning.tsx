import { Alert } from '@kazama-defi/uikit'
import { useTranslation } from '@kazama-defi/localization'

export const MMLiquidityWarning: React.FC = () => {
  const { t } = useTranslation()
  return <Alert title={t('MMs are temporarily unable to facilitate trades. Please try again later')} variant="info" />
}
