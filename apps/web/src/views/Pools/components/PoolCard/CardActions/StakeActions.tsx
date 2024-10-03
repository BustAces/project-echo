import { Token } from '@kazama-defi/sdk'
import { Pool } from '@kazama-defi/widgets-internal'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
