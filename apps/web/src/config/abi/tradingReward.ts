export const tradingRewardABI = [
  {
    inputs: [
      { internalType: 'address', name: '_cakePoolAddress', type: 'address' },
      { internalType: 'address', name: '_pancakeProfileAddress', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'maxPeriod', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'minClaimPeriod', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'maxClaimPeriod', type: 'uint256' },
    ],
    name: 'CampaignPeriodParamsUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'string', name: 'campaignId', type: 'string' }],
    name: 'IncentiveActivated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: false, internalType: 'address', name: 'rewardToken', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'campaignStart', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'campaignClaimTime', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'campaignClaimEndTime', type: 'uint256' },
    ],
    name: 'IncentiveCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'totalTradingFee', type: 'uint256' },
    ],
    name: 'IncentivePrepared',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'isDynamicReward', type: 'bool' },
    ],
    name: 'IncentiveRewardDeposited',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'RewardClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: true, internalType: 'address', name: 'rewardToken', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'toLockRatio', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'feeRatio', type: 'uint256' },
    ],
    name: 'RewardTokenParamsUpdated',
    type: 'event',
  },
  { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'thresholdLockTime', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'thresholdLockAmount', type: 'uint256' },
      { indexed: false, internalType: 'bool', name: 'needProfileIsActivated', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'minAmountUSD', type: 'uint256' },
    ],
    name: 'UserQualificationUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'string', name: 'campaignId', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'WithdrawAll',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'string', name: '_campaignId', type: 'string' }],
    name: 'activateIncentive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cakePoolAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'address', name: '_sender', type: 'address' },
      { internalType: 'uint256', name: '_selfTradingFee', type: 'uint256' },
    ],
    name: 'canClaim',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_campaignIds', type: 'string[]' },
      { internalType: 'address[]', name: '_selfAddresses', type: 'address[]' },
      { internalType: 'uint256[]', name: '_selfTradingFees', type: 'uint256[]' },
    ],
    name: 'canClaimMulti',
    outputs: [{ internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'bytes32[]', name: '_merkleProof', type: 'bytes32[]' },
      { internalType: 'uint256', name: '_selfTradingFee', type: 'uint256' },
    ],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_campaignIds', type: 'string[]' },
      { internalType: 'bytes32[][]', name: '_merkleProofs', type: 'bytes32[][]' },
      { internalType: 'uint256[]', name: '_selfTradingFees', type: 'uint256[]' },
    ],
    name: 'claimRewardMulti',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cleanUpIncentiveCampaignIds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'address', name: '_rewardToken', type: 'address' },
      { internalType: 'uint256', name: '_rewardPrice', type: 'uint256' },
      { internalType: 'uint256', name: '_rewardToLockRatio', type: 'uint256' },
      { internalType: 'uint256', name: '_rewardFeeRatio', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignStart', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignClaimTime', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignClaimEndTime', type: 'uint256' },
    ],
    name: 'createIncentive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'bool', name: '_isDynamicReward', type: 'bool' },
    ],
    name: 'depositIncentiveReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_sender', type: 'address' },
      { internalType: 'uint256', name: '_volume', type: 'uint256' },
    ],
    name: 'getEncodedHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getIncentiveCampaignIds',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'address', name: '_sender', type: 'address' },
    ],
    name: 'getTotalClaimedReward',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getUserQualification',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bool', name: '', type: 'bool' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'incentiveRewards',
    outputs: [
      { internalType: 'address', name: 'rewardToken', type: 'address' },
      { internalType: 'uint256', name: 'rewardPrice', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardToLockRatio', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardFeeRatio', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '', type: 'string' }],
    name: 'incentives',
    outputs: [
      { internalType: 'uint256', name: 'totalRewardUnclaimed', type: 'uint256' },
      { internalType: 'uint256', name: 'totalReward', type: 'uint256' },
      { internalType: 'uint256', name: 'totalTradingFee', type: 'uint256' },
      { internalType: 'bytes32', name: 'proofRoot', type: 'bytes32' },
      { internalType: 'uint256', name: 'campaignStart', type: 'uint256' },
      { internalType: 'uint256', name: 'campaignClaimTime', type: 'uint256' },
      { internalType: 'uint256', name: 'campaignClaimEndTime', type: 'uint256' },
      { internalType: 'bool', name: 'is_activated', type: 'bool' },
      { internalType: 'bool', name: 'isDynamicReward', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_sender', type: 'address' }],
    name: 'isEligibleLockAmount',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'address', name: '_sender', type: 'address' },
    ],
    name: 'isEligibleLockTime',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxCampaignClaimPeriod',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxCampaignPeriod',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minAmountUSD',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minCampaignClaimPeriod',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pancakeProfileAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'uint256', name: '_totalTradingFee', type: 'uint256' },
      { internalType: 'bytes32', name: '_proofRoot', type: 'bytes32' },
    ],
    name: 'prepareIncentive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'uint256', name: '_maxPeriod', type: 'uint256' },
      { internalType: 'uint256', name: '_minClaimPeriod', type: 'uint256' },
      { internalType: 'uint256', name: '_maxClaimPeriod', type: 'uint256' },
    ],
    name: 'updateCampaignPeriodParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_campaignId', type: 'string' },
      { internalType: 'address', name: '_rewardToken', type: 'address' },
      { internalType: 'uint256', name: '_rewardPrice', type: 'uint256' },
      { internalType: 'uint256', name: '_rewardToLockRatio', type: 'uint256' },
      { internalType: 'uint256', name: '_rewardFeeRatio', type: 'uint256' },
    ],
    name: 'updateRewardTokenParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_thresholdLockTime', type: 'uint256' },
      { internalType: 'uint256', name: '_thresholdLockAmount', type: 'uint256' },
      { internalType: 'bool', name: '_needProfileIsActivated', type: 'bool' },
      { internalType: 'uint256', name: '_minAmountUSD', type: 'uint256' },
    ],
    name: 'updateUserQualification',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'userClaimedIncentives',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'userClaimedRecords',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_campaignId', type: 'string' }],
    name: 'withdrawAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
