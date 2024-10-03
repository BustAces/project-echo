import { Token, WNATIVE } from '@kazama-defi/sdk'
import { ChainId } from '@kazama-defi/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
