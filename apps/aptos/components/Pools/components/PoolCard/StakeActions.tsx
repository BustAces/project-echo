import { Token } from '@kazama-defi/swap-sdk-core'
import { Pool } from '@kazama-defi/widgets-internal'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
