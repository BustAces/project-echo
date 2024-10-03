import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { roll_host } from 'utils/apiRoutes'
import { useWeb3React } from '@kazama-defi/wagmi'

// Create the RollSocketContext
const RollSocketContext = createContext(null)

// Custom hook to use the socket
export const useRollSocket = () => {
  return useContext(RollSocketContext)
}

// SocketProvider component to provide the socket context
export const RollSocketProvider = ({ children }) => {
  const roll_socket = useRef()
  const { account, isConnected } = useWeb3React()
  const [socketAddress, setSocketAddress] = useState(null)

  // Socket
  useEffect(() => {
    roll_socket.current = io(roll_host)
  }, [])

  // Set user socket data connection
  useEffect(() => {
    // First render
    if (isConnected && roll_socket && socketAddress == null) {
      roll_socket.current.emit('set-address', account)
      setSocketAddress(account)

      // On wallet change
    } else if (isConnected && roll_socket && socketAddress !== account) {
      const disconnectOld = async () => {
        await assignOldWalletData(socketAddress)
        await assignNewWalletData(account)
        setSocketAddress(account)
      }
      disconnectOld()
    }
  }, [account])

  // Connect new wallet and set data
  const assignNewWalletData = (address) => {
    roll_socket.current.emit('set-address', address)
  }

  // Disconnect and remove old wallet from usernames list
  const assignOldWalletData = (address) => {
    roll_socket.current.emit('set-old-wallet-data', address)
  }

  // Provide the socket context and its value to the children
  return <RollSocketContext.Provider value={roll_socket}>{children}</RollSocketContext.Provider>
}

export default RollSocketProvider
