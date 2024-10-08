import { LegacyRouter } from '@kazama-defi/smart-router/legacy-router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'

export function useStableSwapPairs() {
  const { chainId } = useActiveChainId()

  return useMemo(() => LegacyRouter.stableSwapPairsByChainId[chainId] || [], [chainId])
}
