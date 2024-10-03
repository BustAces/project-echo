import { TradeType } from '@kazama-defi/sdk'
import { SmartRouterTrade } from '@kazama-defi/smart-router/evm'
import { useMemo } from 'react'
import { useUserSlippage } from '@kazama-defi/utils/user'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(trade?: SmartRouterTrade<TradeType>) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
