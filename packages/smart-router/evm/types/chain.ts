import { Token } from '@kazama-defi/sdk'
import { ChainId } from '@kazama-defi/chains'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
