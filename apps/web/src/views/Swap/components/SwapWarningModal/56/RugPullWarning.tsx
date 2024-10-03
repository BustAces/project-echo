import { useTranslation } from '@kazama-defi/localization'
import { Text } from '@kazama-defi/uikit'

const RugPullWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Suspicious rugpull token')}</Text>
    </>
  )
}

export default RugPullWarning
