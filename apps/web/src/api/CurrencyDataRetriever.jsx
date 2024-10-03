import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Create a new context with initial state as defaultValue
const CurrencyListContext = createContext({
  tokenPrices: {},
  previousTokenPrices: {},
})

// Custom hook to access the currency list data context
export const useCurrencyListData = () => useContext(CurrencyListContext)

// Provider component that wraps your AccountDataRetriever component
export const CurrencyListDataProvider = ({ children }) => {
  const [tokenPrices, setTokenPrices] = useState({})
  const [previousTokenPrices, setPreviousTokenPrices] = useState({})

  const fetchTokenPrices = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin,usd-coin,tether,bitcoin,ethereum,dai,apecoin,shiba-inu,monero,solana,the-open-network,avalanche-2,pepe,litecoin,bonk,floki,uniswap,pancakeswap-token,pulsechain,tron,immutable-x,&vs_currencies=usd&include_24hr_change=true&include_price_change=true',
      )
      const data = response.data

      // Extract price values from nested objects
      const prices = {}
      for (const token in data) {
        if (data.hasOwnProperty(token)) {
          prices[token] = data[token]
        }
      }

      setPreviousTokenPrices(tokenPrices)
      setTokenPrices(prices)
    } catch (error) {
      console.error('Error fetching token prices:', error)
    }
  }

  useEffect(() => {
    // Fetch data initially
    fetchTokenPrices()

    // Set up interval to fetch data every 1.5m (90000 milliseconds)
    const intervalId = setInterval(fetchTokenPrices, 90000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <CurrencyListContext.Provider value={{ tokenPrices, previousTokenPrices }}>{children}</CurrencyListContext.Provider>
  )
}

export default CurrencyListDataProvider
