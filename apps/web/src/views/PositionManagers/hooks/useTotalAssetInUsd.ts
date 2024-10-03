import { useMemo } from 'react'
import { formatAmount } from '@kazama-defi/utils/formatFractions'
import { Currency, CurrencyAmount } from '@kazama-defi/sdk'

export const useTotalAssetInUsd = (
  staked0Amount?: CurrencyAmount<Currency>,
  staked1Amount?: CurrencyAmount<Currency>,
  token0PriceUSD?: number,
  token1PriceUSD?: number,
) => {
  const totalAssetsInUsd = useMemo(() => {
    return (
      Number(formatAmount(staked0Amount) ?? 0) * (token0PriceUSD ?? 0) +
      Number(formatAmount(staked1Amount) ?? 0) * (token1PriceUSD ?? 0)
    )
  }, [staked0Amount, staked1Amount, token0PriceUSD, token1PriceUSD])
  return totalAssetsInUsd
}
