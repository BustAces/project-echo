import { Pool } from '@kazama-defi/widgets-internal'
import { Coin } from '@kazama-defi/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
