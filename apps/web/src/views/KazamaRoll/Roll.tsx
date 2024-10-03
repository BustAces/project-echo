import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { roll_host, getRollData, placeBet } from 'utils/apiRoutes'
import styled, { keyframes, css } from 'styled-components'
import axios from 'axios'
import { Input as UIKitInput, RollGreenIcon } from '@kazama-defi/uikit'
import { useWeb3React } from '@kazama-defi/wagmi'
import { useSocket } from '../../api/SocketManager'
import RollPage from 'components/Layout/RollPage'
import { showKazamaToastError } from 'components/KazamaToasts/error'
import { showKazamaToastSuccess } from 'components/KazamaToasts/success'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { NextLinkFromReactRouter } from 'components/NextLink'
import CountAnimation from 'components/CountAnimation/CountAnimation'
import { handleHistoryImage } from './Handlers/HistoryImage'
import { historyColors, shadowColors } from './Styles/Colors'
import { colorMapping } from './Mappings/colorMapping'
import { cardRows } from './Components/CardRows'
import { RollTimerBar, RollTimerContainer } from './Components/TimerBar'
import {
  BetButtonSmall,
  ButtonLeft,
  ButtonMiddle,
  ButtonRight,
  ButtonChildren,
  BlackBetButton,
  GreenBetButton,
  RedBetButton,
} from './Components/Buttons'

const KazamaRollWrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 150px;
`

const HistoryContainer = styled.div`
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const BetControlBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 0.5rem;
`

const BetDiv = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 0.5rem;
`

const BetBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const BetBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  border-radius: 0.5rem;
  height: auto;
  overflow: visible;
  flex-grow: 1;
`

const HistoryWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`

const RollTimer = styled.div<{ countingDown: boolean }>`
  font-family: Industry-Black;
  color: #a6a7aa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 24px;
  margin-top: 20px;
  opacity: ${({ countingDown }) => (countingDown ? '1' : '0')};
  transition: opacity 0.5s ease-in-out;
`

const ColorCount = styled.div`
  font-family: Industry-Black;
  font-size: 18px;
  margin-bottom: 10px;
  color: #a6a7aa;
`

const KazamaRollHistory = styled.div`
  height: 30px;
  width: 30px;
  margin: 1px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5em;
  transition: opacity 0.1s;
  background-color: ${({ color }) => color};
  box-shadow: ${({ boxShadow }) => boxShadow || '0 0 0 rgba(0, 0, 0, 0)'};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const BetInput = styled(UIKitInput)`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: transparent;
`

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  margin-top: 5px;
`

const AccountDiv = styled.div<{ bettingOpen: boolean }>`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a1e23;
  border-radius: 0.25rem;
  font-size: 0.9rem;
`

const PlayerStatBox = styled.div`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
  font-size: 0.9rem;
`

const AccountLink = styled(NextLinkFromReactRouter)`
  color: #fff;
  font-size: 14px;
`

const BetInputWrapper = styled.div`
  margin-top: 20px;
  background: #1a1e23;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
  border-radius: 0.25rem;
  padding-left: 8px;
  padding-right: 4px;
  border: 1px solid rgba(0, 0, 0, 0.157);
  width: 100%;
`

const AvatarWrapper = styled.div`
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
`

const StatsWrapper = styled.div``

const RedHistory = styled.div`
  background: #1d2126;
  padding: 2px;
  border-radius: 2px;
`

const BlackHistory = styled.div`
  background: #1d2126;
  padding: 2px;
  border-radius: 2px;
`

const GreenHistory = styled.div`
  background: #1d2126;
  padding: 2px;
  border-radius: 2px;
`

const KingsHistory = styled.div`
  background: #1d2126;
  padding: 2px;
  border-radius: 2px;
`

