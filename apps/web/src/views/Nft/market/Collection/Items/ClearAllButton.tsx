import { Button, ButtonProps } from '@kazama-defi/uikit'
import { useTranslation } from '@kazama-defi/localization'
import { useNftStorage } from 'state/nftMarket/storage'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<React.PropsWithChildren<ClearAllButtonProps>> = ({ collectionAddress, ...props }) => {
  const { t } = useTranslation()
  const { removeAllItemFilters } = useNftStorage()

  const clearAll = () => {
    removeAllItemFilters(collectionAddress)
  }

  return (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} {...props}>
      {t('Clear')}
    </Button>
  )
}

export default ClearAllButton
