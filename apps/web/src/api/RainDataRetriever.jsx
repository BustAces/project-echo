import React, { createContext, useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import truncateHash from '@kazama-defi/utils/truncateHash'
import axios from 'axios'
import { useWeb3React } from '@kazama-defi/wagmi'
import { Text, Image, PaperStackIcon } from '@kazama-defi/uikit'
import { getRainData } from 'utils/apiRoutes'
import { useSocket } from './SocketManager'
import { toast } from 'kazama-defi-react-toasts'
import 'kazama-defi-react-toasts/dist/KazamaToasts.css'
import { Zoom } from 'kazama-defi-react-toasts'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { getTipReceivedSound } from 'audio/TipReceived'

// Create a new context with initial state as defaultValue
const RainDataContext = createContext({
  rain_active: false,
  rain_id: 0,
  current_rain: {
    rainer: {
      username: '',
      avatar: '',
      level: 0,
      total_rained: 0,
    },
    amount: 0,
    participants_amount: 1,
    amount_left: 0,
    participated: {
      usernames: [],
      socketIds: [],
      avatars: [],
    },
    starting_in: null,
    expiration: null,
  },
})

// Custom hook to access the rain data context
export const useRainData = () => useContext(RainDataContext)

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

const DollarText = styled.p`
  color: #10d960;
`

// Provider component that wraps your AccountDataRetriever component
export const RainDataProvider = ({ children }) => {
  const socket = useSocket()
  const { account } = useWeb3React()
  const [rainData, setRainData] = useState({
    rain_active: false,
    rain_id: 0,
    current_rain: {
      rainer: {
        username: '',
        avatar: '',
        level: 0,
        total_rained: 0,
      },
      amount: 0,
      participants_amount: 1,
      spots_left: 0,
      amount_left: 0,
      participated: {
        usernames: [],
        socketIds: [],
        avatars: [],
      },
      starting_in: null,
      expiration: null,
    },
  })

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(getRainData)
      setRainData(response.data.rain_data)
    } catch (error) {
      console.error('Error fetching rain data:', error)
    }
  }

  // Execute retrieving
  useEffect(() => {
    if (account) {
      fetchData()
    }
  }, [account])

  // Listen for new-rain-confirmed event
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('new-rain-confirmed', (updatedData) => {
        // Update the rain_active property and other updated data in the state
        setRainData((prevData) => ({
          ...prevData,
          rain_active: updatedData.rain_data.rain_active,
          rain_id: updatedData.rain_data.rain_id,
          current_rain: {
            ...prevData.current_rain,
            rainer: {
              ...prevData.current_rain.rainer,
              username: updatedData.rain_data.current_rain.rainer.username,
              avatar: updatedData.rain_data.current_rain.rainer.avatar,
              level: updatedData.rain_data.current_rain.rainer.level,
              total_rained: updatedData.rain_data.current_rain.rainer.total_rained,
            },
            amount: updatedData.rain_data.current_rain.amount,
            participants_amount: updatedData.rain_data.current_rain.participants_amount,
            spots_left: updatedData.rain_data.current_rain.spots_left,
            amount_left: updatedData.rain_data.current_rain.amount_left,
            participated: {
              ...prevData.current_rain.participated, // Keep existing properties of participated
              usernames: [
                ...prevData.current_rain.participated.usernames,
                ...updatedData.rain_data.current_rain.participated.usernames,
              ], // Concatenate existing and new usernames
              socketIds: [
                ...prevData.current_rain.participated.socketIds,
                ...updatedData.rain_data.current_rain.participated.socketIds,
              ], // Concatenate existing and new socketIds
              avatars: [
                ...prevData.current_rain.participated.avatars,
                ...updatedData.rain_data.current_rain.participated.avatars,
              ],
            },
            starting_in: updatedData.rain_data.current_rain.starting_in,
            expiration: updatedData.rain_data.current_rain.expiration,
          },
        }))
      })
    }
  }, [socket.current])

  // Listen for participants updates
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('participants-updated', (updatedData) => {
        // Update the rain_active property and other updated data in the state
        setRainData((prevData) => ({
          ...prevData,
          rain_active: updatedData.rain_data.rain_active,
          current_rain: {
            ...prevData.current_rain,
            amount: updatedData.rain_data.current_rain.amount,
            spots_left: updatedData.rain_data.current_rain.spots_left,
            amount_left: updatedData.rain_data.current_rain.amount_left,
            participated: {
              ...prevData.current_rain.participated,
              usernames: [
                ...new Set([
                  ...prevData.current_rain.participated.usernames,
                  ...updatedData.rain_data.current_rain.participated.usernames,
                ]),
              ],
              socketIds: [
                ...new Set([
                  ...prevData.current_rain.participated.socketIds,
                  ...updatedData.rain_data.current_rain.participated.socketIds,
                ]),
              ],
              avatars: [
                ...new Set([
                  ...prevData.current_rain.participated.avatars,
                  ...updatedData.rain_data.current_rain.participated.avatars,
                ]),
              ],
            },
          },
        }))
      })
    }
  }, [socket.current])

  return <RainDataContext.Provider value={rainData}>{children}</RainDataContext.Provider>
}
