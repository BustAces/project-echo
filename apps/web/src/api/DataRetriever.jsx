import React, { createContext, useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import truncateHash from '@kazama-defi/utils/truncateHash'
import axios from 'axios'
import { useWeb3React } from '@kazama-defi/wagmi'
import { Input as UIKitInput, Modal, useModal, Button, Text, Image, PaperStackIcon } from '@kazama-defi/uikit'
import { getUserData, login, register } from 'utils/apiRoutes'
import { useSocket } from './SocketManager'
import { toast } from 'kazama-defi-react-toasts'
import 'kazama-defi-react-toasts/dist/KazamaToasts.css'
import { Zoom } from 'kazama-defi-react-toasts'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { getTipReceivedSound } from 'audio/TipReceived'
import useGetTokenBalance from 'hooks/useTokenBalance'
import RegisterAccount from './Modals/register'
import blockies from 'ethereum-blockies'
import { FetchKazamaRank } from 'views/Profile/components/DataFetchers/KazamaRankFetcher'

// Create a new context with initial state as defaultValue
const UserDataContext = createContext({
  general_data: {
    username: '',
    has_password: false,
    recovery_email: 'No recovery email',
    is_activated: true,
    ip: '0',
    country: 'Unknown',
    balance_kazama: 0,
    role: 'user',
    anonymous: false,
    avatar_image: '',
    notifications_enabled: true,
  },
  chat_data: {
    last_message: new Date(),
  },
  platform_balance: {
    balance: 0,
    deposited: 0,
    withdrawed: 0,
    deposit_history: [],
    withdrawal_history: [],
    profit_loss: 0,
  },
  online_status: {
    is_online: false,
    away: false,
    online_since: null,
    offline_since: null,
  },
  messages_inbox: {
    inbox: [],
    outbox: [],
  },
  notifications: [],
  profile_data: {
    subscribed: false,
    subscription_expiration: null,
    header_image: 'https://assets.kazama.io/profiles/profile_background/default.jpg',
    youtube_channel: null,
    twitter_page: null,
    followers: null,
    following: null,
    messages: [],
  },
  rank_data: {
    rank: 'Unranked',
    level: 0,
    xp: 0,
    rank_progress: 0,
  },
  lottery: {
    active: false,
    total_ever_staked: 0,
    total_burned: 0,
    total_time_in_prizes: 0,
    total_won: 0,
    unclaimed_prizes: 0,
  },
  blocklist: [],
  warnings: 0,
  tips: {
    sended: 0,
    received: 0,
    history: [],
  },
  mute_status: {
    muted: false,
    expiration: null,
  },
  ban_status: {
    banned: false,
    expiration: null,
  },
  kazama_crash: {
    crash_bet_amount: 0,
    crash_payout_multiplier: 0,
    crash_trenball_team: '',
    crash_trenball_bet: 0,
    crash_games_played: 0,
    crash_games_won: 0,
    crash_games_lost: 0,
    crash_deposited: 0,
    crash_withdrawed: 0,
    crash_nyan_hit: false,
  },
  kazama_holder_ranks: {
    liquidity_provider: false,
    spacenaut: false,
    kraken: false,
    whale: false,
    shark: false,
    orca: false,
    dolphin: false,
    turtle: false,
    fish: false,
    crab: false,
    shrimp: false,
    holder: false,
    non_holder: true,
  },
  session_data: {
    active: false,
  },
  joined_at: new Date(),
  updated_at: null,
})

// Custom hook to access the user data context
export const useUserData = () => useContext(UserDataContext)

// Stylings
const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    background: #21252b;
    border-bottom: 2px solid #11141e;
  }
`

const Input = styled(UIKitInput)`
  background: transparent;
  width: 100%;
  border-radius: 7px;
  border: 0px solid transparent !important;
  outline: none;
  box-shadow: none;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 22px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  margin-bottom: 5px;
  &:disabled {
    background-color: transparent;
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    box-shadow: none !important;
  }
`

const KazamaToastHeader = styled.div`
  color: #a6a7aa;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 3px;
  margin-left: 8px;
`

const AccountLink = styled(NextLinkFromReactRouter)`
  color: #fff;
  font-size: 14px;
  font-family: Flama Bold;
  &:hover {
    text-decoration: underline;
  }
