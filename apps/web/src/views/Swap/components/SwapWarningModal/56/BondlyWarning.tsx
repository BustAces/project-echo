import { Text } from '@kazama-defi/uikit'
import { useTranslation } from '@kazama-defi/localization'

const BondlyWarning = () => {
  const { t } = useTranslation()

  return <Text>{t('Warning: BONDLY has been compromised. Please remove liquidity until further notice.')}</Text>
}

export default BondlyWarning
