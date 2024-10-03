import { WETH9 } from '@kazama-defi/sdk'
import { ChainId } from '@kazama-defi/chains'
import { USDC } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  usdc: USDC[ChainId.SCROLL_SEPOLIA],
}
