import { ChainId } from '@kazama-defi/chains'
import { WBNB } from '@kazama-defi/sdk'

import { USDT } from './common'

export const opBnbTokens = {
  wbnb: WBNB[ChainId.OPBNB],
  usdt: USDT[ChainId.OPBNB],
}
