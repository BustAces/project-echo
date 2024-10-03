import useSWRImmutable from 'swr/immutable'
import { ChainId } from '@kazama-defi/chains'
import { Ifo } from '@kazama-defi/ifos'

import { publicClient } from 'utils/wagmi'

import { ifoV3ABI } from '../config/abi/ifoV3'
import { useActiveIfoConfig } from './useIfoConfig'

export const useActiveIfoWithBlocks = (): (Ifo & { startBlock: number; endBlock: number }) | null => {
  const { activeIfo } = useActiveIfoConfig()

  const { data: currentIfoBlocks = { startBlock: 0, endBlock: 0 } } = useSWRImmutable(
    activeIfo ? ['ifo', 'currentIfo'] : null,
    async () => {
      if (!activeIfo?.address) {
        return {
          startBlock: 0,
          endBlock: 0,
        }
      }

      const bscClient = publicClient({ chainId: ChainId.BSC })
      const [startBlockResponse, endBlockResponse] = await bscClient.multicall({
        contracts: [
          {
            address: activeIfo?.address,
            abi: ifoV3ABI,
            functionName: 'startBlock',
          },
          {
            address: activeIfo?.address,
            abi: ifoV3ABI,
            functionName: 'endBlock',
          },
        ],
      })

      return {
        startBlock: startBlockResponse.status === 'success' ? Number(startBlockResponse.result) : 0,
        endBlock: endBlockResponse.status === 'success' ? Number(endBlockResponse.result) : 0,
      }
    },
  )

  return activeIfo ? { ...activeIfo, ...currentIfoBlocks } : null
}
