import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Button, Text, Image, CloseIcon, ChevronFilledIcon, TimerIcon, EarnIcon } from '@kazama-defi/uikit'
import ProgressBar from '@ramonak/react-progress-bar'
import CountAnimation from './CountAnimation'
import lottie from 'lottie-web'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { claimRain } from 'utils/apiRoutes'
import { useAccount } from 'wagmi'
import { useSocket } from 'api/SocketManager'
import { useUserData } from 'api/DataRetriever'
import { useSignMessage } from '@kazama-defi/wagmi'
import { toast } from 'kazama-defi-react-toasts'
import 'kazama-defi-react-toasts/dist/KazamaToasts.css'
import { Zoom } from 'kazama-defi-react-toasts'

const RainBoxContainer = styled.div`
  top: 0;
  z-index: 20000;
  margin-right: 7px;
  margin-left: 7px;
  margin-bottom: 5px;
`

const StyledRainBox = styled.div`
  padding: 10px 10px 10px 13px;
  z-index: 11000;
  width: 100%;
  background: url(https://assets.kazama.io/images/rain_bg.jpg);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  border-radius: 0rem 0rem 0.25rem 0.25rem;
  height: 100%;
`

const KazamaRainText = styled(Text)`
  font-family: Industry-Black;
  font-size: 18px;
`

const KazamaToastHeader = styled.div`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 3px;
  font-family: Industry-Black;
`

const AmountText = styled(Text)`
  font-family: Industry-Black;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-shadow: -1px -1px 0 #1d2126, 2px -1px 0 #1d2126, -1px 2px 0 #1d2126, 2px 2px 0 #1d2126;
  user-select: none;
  ::after {
    content: attr(data-text);
    pointer-events: auto;
  }
`

const RainerNameText = styled(Text)`
  font-family: Industry-Black;
  color: white;
  font-size: 22px;
  font-weight: 600;
  text-shadow: -1px -1px 0 #1d2126, 2px -1px 0 #1d2126, -1px 2px 0 #1d2126, 2px 2px 0 #1d2126;
  user-select: none;
  ::after {
    content: attr(data-text);
    pointer-events: auto;
  }
`

const RainInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const LeftDiv = styled.div`
  flex: 1;
  margin-right: 7px;
  border-radius: 0.15rem 0.15rem 0.15rem 0.15rem;
  background: rgb(33, 37, 43);
  padding: 3px;
`

const MiddleDiv = styled.div`
  flex: 1;
  border-radius: 0.15rem 0.15rem 0.15rem 0.15rem;
  background: rgb(33, 37, 43);
`

const RightDiv = styled.div`
  flex: 1;
  margin-left: 7px;
  border-radius: 0.15rem 0.15rem 0.15rem 0.15rem;
  background: rgb(33, 37, 43);
`

const ClaimButton = styled(Button)`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.1s ease 0s;
  appearance: none;
  border: none;
  font-family: Flama Bold;
  cursor: pointer;
  user-select: none;
  height: 40px;
  padding: 0px 20px;
  border-radius: 0.25rem;
  font-size: 14px;
  color: #fff;
  width: 100%;
  background: #0b9e46;
  box-shadow: 0 10px 27px #00ff0c1a, 0 -3px #076d30 inset, 0 2px #0b9e46 inset !important;
`

const RainAnimationBox = styled.div`
  width: 100%;
  height: 100%;
`

const RevealBox = styled.div`
  text-align: center;
`

const RainerInfoBox = styled.div`
  display: flex;
  align-items: center;
`

const AmountInfoBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  margin-top: 5px;
`

const DigitBox = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: #1d2126;
  border-radius: 0.25rem;
  padding: 0.4rem;
  font-family: Industry-Black;
  font-size: 13px;
  width: 30px;
  height: 30px;
`

const NoSpotIcon = styled(CloseIcon)`
  width: 18px;
  fill: #a6a7aa !important;
`

const ArrowIcon = styled(ChevronFilledIcon)`
  width: 18px;
`

