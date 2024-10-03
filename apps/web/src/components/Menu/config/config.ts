import React from 'react'
import {
  FIXED_STAKING_SUPPORTED_CHAINS,
  LIQUID_STAKING_SUPPORTED_CHAINS,
  SUPPORT_BUY_CRYPTO,
  SUPPORT_FARMS,
  SUPPORT_ONLY_BSC,
} from 'config/constants/supportChains'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { nftsBaseUrl } from 'views/Nft/market/constants'

import { ContextApi } from '@kazama-defi/localization'
import { SUPPORTED_CHAIN_IDS as POOL_SUPPORTED_CHAINS } from '@kazama-defi/pools'
import {
  CrashRocketIcon,
  DiceIcon,
  DropdownMenuItemType,
  EarnFillIcon,
  EarnIcon,
  MenuItemsType,
  MoreIcon,
  NftFillIcon,
  RocketIcon,
  NftIcon,
  PancakeProtectorIcon,
  RouletteIcon,
  SwapFillIcon,
  SwapIcon,
  PokerIcon,
  HorseRaceIcon,
  GangWarsIcon,
  BingoBallsIcon,
  BotIcon,
} from '@kazama-defi/uikit'

import LotteryTimer from 'views/StakeLottery/Timers/Menu'

import { DropdownMenuItems } from '@kazama-defi/uikit/src/components/DropdownMenu/types'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Exchange'),
      icon: PancakeProtectorIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      initialOpenState: true,
      items: [
        {
          label: t('Swap'),
          dataText: `$0.00`,
          href: '/swap',
          itemIcon: SwapIcon,
        },
        {
          label: t('Cross Chain'),
          dataText: `$0.00`,
          href: '/liquidity',
          itemIcon: PancakeProtectorIcon,
        },
        {
          label: t('Xchange Bot'),
          href: 'https://bridge.pancakeswap.finance/',
          itemIcon: BotIcon,
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Win Kazama'),
      icon: PancakeProtectorIcon,
      hideSubNav: true,
      href: 'https://protectors.pancakeswap.finance',
      initialOpenState: true,
      items: [
        {
          label: t('Lottery'),
          href: '/lottery',
          itemIcon: RouletteIcon,
          itemData: React.createElement(LotteryTimer),
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Kazama Roll'),
          href: '/roll',
          itemIcon: RouletteIcon,
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Crash Game'),
          dataText: `0x`,
          href: '/crash',
          itemIcon: CrashRocketIcon,
          image: '/images/decorations/prediction.png',
        },
        {
          label: t('Gang Wars'),
          dataText: `$0.00`,
          href: '/wars',
          itemIcon: GangWarsIcon,
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Poker'),
          dataText: `0`,
          href: '/poker',
          itemIcon: PokerIcon,
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Original Dice'),
          href: '/lottery',
          itemIcon: DiceIcon,
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Horse Racing'),
          href: '/horse-racing',
          itemIcon: HorseRaceIcon,
          image: '/images/decorations/lottery.png',
        },
      ],
    },
    {
      label: t('Earning'),
      href: '/farms',
      icon: PancakeProtectorIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_FARMS,
      initialOpenState: false,
      items: [
        {
          label: t('Liquidity Farms'),
          href: '/farms',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('Staking Pools'),
          href: '/pools',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: POOL_SUPPORTED_CHAINS,
        },
        {
          label: t('Simple Staking'),
          href: '/simple-staking',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: FIXED_STAKING_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'Launchpads',
      href: '/info',
      icon: PancakeProtectorIcon,
      hideSubNav: true,
      initialOpenState: true,
      items: [
        {
          label: t('Launchpads List'),
          href: '/launchpads',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/ifos/ifo-bunny.png',
        },
        {
          label: t('Create Launchpad'),
          href: '/create/launchpad',
          itemIcon: PancakeProtectorIcon,
        },
        {
          label: t('Create Fair launch'),
          href: '/create/fairlaunch',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/ifos/ifo-bunny.png',
        },
        {
          label: t('Dutch Auction'),
          href: '/create/dutchauction',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/ifos/ifo-bunny.png',
        },
        {
          label: t('Leaderboards'),
          href: '/leaderboard',
          itemIcon: PancakeProtectorIcon,
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/ifos/ifo-bunny.png',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('NFT Market'),
      href: `${nftsBaseUrl}`,
      icon: PancakeProtectorIcon,
      fillIcon: NftFillIcon,
      supportChainIds: SUPPORT_ONLY_BSC,
      image: '/images/decorations/nft.png',
      items: [
        {
          label: t('Overview'),
          href: `${nftsBaseUrl}`,
          itemIcon: PancakeProtectorIcon,
        },
        {
          label: t('Collections'),
          href: `${nftsBaseUrl}/collections`,
          itemIcon: PancakeProtectorIcon,
        },
        {
          label: t('Activity'),
          href: `${nftsBaseUrl}/activity`,
          itemIcon: PancakeProtectorIcon,
        },
      ],
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
