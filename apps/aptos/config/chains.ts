import { defaultChain } from '@kazama-defi/awgmi'
import { mainnet, testnet, Chain } from '@kazama-defi/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
