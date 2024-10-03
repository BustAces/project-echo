import type { SerializedWrappedToken } from '@kazama-defi/token-lists'
import { Address } from 'viem'

export interface BasePool {
  lpSymbol: string
  lpAddress: Address
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export interface StableSwapPool extends BasePool {
  stableSwapAddress: Address
  infoStableSwapAddress: Address
  stableLpFee: number
  stableLpFeeRateOfTotalFee: number
}
