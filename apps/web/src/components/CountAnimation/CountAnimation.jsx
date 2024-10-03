import React, { useEffect, useState } from 'react'

const easeOutQuad = (t) => t * (2 - t)
const frameDuration = 1000 / 60

const CountAnimation = ({ children, duration = 2000, decimals = false }) => {
  const targetValue = parseFloat(children)
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const startValue = currentValue
    const countDown = startValue > targetValue

    let frame = 0
    const totalFrames = Math.round(duration / frameDuration)
    const counter = setInterval(() => {
      frame++
      const progress = easeOutQuad(frame / totalFrames)
      const newValue = countDown
        ? startValue - (startValue - targetValue) * progress
        : startValue + (targetValue - startValue) * progress

      setCurrentValue(newValue)

      if ((countDown && newValue <= targetValue) || (!countDown && newValue >= targetValue)) {
        clearInterval(counter)
        setCurrentValue(targetValue) // Ensure exact target value at the end
      }
    }, frameDuration)

    return () => clearInterval(counter)
  }, [children])

  return decimals ? Number(currentValue).toFixed(2) : Math.floor(currentValue)
}

export default CountAnimation