`

// External APIs
const IPIFY_API = process.env.NEXT_PUBLIC_IPIFY

// Provider component that wraps your AccountDataRetriever component
export const UserDataProvider = ({ children }) => {
  const socket = useSocket()
  const { account, isConnected } = useWeb3React()
  const blockie = blockies.create({ seed: account }).toDataURL()
  const [ip, setIP] = useState('')
  const { balance: userKazama, fetchStatus } = useGetTokenBalance('0xF7914DA906Fa57Bbf3970c4B3fa634021039FE88', account)

  // Handle registration box dismiss
  const handleDismiss = () => {
    registerUser()
  }

  // Fire register modal
  const [onRegisterModal] = useModal(
    <RegisterAccount address={account} socket={socket} onDismissCallback={handleDismiss} />,
  )

  // Default userdata on first connect
  const [userData, setUserData] = useState({
    general_data: {
      username: account,
      has_password: false,
      recovery_email: 'No recovery email',
      is_activated: true,
      ip: '0',
      country: 'Unknown',
      balance_kazama: 0,
      role: 'user',
      anonymous: false,
      avatar_image: blockie,
      notifications_enabled: true,
    },
    chat_data: {
      last_message: new Date(),
    },
    platform_balance: {
      balance: 0,
      deposited: 0,
      withdrawed: 0,
      deposit_history: [],
      withdrawal_history: [],
      profit_loss: 0,
    },
    online_status: {
      is_online: false,
      away: false,
      online_since: null,
      offline_since: null,
    },
    messages_inbox: {
      inbox: [],
      outbox: [],
    },
    notifications: [],
    profile_data: {
      subscribed: false,
      subscription_expiration: null,
      header_image: 'https://assets.kazama.io/profiles/profile_background/default.jpg',
      youtube_channel: null,
      twitter_page: null,
      followers: null,
      following: null,
      messages: [],
    },
    rank_data: {
      rank: 'Unranked',
      level: 0,
      xp: 0,
      rank_progress: 0,
    },
    lottery: {
      active: false,
      total_ever_staked: 0,
      total_burned: 0,
      total_time_in_prizes: 0,
      total_won: 0,
      unclaimed_prizes: 0,
    },
    blocklist: [],
    warnings: 0,
    tips: {
      sended: 0,
      received: 0,
      history: [],
    },
    mute_status: {
      muted: false,
      expiration: null,
    },
    ban_status: {
      banned: false,
      expiration: null,
    },
    kazama_crash: {
      crash_bet_amount: 0,
      crash_payout_multiplier: 0,
      crash_trenball_team: '',
      crash_trenball_bet: 0,
      crash_games_played: 0,
      crash_games_won: 0,
      crash_games_lost: 0,
      crash_deposited: 0,
      crash_withdrawed: 0,
      crash_nyan_hit: false,
    },
    kazama_holder_ranks: {
      liquidity_provider: false,
      spacenaut: false,
      kraken: false,
      whale: false,
      shark: false,
      orca: false,
      dolphin: false,
      turtle: false,
      fish: false,
      crab: false,
      shrimp: false,
      holder: false,
      non_holder: true,
    },
    session_data: {
      active: false,
    },
    joined_at: new Date(),
    updated_at: null,
  })

  // Fetch IP
  const getIp = async () => {
    const res = await axios.get(IPIFY_API)
    setIP(res.data.ip)
  }

  // Get IP
  useEffect(() => {
    getIp()
  }, [account])

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${getUserData}/${account}`)
      if (response.status === 204) {
        // Fire register modal
        onRegisterModal()
      } else {
        setUserData(response.data)
        // Handle the case where the user data is successfully fetched
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Handle the error case
    }
  }

  // Execute retrieving
  useEffect(() => {
    if (account) {
      fetchData()
    }
  }, [account])

  // Socket events
  useEffect(() => {
    if (socket && socket.current) {
      // Function to handle new account
      const handleNewAccount = (data) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          ...data,
        }))
      }

      // Function to handle balance updates
      const handleBalanceUpdate = (data) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          platform_balance: {
            ...prevUserData.platform_balance,
            balance: data,
          },
        }))
      }

      // Function to handle new notifications
      const handleNewNotification = (data) => {
        setUserData((prevUserData) => ({
          ...prevUserData,
          notifications: [...prevUserData.notifications, data],
        }))
      }

      // Events
      socket.current.on('new-account-confirmed', handleNewAccount)
      socket.current.on('account-balance-data', handleBalanceUpdate)
      socket.current.on('new-notification', handleNewNotification)
    }
  }, [])

  return (
    <>
      <UserDataContext.Provider value={userData}>{children}</UserDataContext.Provider>
    </>
  )
}
