import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import Axios from 'axios'
import { useUserData } from './DataRetriever'

// Create the SocketContext
const CrashDataContext = createContext(null)

// Custom hook to use the data
export const useCrashData = () => {
  return useContext(CrashDataContext)
}

// SocketProvider component to provide the socket context
export const CrashDataProvider = ({ children }) => {
  const userData = useUserData()
  const [globalSocket, setGlobalSocket] = useState(null)
  const [multiplier, setMultiplier] = useState(null)
  const [betAmount, setBetAmount] = useState(localStorage.getItem('local_storage_wager') || 100)
  const [liveMultiplier, setLiveMultiplier] = useState('Connecting')
  const [liveMultiplierSwitch, setLiveMultiplierSwitch] = useState(false)
  const [betActive, setBetActive] = useState(false)
  const [crashHistory, setCrashHistory] = useState([])
  const [roundIdList, setRoundIdList] = useState([])
  const [bBettingPhase, setbBettingPhase] = useState(false)
  const [bettingPhaseTime, setBettingPhaseTime] = useState(0)
  const [bBetForNextRound, setbBetForNextRound] = useState(false)
  const [hookToNextRoundBet, setHookToNextRoundBet] = useState(false)
  const [liveBettingTable, setLiveBettingTable] = useState()
  const [chartData, setChartData] = useState({ datasets: [] })
  const [globalTimeNow, setGlobalTimeNow] = useState(0)
  const [chartSwitch, setChartSwitch] = useState(false)
  const [gamePhaseTimeElapsed, setGamePhaseTimeElapsed] = useState()
  const [startTime, setStartTime] = useState()
  const [streakList, setStreakList] = useState([])
  const [tenNumbers, setTenNumbers] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  const multiplierCount = useRef([])
  const timeCount_xaxis = useRef([])
  const realCounter_yaxis = useRef(5)
  const [autoPayoutMultiplier, setAutoPayoutMultiplier] = useState(
    localStorage.getItem('local_storage_multiplier') || 2,
  )

  // Crash API
  const API_BASE = 'http://localhost:4000'

  // Socket useEffect
  useEffect(() => {
    // Setup socket
    retrieve()
    const socket = io.connect('http://localhost:3001')
    setGlobalSocket(socket)

    // socket.on start multiplier count
    socket.on('start_multiplier_count', function (data) {
      setGlobalTimeNow(Date.now())
      setLiveMultiplierSwitch(true)
    })

    // socket.on stop multiplier count
    socket.on('stop_multiplier_count', function (data) {
      setLiveMultiplier(data)
      setLiveMultiplierSwitch(false)
      setBetActive(false)
    })

    // socket.on crash history
    socket.on('crash_history', function (data) {
      setCrashHistory(data)

      let temp_streak_list = []
      const new_data = data
      let blue_counter = 0
      let red_counter = 0

      for (let i = 0; i < data.length; i++) {
        if (new_data[i] >= 2) {
          blue_counter += 1
          red_counter = 0
          temp_streak_list.push(blue_counter)
        } else {
          red_counter += 1
          blue_counter = 0
          temp_streak_list.push(red_counter)
        }
      }
      setStreakList(temp_streak_list.reverse())
    })

    // On id
    socket.on('get_round_id_list', function (data) {
      setRoundIdList(data.reverse())
    })

    // socket.on starting betting phase
    socket.on('start_betting_phase', function (data) {
      setGlobalTimeNow(Date.now())
      setLiveMultiplier('Betting closed ..')
      setbBettingPhase(true)
      setLiveBettingTable(null)
      setHookToNextRoundBet(true)
      retrieve_active_bettors_list()

      multiplierCount.current = []
      timeCount_xaxis.current = []
    })

    // socket.on live betting table
    socket.on('receive_live_betting_table', (data) => {
      setLiveBettingTable(data)
      data = JSON.parse(data)
      setTenNumbers(Array(10 - data.length).fill(2))
    })
  }, [])

  // Next round bet useEffect
  useEffect(() => {
    if (hookToNextRoundBet) {
      if (bBetForNextRound) {
        send_bet()
      } else {
      }
      setHookToNextRoundBet(false)
      setbBetForNextRound(false)
    }
  }, [hookToNextRoundBet])

  // Auto payout useEffect
  useEffect(() => {
    if (betActive && autoPayoutMultiplier <= liveMultiplier) {
      userData.crash_balance += betAmount * autoPayoutMultiplier
      auto_cashout_early()
      setBetActive(false)
    }
  }, [liveMultiplier])

  const buttonClick = () => {
    socket.current.emit('clicked', { message2: Date.now() })
  }

  // Game counter useEffect
  useEffect(() => {
    let gameCounter = null
    if (liveMultiplierSwitch) {
      setLiveMultiplier('1.00')

      gameCounter = setInterval(() => {
        let time_elapsed = (Date.now() - globalTimeNow) / 1000.0
        setGamePhaseTimeElapsed(time_elapsed)
        setLiveMultiplier((1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2))

        if (multiplierCount.current.length < 1) {
          multiplierCount.current = multiplierCount.current.concat([1])
          timeCount_xaxis.current = timeCount_xaxis.current.concat([0])
        }
        if (realCounter_yaxis.current % 9 == 0) {
          multiplierCount.current = multiplierCount.current.concat([
            (1.0024 * Math.pow(1.0718, time_elapsed)).toFixed(2),
          ])
          timeCount_xaxis.current = timeCount_xaxis.current.concat([time_elapsed])
        }
        realCounter_yaxis.current += 1
      }, 1)
    }
    return () => {
      clearInterval(gameCounter)
    }
  }, [liveMultiplierSwitch])

  // Betting phase useEffect
  useEffect(() => {
    let bettingInterval = null

    if (bBettingPhase) {
      bettingInterval = setInterval(() => {
        let time_elapsed = (Date.now() - globalTimeNow) / 1000.0
        let time_remaining = (5 - time_elapsed).toFixed(2)
        setBettingPhaseTime(time_remaining)
        if (time_remaining < 0) {
          setbBettingPhase(false)
        }
      }, 5)
    }
    return () => {
      clearInterval(bettingInterval)
      setBettingPhaseTime('Betting closed ..')
    }
  }, [bBettingPhase])

  // bBet next round useEffect
  useEffect(() => {
    if (bBetForNextRound) {
    } else {
    }
  }, [bBetForNextRound])

  // Local storage useEffects
  useEffect(() => {
    localStorage.setItem('local_storage_wager', betAmount)
    localStorage.setItem('local_storage_multiplier', autoPayoutMultiplier)
  }, [betAmount, autoPayoutMultiplier])

  // Default loadings
  useEffect(() => {
    get_game_status()
    setChartSwitch(true)
    setStartTime(Date.now())
    let getActiveBettorsTimer = setTimeout(() => retrieve_active_bettors_list(), 1000)
    let getBetHistory = setTimeout(() => retrieve_bet_history(), 1000)

    return () => {
      clearTimeout(getActiveBettorsTimer)
      clearTimeout(getBetHistory)
    }
  }, [])

  // Live betting table
  useEffect(() => {}, [liveBettingTable])

  // Retrieve multiplier
  const retrieve = () => {
    Axios.get(API_BASE + '/retrieve', {
      withCredentials: true,
    }).then((res) => {
      setMultiplier(res.data)
    })
  }

  // Get game status
  const get_game_status = () => {
    Axios.get(API_BASE + '/get_game_status', {
      withCredentials: true,
    }).then((res) => {
      if (res.data.phase === 'betting_phase') {
        setGlobalTimeNow(res.data.info)
        setbBettingPhase(true)
      } else if (res.data.phase === 'game_phase') {
        setGlobalTimeNow(res.data.info)
        setLiveMultiplierSwitch(true)
      }
    })
  }

  // Get active betters list
  const retrieve_active_bettors_list = () => {
    Axios.get(API_BASE + '/retrieve_active_bettors_list', {
      withCredentials: true,
    }).then((res) => {})
  }

  // Get bet history
  const retrieve_bet_history = () => {
    Axios.get(API_BASE + '/retrieve_bet_history', {
      withCredentials: true,
    }).then((res) => {})
  }

  // Chart Data
  const sendToChart = () => {
    let backgroundType
    let crashBorder
    let crashBackground

    if (liveMultiplier < 2) {
      crashBorder = '#a6a7aa'
      crashBackground = 'rgba(146, 171, 211, 0.055)'
    }
    if (liveMultiplier > 2) {
      crashBorder = 'rgb(46, 204, 113)'
      crashBackground = 'rgba(46, 204, 112, 0.171)'
    }
    if (!liveMultiplierSwitch && liveMultiplier !== 'Betting closed ..' && liveMultiplier !== 'Connecting ..') {
      crashBorder = 'rgb(255, 90, 95)'
      crashBackground = 'rgba(255, 90, 96, 0.192)'
    }

    setChartData({
      labels: timeCount_xaxis.current,
      datasets: [
        {
          data: multiplierCount.current,
          backgroundColor: crashBackground,
          borderColor: crashBorder,
          color: 'rgba(255, 255, 255,1)',
          fill: true,
          pointRadius: 0,
          borderDash: [0, 0],
          lineTension: 0,
        },
      ],
    })

    setChartOptions({
      events: [],
      maintainAspectRatio: false,
      elements: {
        line: {
          tension: 0,
        },
      },
      scales: {
        y: {
          type: 'linear',
          title: {
            display: false,
            text: 'value',
          },
          min: 1,
          max: liveMultiplier > 3 ? liveMultiplier : 3,
          stepSize: 1,
          ticks: {
            font: {
              family: 'Industry-Black',
              size: '10px',
            },
            color: '#a6a7aa',
            maxTicksLimit: 5,
            callback: function (value, index, values) {
              if (value % 0.5 === 0) return parseFloat(value).toFixed(2)
            },
            align: 'inside', // Align ticks inside the chart
          },
          grid: {
            color: 'rgba(147, 172, 211, 0.5)', // Color of Y-axis grid lines
            drawOnChartArea: false, // Do not draw grid lines on the chart area
          },
          axis: {
            color: 'red', // Color of Y-axis line (left axis)
          },
        },
        x: {
          type: 'linear',
          title: {
            display: false,
            text: 'value',
          },
          max: gamePhaseTimeElapsed > 10 ? gamePhaseTimeElapsed : 10,
          ticks: {
            font: {
              family: 'Industry-Black',
              size: '10px',
            },
            color: '#a6a7aa',
            maxTicksLimit: 10,
            callback: function (value, index, values) {
              if (gamePhaseTimeElapsed < 20) {
                if (value % 1 === 0) return value
              } else {
                if (value % 10 === 0) return value
              }
            },
            align: 'inside', // Align ticks inside the chart
          },
          grid: {
            color: 'rgba(147, 172, 211, 0.5)', // Color of X-axis grid lines
            drawOnChartArea: false, // Do not draw grid lines on the chart area
          },
          axis: {
            color: 'green', // Color of X-axis line (bottom axis)
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
      animation: {
        x: {
          type: 'number',
          easing: 'linear',
          duration: 0,
          from: 1,
          delay: 0,
        },
        y: {
          type: 'number',
          easing: 'linear',
          duration: 0,
          from: 1,
          delay: 0,
        },
        loop: true,
      },
    })
  }

  // Exported context value
  const data = {
    betAmount,
    setBetAmount,
    liveMultiplier,
    liveMultiplierSwitch,
    betActive,
    chartData,
    setBetActive,
    crashHistory,
    setCrashHistory,
    bBettingPhase,
    setbBettingPhase,
    bettingPhaseTime,
    bBetForNextRound,
    setbBetForNextRound,
    hookToNextRoundBet,
    setHookToNextRoundBet,
    liveBettingTable,
    multiplier,
    setLiveBettingTable,
    globalTimeNow,
    setGlobalTimeNow,
    chartSwitch,
    setChartSwitch,
    gamePhaseTimeElapsed,
    setGamePhaseTimeElapsed,
    startTime,
    setStartTime,
    streakList,
    setStreakList,
    roundIdList,
    tenNumbers,
    setTenNumbers,
    multiplierCount,
    timeCount_xaxis,
    realCounter_yaxis,
    autoPayoutMultiplier,
    setAutoPayoutMultiplier,
    retrieve_active_bettors_list,
    retrieve_bet_history,
    sendToChart,
    get_game_status,
  }

  // Provide the socket context and its value to the children
  return <CrashDataContext.Provider value={data}>{children}</CrashDataContext.Provider>
}

export default CrashDataProvider
