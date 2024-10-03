import React, { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import { Spinner } from '@kazama-defi/uikit'
import ProgressBar from '@ramonak/react-progress-bar'

const Wrapper = styled.div`
  margin: 0px;
  z-index: 10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: #21252b;
  transition: opacity 0.5s ease;
`

const PageLoader: React.FC<{}> = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let startTime = Date.now()
    const duration = 5000 // Loading duration in milliseconds

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const currentProgress = (elapsedTime / duration) * 100
      setProgress(currentProgress)

      if (elapsedTime >= duration) {
        clearInterval(interval)
        setIsLoading(false)
      }
    }, 100) // Update progress every 100 milliseconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Wrapper style={{ opacity: isLoading ? 1 : 0 }}>
      <ProgressBar
        className="glowing-progress-bar"
        baseBgColor="transparent"
        margin="0px 0px 0px 0px"
        transitionTimingFunction="ease-in-out"
        bgColor="linear-gradient(to right,transparent, #F7931E)"
        height="12px"
        width="100%"
        borderRadius="2px"
        isLabelVisible={false}
        completed={progress} // Set the progress value
        maxCompleted={100}
      />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '200px' }}>
        Loading ...
      </div>
    </Wrapper>
  )
}

export default PageLoader
