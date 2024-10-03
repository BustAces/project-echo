import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@kazama-defi/utils/formatBalance'

interface UseRewardInUSDProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  canClaim: string
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInUSD = ({
  timeRemaining,
  totalEstimateRewardUSD,
  canClaim,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInUSDProps) => {
  const rewardCakeUSDPriceAsBg = getBalanceAmount(new BigNumber(rewardPrice), rewardTokenDecimal)
  const rewardCakeAmount = getBalanceAmount(new BigNumber(canClaim), rewardTokenDecimal)

  return timeRemaining > 0
    ? totalEstimateRewardUSD || 0
    : rewardCakeAmount.times(rewardCakeUSDPriceAsBg).toNumber() || 0
}

export default useRewardInUSD
