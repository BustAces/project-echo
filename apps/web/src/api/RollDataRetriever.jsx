import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { roll_host, getRollData } from 'utils/apiRoutes'
import { useRollSocket } from './RollSocketManager'

// Define the structure of the roll data
const initialState = {
  next_draw: new Date(Date.now() + 3600 * 1000),
  settings: {
    enabled: true,
    draw_interval: 18,
  },
  current_spin: {
    bet_enabled: true,
    red: {
      players: [],
    },
    black: {
      players: [],
    },
    green: {
      players: [],
    },
  },
  spin_history: [],
}

// Create a new context with initial state as defaultValue
const RollDataContext = createContext(initialState)

// Custom hook to access the roll data context
export const useRollData = () => useContext(RollDataContext)

// Provider component that wraps your component tree
export const RollDataProvider = ({ children }) => {
  const socket = useRollSocket()
  const [generatedNumber, setGeneratedNumber] = useState(0)
  const [rollData, setRollData] = useState(initialState)

  // Fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(getRollData)
      setRollData(response.data)
    } catch (error) {
      console.error('Error fetching roll data:', error)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [])

  return <RollDataContext.Provider value={rollData}>{children}</RollDataContext.Provider>
}
