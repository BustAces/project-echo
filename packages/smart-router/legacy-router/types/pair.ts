import type { CurrencyAmount, Currency } from '@kazama-defi/sdk'

export interface BasePair {
  token0: Currency
  token1: Currency
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
  involvesToken: (token: Currency) => boolean
}