// Kazama Roll Component
const KazamaRoll = () => {
  const getColor = (number: number) => colorMapping[number]
  const socket = useSocket()
  const { account } = useWeb3React()
  const roll_socket = useRef()
  const spinRef = useRef(null)
  const [outcome, setOutcome] = useState(13)
  const [progress, setProgress] = useState(0)
  const [nextDraw, setNextDraw] = useState()
  const [spinHistory, setSpinHistory] = useState([])
  const [redPlayers, setRedPlayers] = useState([])
  const [greenPlayers, setGreenPlayers] = useState([])
  const [blackPlayers, setBlackPlayers] = useState([])
  const [kingsPlayers, setKingsPlayers] = useState([])
  const [betEnabled, setBetEnabled] = useState(false)
  const [forceSpin, setForceSpin] = useState(0)
  const [betAmount, setBetAmount] = useState(0)
  const [autoBetAmount, setAutoBetAmount] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [trippleJackpot, setTrippleJackpot] = useState(0)
  const [doubleJackpot, setDoubleJackpot] = useState(0)
  const [quadsJackpot, setQuadsJackpot] = useState(0)
  const [lastBet, setLastBet] = useState(null)
  const [lastOutcome, setLastOutcome] = useState(null)
  const spinDuration = 6
  const [countDownActive, setCountDownActive] = useState(false)
  const [countdown, setCountdown] = useState({
    seconds: 0,
    milliseconds: 0,
  })

  // Set socket for roll game
  useEffect(() => {
    roll_socket.current = io(roll_host)
  }, [])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch initial data from API
        const response = await axios.get(getRollData)
        const { next_draw, spin_history, jackpots } = response.data
        const { tripple_green, double_green, quads_streak } = jackpots

        // Load initial data
        setNextDraw(next_draw)
        setSpinHistory(spin_history.reverse() || [])
        setTrippleJackpot(tripple_green.amount)
        setDoubleJackpot(double_green.amount)
        setQuadsJackpot(quads_streak.amount)
      } catch (error) {
        // Throw error if failed
        console.error('Error fetching roll data:', error)
      }
    }
    // Execute data fetch
    fetchData()
  }, [])

  // Disable right click on the roll wrapper
  useEffect(() => {
    const kazamaRollWrapper = document.querySelector('.kazama-roll-wrapper')
    const handleRightClick = (e) => {
      e.preventDefault()
    }

    // Execute
    kazamaRollWrapper.addEventListener('contextmenu', handleRightClick)

    // Clean up the event listener when the component unmounts
    return () => {
      kazamaRollWrapper.removeEventListener('contextmenu', handleRightClick)
    }
  }, [])

  // Bet handler
  const handleBet = async (color) => {
    // Send bet request to server
    try {
      const response = await axios.post(placeBet, {
        address: account,
        betAmount: parseFloat(betAmount),
        color: color,
      })

      // If server response is OK
      if (response.status === 200) {
        roll_socket.current.emit('update-round-data', color)
        socket.current.emit('account-balance-update', socket.current.id, account)
        setLastBet(color)
      }
    } catch (error) {
      // If server returns an error
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error'
      // Show kazama toast error with error message
      showKazamaToastError('Failed placing bet', errorMessage)
    }
  }

  // UseEffect to initiate spin
  useEffect(() => {
    // Execute function
    initSpin()

    // Set timer bar interval
    const interval = setInterval(() => {
      const now = new Date()
      const nextDrawDate = new Date(nextDraw)
      const timeDifference = nextDrawDate - now
      const totalDuration = nextDrawDate - new Date(now - 3600 * 1000)

      // If next draw date and current date difference is > 0 then set timer data
      if (timeDifference > 0) {
        const seconds = Math.floor(timeDifference / 1000)
        const milliseconds = Math.floor((timeDifference % 1000) / 10)
          .toString()
          .padStart(2, '0')
        setCountdown({ seconds, milliseconds })
        setProgress(((totalDuration - timeDifference) / totalDuration) * 100)
        setCountDownActive(true)
      } else {
        // Timer done, clear interval and set timer data
        clearInterval(interval)
        setCountdown({ seconds: 0, milliseconds: '00' })
        setProgress(100)
        setCountDownActive(false)
      }
    }, 1)

    // Return clear interval
    return () => {
      clearInterval(interval)
      if (spinRef.current) {
        spinRef.current.innerHTML = ''
      }
    }
  }, [nextDraw])

  // Initiate spin function
  const initSpin = () => {
    const spinner = spinRef.current
    const rollRows = cardRows

    // Only if spinner has data
    if (spinner) {
      spinner.innerHTML = ''
      for (let x = 0; x < 29; x++) {
        spinner.insertAdjacentHTML('beforeend', rollRows)
      }
    }
  }

  // Function to spin
  const spinRoll = (roll) => {
    const spinner = spinRef.current
    const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4]
    const position = order.indexOf(roll)
    const rows = 12
    const cardWidth = 75 + 3 * 2
    let landingPosition = rows * 15 * cardWidth + position * cardWidth

    // Randomize position slightly for a more natural effect
    const randomize = Math.floor(Math.random() * 75) - 75 / 2
    landingPosition += randomize

    // Object math
    const object = {
      x: Math.floor(Math.random() * 50) / 100,
      y: Math.floor(Math.random() * 20) / 100,
    }

    // If spinner has data, execute
    if (spinner) {
      // Set the spinner's transition and position for the animation
      spinner.style.transitionTimingFunction = `cubic-bezier(0,${object.x},${object.y},1)`
      spinner.style.transitionDuration = `${spinDuration}s`
      spinner.style.transform = `translate3d(-${landingPosition}px, 0px, 0px)`

      // Get all the cards
      const cards = Array.from(spinner.querySelectorAll('.card'))

      // Darken all the cards initially
      cards.forEach((card) => card.classList.add('all-darkened'))

      const highlightInterval = setInterval(() => {
        // Get the current translation value of the spinner
        const spinnerStyle = window.getComputedStyle(spinner)
        const transformMatrix = spinnerStyle.transform

        // Extract the current X translation value (translate3d)
        const matrixValues = transformMatrix.match(/matrix.*\((.+)\)/)
        const currentTranslateX = matrixValues ? parseFloat(matrixValues[1].split(', ')[4]) : 0

        // Calculate the center point (selector) relative to the spinner's position
        const selectorLeft = spinner.getBoundingClientRect().width / 2 - currentTranslateX

        // Set closestCard and closestDistance
        let closestCard = null
        let closestDistance = Infinity

        // Find the card closest to the center (selector)
        cards.forEach((card) => {
          const cardLeft = card.offsetLeft + cardWidth / 2
          const distance = Math.abs(selectorLeft - cardLeft)

          // If distance is lower than closestDistance
          if (distance < closestDistance) {
            closestDistance = distance
            closestCard = card
          }
        })

        // Executed if closestCard has data
        if (closestCard) {
          // Remove highlight from all other cards
          cards.forEach((card) => card.classList.remove('highlighted'))
          // Highlight the closest card
          closestCard.classList.add('highlighted')
        }
        // 60 FPS interval for smooth highlighting
      }, 16)

      // Timeout to smooth out to the next round
      setTimeout(() => {
        // Reset spinner style after the spin
        spinner.style.transitionTimingFunction = ''
        spinner.style.transitionDuration = ''
        const resetTo = -(position * cardWidth + randomize)
        spinner.style.transform = `translate3d(${resetTo}px, 0px, 0px)`

        // Clear the interval and reset card classes after the spin
        clearInterval(highlightInterval)
        cards.forEach((card) => {
          card.classList.remove('all-darkened')
        })
        cards.forEach((card) => card.classList.add('normal'))
        // Default 12.125 seconds
      }, 12250)
    }
  }

  // UseEffect containing socket events
  useEffect(() => {
    if (roll_socket.current) {
      // Finalize round and set new data
      const finalizeRound = (data) => {
        // New next draw data
        setNextDraw(data.next_draw)
        // New bet enabled data (true)
        setBetEnabled(data.bet_enabled)
        // Updated Tripple Green Jackpot data
        setTrippleJackpot(data.newJackpotAmounts.trippleJackpot)
        // Updated Double Green Jackpot data
        setDoubleJackpot(data.newJackpotAmounts.doubleJackpot)
        // Updated Quads Jackpot data
        setQuadsJackpot(data.newJackpotAmounts.quadsJackpot)
        // Retrieve and set new history data
        const { ...restnewHistoryEntry } = data.latest_spin_history_entry
        // Set new spin history data with a max of 100 entries
        setSpinHistory((prevHistory) => {
          const newHistory = [restnewHistoryEntry, ...prevHistory]
          if (newHistory.length > 100) {
            newHistory.pop()
          }
          return newHistory
        })
      }

      // New roll data
      const handleNewRoll = (data) => {
        // Retrieve and set new random number
        const { random_number } = data.newRollData
        // Update set outcome with new random number from server
        setOutcome(parseInt(random_number))
        // Update bet enabled data (false)
        setBetEnabled(data.bettingStatus)
        // Update forcespin constant to trigger the spinner
        setForceSpin((prev) => prev + 1)
        // Update last outcome for the history image
        setLastOutcome(getColor(random_number))
      }

      // Handle last added player
      const handleUpdates = (data) => {
        // Set new constants retrieved from data
        const { color, lastAddedPlayer, newJackpotAmounts } = data
        // Updated Tripple Green Jackpot data
        setTrippleJackpot(newJackpotAmounts.trippleJackpot)
        // Updated Double Green Jackpot data
        setDoubleJackpot(newJackpotAmounts.doubleJackpot)
        // Updated Quads Jackpot data
        setQuadsJackpot(newJackpotAmounts.quadsJackpot)

        // Update player bets
        if (lastAddedPlayer) {
          const updatePlayerList = (players) => {
            // Check if player already is present in the index arrays
            const playerIndex = players.findIndex((player) => player.id === lastAddedPlayer.id)
            // If the player is present
            if (playerIndex >= 0) {
              // Update the player`s data
              const updatedPlayers = [...players]
              updatedPlayers[playerIndex] = lastAddedPlayer
              return updatedPlayers
              // Else when the player is not present
            } else {
              // Add new player to the list
              return [...players, lastAddedPlayer]
            }
          }

          // Update player lists based on picked color
          if (color === 'red') {
            // Update red players list if red
            setRedPlayers((prevPlayers) => updatePlayerList(prevPlayers))
          } else if (color === 'black') {
            // Update red players list if black
            setBlackPlayers((prevPlayers) => updatePlayerList(prevPlayers))
          } else if (color === 'green') {
            // Update red players list if green
            setGreenPlayers((prevPlayers) => updatePlayerList(prevPlayers))
            // Update red players list if kings are picked
          } else if (color === 'kings') {
            setKingsPlayers((prevPlayers) => updatePlayerList(prevPlayers))
          }
        }
      }

      // Roll socket listeners to execute the functions
      roll_socket.current.on('new-roll', handleNewRoll)
      roll_socket.current.on('finalize-round', finalizeRound)
      roll_socket.current.on('updated-round-data', handleUpdates)

      // Clean up after execution
      return () => {
        roll_socket.current.off('new-roll', handleNewRoll)
        roll_socket.current.off('finalize-round', finalizeRound)
        roll_socket.current.off('updated-round-data', handleUpdates)
      }
    }
  }, [])

  // Clear bet lists
  useEffect(() => {
    setRedPlayers([])
    setBlackPlayers([])
    setGreenPlayers([])
    setKingsPlayers([])
  }, [nextDraw])

  // Sort players by bet amount in descending order
  const sortPlayersByBet = (players) => {
    return players.slice().sort((a, b) => b.bet_amount - a.bet_amount)
  }

  // Execute spin
  useEffect(() => {
    spinRoll(outcome)
  }, [forceSpin])

  // Function for last 100 spin color history
  const getColorCounts = () => {
    const colorCounts = { red: 0, black: 0, green: 0, kings: 0 }
    // Update item
    spinHistory.forEach((item) => {
      if (item.is_king) {
        // Add to kings
        colorCounts.kings++
      } else if (item.color === 'red') {
        // Add to reds
        colorCounts.red++
      } else if (item.color === 'black') {
        // Add to blacks
        colorCounts.black++
      } else if (item.color === 'green') {
        // Add to greens
        colorCounts.green++
      }
    })
    // Return the counts
    return colorCounts
  }

  // Set colorCounts constant with getColorCounts function
  const colorCounts = getColorCounts()

  // Effect to handle progress bar animation on nextDraw change
  useEffect(() => {
    setIsAnimating(true)

    // Stop the animation once completed
    const timer = setTimeout(() => {
      setIsAnimating(false)
      // Match the duration of the animation, default 18 seconds
    }, 18000)

    // Clear timer on return
    return () => clearTimeout(timer)
  }, [nextDraw])

  useEffect(() => {
    // Delay execution by 7 seconds after forceSpin changes
    setTimeout(() => {
      const outcomeColor = getColor(outcome)

      // Update players balances on the frontend after the spin
      const updatePlayers = (players, color) => {
        return players.map((player) => {
          // Return color and multiplier based on color
          if (color === outcomeColor) {
            // Check if green, red or black
            const multiplier = color === 'green' ? 14 : 1.97
            // Set endAmount and add multiplier
            const endAmount = (player.bet_amount * multiplier).toFixed(2)
            // Return positive balance (win)
            return {
              // Keep numeric value for CountAnimation
              ...player,
              bet_amount: +endAmount,
              textColor: '#00c74d',
            }
          } else {
            // Return negative balance (loss)
            return {
              // Keep numeric value for CountAnimation
              ...player,
              bet_amount: -player.bet_amount,
              textColor: '#de4c41',
            }
          }
        })
      }

      // Update player lists
      setRedPlayers((prev) => updatePlayers(prev, 'red'))
      setBlackPlayers((prev) => updatePlayers(prev, 'black'))
      setGreenPlayers((prev) => updatePlayers(prev, 'green'))
      setKingsPlayers((prev) => updatePlayers(prev, 'kings'))

      // 7 seconds delay
    }, 7000)
  }, [forceSpin, outcome])

  // Bet lenghts
  const playerCountRed = redPlayers.length
  const playerCountGreen = greenPlayers.length
  const playerCountBlack = blackPlayers.length
  const playerCountKings = kingsPlayers.length

  return (
    <RollPage>
      <KazamaRollWrapper>
        <div>
          <CountAnimation decimals={true}>{trippleJackpot.toFixed(2)}</CountAnimation>
        </div>
        <div>
          <CountAnimation decimals={true}>{doubleJackpot.toFixed(2)}</CountAnimation>
        </div>
        <div>
          <CountAnimation decimals={true}>{quadsJackpot.toFixed(2)}</CountAnimation>
        </div>
        <div>
          <HistoryContainer>
            <HistoryWrapper>
              {spinHistory.slice(0, 10).map((item, index) => (
                <KazamaRollHistory
                  key={index}
                  color={historyColors[item.color] || '#ffffff'}
                  boxShadow={shadowColors[item.color]}
                  isVisible={true}
                >
                  <img
                    src={handleHistoryImage(item.random_number)} // Get the appropriate image based on random_number
                    alt="roll history"
                    style={
                      item.random_number === 0
                        ? { width: '20px' } // Size for random_number 0
                        : item.random_number >= 1 && item.random_number <= 3
                        ? { width: '70%', height: '70%' } // Size for random_number 1 to 3
                        : item.random_number === 4
                        ? { width: '23px' } // Size for random_number 4
                        : item.random_number >= 5 && item.random_number <= 7
                        ? { width: '75%', height: '75%' } // Size for random_number 5 to 7
                        : item.random_number >= 8 && item.random_number <= 10
                        ? { width: '18px' } // Size for random_number 8 to 10
                        : item.random_number === 11
                        ? { width: '23px' } // Size for random_number 11
                        : item.random_number >= 12 && item.random_number <= 14
                        ? { width: '19px' } // Size for random_number 12 to 14
                        : { width: '100%', height: '100%' } // Default size if none match
                    }
                  />
                </KazamaRollHistory>
              ))}
            </HistoryWrapper>
            <HistoryWrapper>
              <RedHistory>{colorCounts.red}</RedHistory>
              <BlackHistory>{colorCounts.black}</BlackHistory>
              <GreenHistory>{colorCounts.green}</GreenHistory>
              <KingsHistory>{colorCounts.kings}</KingsHistory>
            </HistoryWrapper>
          </HistoryContainer>
        </div>

        <div className="kazama-roll-wrapper">
          <div className="selector" />
          <div className="spinner" ref={spinRef}></div>
        </div>
        <RollTimerContainer>{isAnimating && betEnabled ? <RollTimerBar /> : null}</RollTimerContainer>
        <RollTimer countingDown={countDownActive}>
          Rolling in {`${countdown.seconds}:${countdown.milliseconds}`}
        </RollTimer>
        <div>
          <BetControlBox>
            <BetInputWrapper>
              <BetInput
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter bet amount"
              />
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                LAST
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                MIN
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                1/2
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                x2
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                +1000
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                MAX
              </BetButtonSmall>
            </BetInputWrapper>
            <BetInputWrapper>
              <BetInput
                type="number"
                value={autoBetAmount}
                onChange={(e) => setAutoBetAmount(e.target.value)}
                placeholder="Enter bet amount"
              />
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                LAST
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                MIN
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                1/2
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                x2
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                +1000
              </BetButtonSmall>
              <BetButtonSmall
                onClick={() => {
                  /* add your onClick handler here */
                }}
              >
                MAX
              </BetButtonSmall>
            </BetInputWrapper>
          </BetControlBox>

          <BetDiv>
            <BetBoxWrapper>
              <BetBox>
                <RedBetButton bettingOpen={betEnabled} onClick={betEnabled ? () => handleBet('red') : null}>
                  <ButtonChildren>
                    <ButtonLeft>1</ButtonLeft>
                    <ButtonMiddle>Place Bet</ButtonMiddle>
                    <ButtonRight>x1.97</ButtonRight>
                  </ButtonChildren>
                </RedBetButton>
                <div>
                  <PlayerStatBox>
                    <div>{playerCountRed}</div>
                    <div>2</div>
                  </PlayerStatBox>
                  <PlayerList>
                    {sortPlayersByBet(redPlayers).map((player, index) => (
                      <AccountDiv key={index}>
                        <AccountLink to={`/profile/${player.username}`}>
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <AvatarWrapper>
                              <img
                                style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.25rem' }}
                                src={player.avatar}
                              />
                            </AvatarWrapper>
                            {player.username.length > 20 ? truncateHash(player.username) : player.username}
                          </div>
                        </AccountLink>
                        {redPlayers.map((player) => (
                          <div key={player.id} style={{ color: player.textColor }}>
                            <CountAnimation decimals={true}>{player.bet_amount}</CountAnimation>
                          </div>
                        ))}
                      </AccountDiv>
                    ))}
                  </PlayerList>
                </div>
              </BetBox>
            </BetBoxWrapper>
            <BetBoxWrapper>
              <BetBox>
                <GreenBetButton bettingOpen={betEnabled} onClick={betEnabled ? () => handleBet('green') : null}>
                  <ButtonChildren>
                    <ButtonLeft>1</ButtonLeft>
                    <ButtonMiddle>Place Bet</ButtonMiddle>
                    <ButtonRight>x14</ButtonRight>
                  </ButtonChildren>
                </GreenBetButton>
                <PlayerStatBox>
                  <div>{playerCountGreen}</div>
                  <div>2</div>
                </PlayerStatBox>
                <PlayerList>
                  {sortPlayersByBet(greenPlayers).map((player, index) => (
                    <AccountDiv key={index}>
                      <AccountLink to={`/profile/${player.username}`}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <AvatarWrapper>
                            <img
                              style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.25rem' }}
                              src={player.avatar}
                            />
                          </AvatarWrapper>
                          {player.username.length > 20 ? truncateHash(player.username) : player.username}
                        </div>
                      </AccountLink>
                      {greenPlayers.map((player) => (
                        <div key={player.id} style={{ color: player.textColor }}>
                          <CountAnimation decimals={true}>{player.bet_amount}</CountAnimation>
                        </div>
                      ))}
                    </AccountDiv>
                  ))}
                </PlayerList>
              </BetBox>
            </BetBoxWrapper>
            <BetBoxWrapper>
              <BetBox>
                <BlackBetButton bettingOpen={betEnabled} onClick={betEnabled ? () => handleBet('black') : null}>
                  <ButtonChildren>
                    <ButtonLeft>1</ButtonLeft>
                    <ButtonMiddle>Place Bet</ButtonMiddle>
                    <ButtonRight>x1.97</ButtonRight>
                  </ButtonChildren>
                </BlackBetButton>
                <PlayerStatBox>
                  <div>{playerCountBlack}</div>
                  <div>2</div>
                </PlayerStatBox>
                <PlayerList>
                  {sortPlayersByBet(blackPlayers).map((player, index) => (
                    <AccountDiv key={index}>
                      <AccountLink to={`/profile/${player.username}`}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <AvatarWrapper>
                            <img
                              style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.25rem' }}
                              src={player.avatar}
                            />
                          </AvatarWrapper>
                          {player.username.length > 20 ? truncateHash(player.username) : player.username}
                        </div>
                      </AccountLink>
                      {blackPlayers.map((player) => (
                        <div key={player.id} style={{ color: player.textColor }}>
                          <CountAnimation decimals={true}>{player.bet_amount}</CountAnimation>
                        </div>
                      ))}
                    </AccountDiv>
                  ))}
                </PlayerList>
              </BetBox>
            </BetBoxWrapper>
            <BetBoxWrapper>
              <BetBox>
                <BlackBetButton bettingOpen={betEnabled} onClick={betEnabled ? () => handleBet('kings') : null}>
                  <ButtonChildren>
                    <ButtonLeft>1</ButtonLeft>
                    <ButtonMiddle>Place Bet</ButtonMiddle>
                    <ButtonRight>x7</ButtonRight>
                  </ButtonChildren>
                </BlackBetButton>
                <PlayerStatBox>
                  <div>{playerCountKings}</div>
                  <div>2</div>
                </PlayerStatBox>
                <PlayerList>
                  {sortPlayersByBet(kingsPlayers).map((player, index) => (
                    <AccountDiv key={index}>
                      <AccountLink to={`/profile/${player.username}`}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <AvatarWrapper>
                            <img
                              style={{ height: '1.75rem', width: '1.75rem', borderRadius: '0.25rem' }}
                              src={player.avatar}
                            />
                          </AvatarWrapper>
                          {player.username.length > 20 ? truncateHash(player.username) : player.username}
                        </div>
                      </AccountLink>
                      {kingsPlayers.map((player) => (
                        <div key={player.id} style={{ color: player.textColor }}>
                          <CountAnimation decimals={true}>{player.bet_amount}</CountAnimation>
                        </div>
                      ))}
                    </AccountDiv>
                  ))}
                </PlayerList>
              </BetBox>
            </BetBoxWrapper>
          </BetDiv>
        </div>
      </KazamaRollWrapper>
    </RollPage>
  )
}

export default KazamaRoll
