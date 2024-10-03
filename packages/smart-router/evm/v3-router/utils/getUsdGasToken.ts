import { Token } from '@kazama-defi/sdk'
import { ChainId } from '@kazama-defi/chains'

import { usdGasTokensByChain } from '../../constants'

export function getUsdGasToken(chainId: ChainId): Token | null {
  return usdGasTokensByChain[chainId]?.[0] ?? null
}
