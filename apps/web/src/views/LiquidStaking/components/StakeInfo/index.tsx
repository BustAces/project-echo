import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Text, RowBetween, Skeleton } from '@kazama-defi/uikit'
import { useTranslation } from '@kazama-defi/localization'
import { BIG_ZERO } from '@kazama-defi/utils/bigNumber'
import { getFullDisplayBalance } from '@kazama-defi/utils/formatBalance'
import { useExchangeRate } from 'views/LiquidStaking/hooks/useExchangeRate'
import { ExchangeRateTitle } from 'views/LiquidStaking/components/StakeInfo/ExchangeRateTitle'
import { LiquidStakingApr } from 'views/LiquidStaking/components/StakeInfo//LiquidStakingApr'
import { LiquidStakingList } from 'views/LiquidStaking/constants/types'

interface StakeInfoProps {
  selectedList: LiquidStakingList
}

const StakeInfo: React.FC<StakeInfoProps> = ({ selectedList }) => {
  const { t } = useTranslation()
  const { exchangeRateList } = useExchangeRate({ decimals: selectedList?.token0?.decimals })

  const exchangeRateAmount = useMemo(() => {
    const pickedRate = exchangeRateList?.find(
      (i) => i?.contract?.toLowerCase() === selectedList?.contract?.toLowerCase(),
    )?.exchangeRate

    const amount = pickedRate ? new BigNumber('1').dividedBy(pickedRate.toString()) : BIG_ZERO
    return amount
  }, [exchangeRateList, selectedList?.contract])

  return (
    <>
      <RowBetween mb="8px">
        <ExchangeRateTitle tokenOSymbol={selectedList?.token0?.symbol} token1Symbol={selectedList?.token1?.symbol} />
        {exchangeRateAmount.isNaN() ? (
          <Skeleton width={50} height={10} />
        ) : (
          <>
            {exchangeRateAmount ? (
              <Text>
                {t('1 %token0% = %exchangeRateAmount% %token1%', {
                  token0: selectedList?.token0?.symbol,
                  token1: selectedList?.token1?.symbol,
                  exchangeRateAmount: getFullDisplayBalance(exchangeRateAmount, 0, 6),
                })}
              </Text>
            ) : (
              '-'
            )}
          </>
        )}
      </RowBetween>
      <LiquidStakingApr contract={selectedList?.contract} tokenOSymbol={selectedList?.token0?.symbol} />
    </>
  )
}

export default StakeInfo
