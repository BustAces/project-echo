import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useWeb3React } from '@kazama-defi/wagmi'
import { getPlatformData } from 'utils/apiRoutes'
import { useSocket } from './SocketManager'

// Create a new context with initial state as defaultValue
const PlatformDataContext = createContext({
  settings: {
    chat_settings: {
      max_characters: 300,
      slow_mode: {
        active: false,
        seconds: 0,
      },
    },
  },
  platform_activity: [],
})

// Custom hook to access the user data context
export const usePlatformData = () => useContext(PlatformDataContext)

// Provider component that wraps your AccountDataRetriever component
export const PlatformDataProvider = ({ children }) => {
  const { account, isConnected } = useWeb3React()
  const socket = useSocket()

  // Default userdata on first connect
  const [platformData, setPlatformData] = useState({
    settings: {
      chat_settings: {
        max_characters: 300,
        slow_mode: {
          active: false,
          seconds: 0,
        },
      },
    },
    platform_activity: [],
    admin_history: [],
    mod_history: [],
  })

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(getPlatformData)
      setPlatformData(response.data)
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

  // Handler to refetch data on socket updates
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('slow-mode-confirmed', (slowModeData) => {
        setPlatformData((prevPlatformData) => ({
          ...prevPlatformData,
          settings: {
            ...prevPlatformData.settings,
            chat_settings: {
              ...prevPlatformData.settings.chat_settings,
              slow_mode: slowModeData.settings.chat_settings.slow_mode,
            },
          },
        }))
      })

      // Listen for platform activity updates
      socket.current.on('platform-activity-updated', (activityData) => {
        setPlatformData((prevPlatformData) => ({
          ...prevPlatformData,
          platform_activity: activityData.platform_activity,
        }))
      })

      // Listen for admin history updates
      socket.current.on('admin-history-updated', (adminHistoryData) => {
        setPlatformData((prevPlatformData) => ({
          ...prevPlatformData,
          admin_history: adminHistoryData.admin_history,
        }))
      })

      // Listen for mod history updates
      socket.current.on('mod-history-updated', (modHistoryData) => {
        setPlatformData((prevPlatformData) => ({
          ...prevPlatformData,
          mod_history: modHistoryData.mod_history,
        }))
      })
    }
  }, [socket.current, socket])

  return (
    <>
      <PlatformDataContext.Provider value={platformData}>{children}</PlatformDataContext.Provider>
    </>
  )
}
