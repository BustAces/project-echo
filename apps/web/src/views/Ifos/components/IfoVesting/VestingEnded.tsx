import { useTranslation } from '@kazama-defi/localization'
import { Text } from '@kazama-defi/uikit'

const VestingEnded: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  return (
    <Text color="textSubtle" fontSize="14px" pb="24px">
      {t('You have claimed all available token.')}
    </Text>
  )
}

export default VestingEnded
