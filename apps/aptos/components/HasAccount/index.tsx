import { useAccount } from '@kazama-defi/awgmi'
import { useIsMounted } from '@kazama-defi/hooks'

export default function HasAccount({ fallbackComp, children }) {
  const { account } = useAccount()
  const isMounted = useIsMounted()

  return isMounted && account ? <>{children}</> : fallbackComp
}