const ParticipantsInfoBox = styled.div`
  align-items: center;
  margin-top: 10px;
`

const ClaimDisabledButton = styled(Button)`
  border-radius: 0.25rem;
  width: 100%;
  border: 0px solid;
  height: 40px;
  background: rgb(33, 37, 43);
  font-family: Industry-Black;
  font-size: 14px;
`

const RainBox = ({ rainData, socket }) => {
  const [remainingTime, setRemainingTime] = useState('')
  const { signMessageAsync } = useSignMessage()
  const { address: account } = useAccount()
  const userData = useUserData()
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [prColor, setPrColor] = useState('linear-gradient(to right, #0b9e46, #10D960)')
  const [claimerAmount, setClaimerAmount] = useState(0)
  const [headerText, setHeaderText] = useState('New rain upcoming!')
  const [revealStatus, setRevealStatus] = useState(false)
  const [claimPhaseActive, setClaimPhaseActive] = useState(false)
  const [disabledText, setDisabledText] = useState('Countdown in progress')
  const [startingStatus, setStartingStatus] = useState(false)
  const [statusText, setStatusText] = useState('Total amount revealed in')
  const lottieContainerRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = useRef(null)

  // Function to handle smooth scrolling
  const scrollTo = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset
    }
  }

  useEffect(() => {
    const loadLottieAnimation = async () => {
      try {
        const animationUrl = 'https://assets.kazama.io/animations/lotties/moneyrain.json' // Replace with your animation URL
        const animationData = await fetch(animationUrl).then((res) => res.json())
        lottie.loadAnimation({
          container: lottieContainerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData,
        })
      } catch (error) {
        console.error('Error loading Lottie animation:', error)
      }
    }

    loadLottieAnimation()

    // Clean up on unmount
    return () => {
      lottie.destroy()
    }
  }, [])

  // Function to calculate remaining time and progress percentage
  const calculateRemainingTimeAndProgress = () => {
    const currentTime = new Date().getTime()
    const startingTime = rainData.current_rain.starting_in ? new Date(rainData.current_rain.starting_in).getTime() : 0
    const expirationTime = rainData.current_rain.expiration ? new Date(rainData.current_rain.expiration).getTime() : 0
    let targetTime = 0

    // Determine target time based on whether rain is starting or expiring
    if (startingTime > 0 && currentTime < startingTime) {
      // If starting time is in the future, count down starting time
      targetTime = startingTime

      // Calculate the difference in milliseconds
      const difference = targetTime - currentTime

      // If less than or equal to 30 seconds left until rain starts, reveal status
      if (difference <= 30000) {
        setRevealStatus(true)
        setHeaderText('Rain starting in')
        setStatusText('Rain starting in')
      } else {
        setStatusText('Amount revealed in')
      }
    } else if (expirationTime > 0) {
      // If starting time has passed or is undefined, count down expiration time
      setHeaderText('Rain ending in')
      setRevealStatus(true)
      setClaimPhaseActive(true)
      targetTime = expirationTime
      setStatusText('Rain ends in')
    }

    // Calculate remaining time if necessary
    if (targetTime !== 0) {
      let difference
      if (targetTime === startingTime) {
        // Countdown from starting_in minus 30 seconds
        difference = targetTime - currentTime - 30000

        // If the difference is negative or zero, set reveal status to true
        if (difference <= 0) {
          setRevealStatus(true)
          setStatusText('Rain starting in')
          difference = startingTime - currentTime // Restart countdown for the second phase
        }
      } else {
        // Countdown the remaining of starting_in (which is basically 30 seconds since we did that minus)
        difference = targetTime - currentTime
      }

      // Ensure that the difference is at least 0
      difference = Math.max(0, difference)

      if (difference <= 0) {
        // If the difference is negative or zero, set remaining time to 00:00:00 and progress to 100%
        setRemainingTime('00:00:00')
        setProgressPercentage(100)
        setHeaderText('Rain ended')
        setStatusText('Rain ended')
        setClaimPhaseActive(false)
      } else {
        // Calculate progress percentage based on remaining time until the target time
        const totalTime = expirationTime - startingTime
        const remainingPercentage = ((totalTime - difference) / totalTime) * 100
        setProgressPercentage(remainingPercentage)

        // Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        // Format the time with leading zeros and encapsulate each pair of digits in DigitBox
        const formattedTime = (
          <>
            {[
              hours.toString().padStart(2, '0'),
              minutes.toString().padStart(2, '0'),
              seconds.toString().padStart(2, '0'),
            ].map((timeUnit, index) => (
              <React.Fragment key={`unit-${index}`}>
                {timeUnit.match(/\d{1,2}/g).map((pair, pairIndex) => (
                  <DigitBox key={`pair-${pairIndex}`}>{pair}</DigitBox>
                ))}
                {index < 2 && <span> : </span>}
              </React.Fragment>
            ))}
          </>
        )
        setRemainingTime(formattedTime)
      }
    }
  }

  // Update remaining time and progress percentage every second
  useEffect(() => {
    const timer = setInterval(() => {
      calculateRemainingTimeAndProgress()
    }, 1000)

    // Clean up interval on component unmount
    return () => clearInterval(timer)
  }, [])

  // Calculate amount per claimer
  useEffect(() => {
    if (rainData.current_rain.participants_amount > 0) {
      const amountPerClaimer =
        rainData.current_rain.amount /
        rainData.current_rain.participants_amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })
      setClaimerAmount(amountPerClaimer.toFixed(2))
    }
  }, [rainData])

  // Handle create rain
  const handleClaim = async () => {
    // Additional text to include before the account address
    const messagePrefix = `Kazama DeFi - Claim Rain (Rain ID: ${rainData.rain_id}\n(ID: ${userData._id})\n\nSign this message with the address below to verify you are the owner:\n`

    // Concatenate the additional text with the account address
    const message = messagePrefix + account

    try {
      const signature = await signMessageAsync({ message })
      const response = await fetch(claimRain, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
          socketId: socket.current.id,
          signature,
        }),
      })

      // Log the response data for debugging
      const responseData = await response.json()

      // Check if the response indicates success
      if (responseData.message === `Successfully claimed rain`) {
        // Emit event to update sender balance
        // socket.current.emit("new-rain", { address: account, amount: rainAmount, participants: participantsAmount });
        socket.current.emit('claimed-rain', { address: account })
        kazamaToastSuccess(responseData.message)
      } else {
        kazamaToastFailed(responseData.message)
      }
    } catch (error) {
      kazamaToastFailed(error)
    }
  }

  const kazamaToastSuccess = (msg) => {
    toast.success(
      <>
        <KazamaToastHeader>{msg}</KazamaToastHeader>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>
            <Text fontSize="13px">${claimerAmount} has been added to your platform balance</Text>
          </div>
        </div>
      </>,
      {
        position: 'top-right',
        autoClose: 750000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        icon: <Image src="/images/chat/icons/wallet.png" width={22} height={22} />,
        transition: Zoom,
      },
    )
  }

  const kazamaToastFailed = (msg) => {
    toast.error(
      <>
        <KazamaToastHeader>Failed to claim rain</KazamaToastHeader>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div>
            <Text fontSize="13px">{msg}</Text>
          </div>
        </div>
      </>,
      {
        position: 'top-right',
        autoClose: 750000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        icon: <Image src="/images/chat/icons/wallet.png" width={22} height={22} />,
        transition: Zoom,
      },
    )
  }

  return (
    <>
      <RainBoxContainer>
        <div style={{ background: '#21252b', padding: '7px 7px 7px 13px', borderRadius: '0.25rem 0.25rem 0rem 0rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '4px' }}>
              <img
                style={{ borderRadius: '50%', padding: '1px', width: '22px' }}
                src={rainData.current_rain.rainer.avatar}
              />
            </div>
            <div>
              <div style={{ display: 'flex' }}>
                <div>
                  <Text fontFamily="Industry-Black" fontSize="14px" color="#fff">
                    {rainData.current_rain.rainer.username.length > 20
                      ? truncateHash(rainData.current_rain.rainer.username)
                      : rainData.current_rain.rainer.username}
                  </Text>
                </div>
                <div>
                  <Text fontFamily="Industry-Black" fontSize="14px" color="#fff">
                    &nbsp; made it rain!
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StyledRainBox>
          <RainerInfoBox>
            <TimerContainer>
              <div style={{ flexDirection: 'column' }}>
                <div style={{ fontSize: '13px', marginBottom: '7px' }}>{statusText}</div>
                <div>{remainingTime}</div>
              </div>
            </TimerContainer>
          </RainerInfoBox>
          <AmountInfoBox>
            <LeftDiv>
              <Text style={{ fontSize: '13px' }}>Total amount</Text>
              {revealStatus ? (
                <AmountText>
                  $<CountAnimation>{rainData.current_rain.amount}</CountAnimation>
                </AmountText>
              ) : (
                <>
                  <AmountText>?</AmountText>
                </>
              )}
            </LeftDiv>
            <MiddleDiv>
              <Text style={{ fontSize: '13px' }}>Amount left</Text>
              {revealStatus ? (
                <AmountText>
                  $<CountAnimation>{rainData.current_rain.amount_left}</CountAnimation>
                </AmountText>
              ) : (
                <>
                  <AmountText>?</AmountText>
                </>
              )}
            </MiddleDiv>
            <RightDiv>
              <Text style={{ fontSize: '13px' }}>Per spot</Text>
              {revealStatus ? (
                <AmountText>
                  $<CountAnimation>{claimerAmount}</CountAnimation>
                </AmountText>
              ) : (
                <>
                  <AmountText>?</AmountText>
                </>
              )}
            </RightDiv>
          </AmountInfoBox>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: rainData.current_rain.participants_amount > 16 ? 14 : 16 }, (_, index) => {
              const avatar =
                index < rainData.current_rain.participants_amount
                  ? rainData.current_rain.participated.avatars[index]
                  : null
              return (
                <div key={index} style={{ position: 'relative', marginRight: '-6px' }}>
                  {avatar ? (
                    <Image
                      src={avatar}
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: '2px solid #262a31',
                        overflow: 'hidden',
                      }}
                      alt={`Participant ${index + 1}`}
                    />
                  ) : (
                    <div
                      style={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        border: '2px solid #262a31',
                        backgroundColor: index < rainData.current_rain.participants_amount ? '#ccc' : '#3b424d',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      {index < rainData.current_rain.participants_amount ? (
                        <span style={{ fontFamily: 'Industry-Black', fontSize: '11px', color: '#666' }}>
                          {index + 1}
                        </span>
                      ) : (
                        <div
                          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-25%, -20%)' }}
                        >
                          <NoSpotIcon />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <ParticipantsInfoBox>
            <ProgressBar
              className="glowing-progress-bar"
              baseBgColor="rgba(16, 217, 96, 0.2)"
              margin="5px 0px 0px 0px"
              transitionTimingFunction="ease-in-out"
              bgColor={prColor}
              height="15px"
              width="100%"
              isLabelVisible={false}
              borderRadius="2px"
              completed={rainData.current_rain.participated.usernames.length}
              maxCompleted={rainData.current_rain.participants_amount}
            />
            <div style={{ marginTop: '10px' }}>
              {claimPhaseActive ? (
                <ClaimButton onClick={handleClaim}>Claim ${claimerAmount}</ClaimButton>
              ) : (
                <Button startIcon={<TimerIcon width={18} fill="#a6a7aa" />} disabled>
                  {disabledText}
                </Button>
              )}
            </div>
          </ParticipantsInfoBox>
        </StyledRainBox>
      </RainBoxContainer>
    </>
  )
}

export default RainBox
