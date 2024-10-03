import React, { useState, useEffect } from 'react'
import { useLotteryData } from 'api/LotteryDataRetriever'

const LotteryTimer = () => {
  const lotteryData = useLotteryData()
  // @ts-ignore
  const nextDraw = new Date(lotteryData.next_draw)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(nextDraw))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextDraw))
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(timer)
  }, [nextDraw])

  return (
    <div>
      {timeLeft ? (
        <div style={{ fontFamily: 'Industry-Black !important', fontSize: '40px' }}>
          <span style={{ fontFamily: 'Industry-Black' }}>{timeLeft.hours}:</span>
          <span style={{ fontFamily: 'Industry-Black' }}>{timeLeft.minutes}:</span>
          <span style={{ fontFamily: 'Industry-Black' }}>{timeLeft.seconds}</span>
        </div>
      ) : (
        <span>Draw Active</span>
      )}
    </div>
  )
}

const calculateTimeLeft = (nextDraw) => {
  const difference = nextDraw.getTime() - new Date().getTime()

  if (difference > 0) {
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  } else {
    return null
  }
}

export default LotteryTimer
