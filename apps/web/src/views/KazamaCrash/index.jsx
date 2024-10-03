import React, { useEffect, useState, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Text } from '@kazama-defi/uikit'
import { v4 as uuidv4 } from 'uuid'
import CrashChart from './components/CrashChart'
import CrashPage from 'components/Layout/CrashPage'
import { useCrashData } from 'api/CrashDataRetriever'

export const KAZAMA_CRASH = process.env.NEXT_PUBLIC_KAZAMA_CRASH_API

const GameContainer = styled.div`
  display: flex;
  padding: 0 20px; /* Adjust as needed */
`

const GameLeftDiv = styled.div`
  flex-basis: 60%;
`

const GameRightDiv = styled.div`
  background: grey;
  flex-basis: 40%;
`

const CrashText = styled(Text)`
  font-size: 92px;
  z-index: 13px;
  font-family: Industry-Black;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

const CountdownText = styled(Text)`
  font-size: 36px;
  font-family: Industry-Black;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

const BetsClosed = styled(Text)`
  font-size: 36px;
  font-family: Industry-Black;
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
`

const KazamaCrashContainer = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.8fr 1.2fr; /* Adjusted grid-template-columns */
  grid-template-rows: 1fr auto 1fr 1fr;
  gap: 10px 10px;
  grid-auto-flow: row;
  grid-template-areas:
    'crashbox crashbox current-bets'
    'crash-history crash-history current-bets' /* Adjusted grid-template-areas */
    'user-dash user-dash current-bets'; /* Adjusted grid-template-areas */
`

const CrashBox = styled.div`
  background: #1a1e23;
  overflow: hidden;
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 0.25rem;
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const CrashHistoryBox = styled.div`
  background: #1d2126;
  border-radius: 0.25rem;
  width: 100%;
  z-index: 100;
`

const CrashHistoryIndexes = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
  font-family: Industry-Black;

  .history-table {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .table-row {
    display: inline-block;
    padding: 10px;
    margin-right: 10px;
    text-align: center;
    white-space: nowrap;
  }

  .table-row-greens {
    font-family: Industry-Black;
    color: rgb(16, 217, 96);
  }

  .table-row-reds {
    font-family: Industry-Black;
    color: rgb(255, 90, 95);
  }
`

const BetContainer = styled.div`
  background: #1d2126;
`

const ControlsBox = styled.div`
  background: transparent;
`

const CSSPortalGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  width: 100%;
  height: 100%;

  @media (max-width: 1200px) {
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: 1fr;
  }
`

const Div1 = styled.div`
  grid-area: 1 / 1 / 6 / 6;
  background-color: #1a1e23;
  border-radius: 0.25rem;
  padding: 20px;
  margin-bottom: 10px;
  margin-right: 10px;
  min-height: 450px;

  @media (max-width: 1200px) {
    grid-area: 1 / 1 / 6 / 5;
  }

  @media (max-width: 768px) {
    grid-area: 1 / 1 / 5 / 3;
  }

  @media (max-width: 480px) {
    grid-area: 1 / 1 / 3 / 2;
  }
`

const Div3 = styled.div`
  grid-area: 1 / 6 / 9 / 8;
  background-color: #1d2126;
  border-radius: 0.25rem;

  @media (max-width: 1200px) {
    grid-area: 1 / 5 / 9 / 7;
  }

  @media (max-width: 768px) {
    grid-area: 1 / 3 / 9 / 5;
  }

  @media (max-width: 480px) {
    grid-area: 4 / 1 / 6 / 2;
  }
`

const Div4 = styled.div`
  grid-area: 6 / 1 / 9 / 6;
  background-color: #1d2126;
  border-radius: 0.25rem;
  margin-right: 10px;

  @media (max-width: 1200px) {
    grid-area: 6 / 1 / 9 / 5;
  }

  @media (max-width: 768px) {
    grid-area: 6 / 1 / 9 / 3;
  }

  @media (max-width: 480px) {
    grid-area: 6 / 1 / 9 / 2;
  }
`

function KazamaCrash() {
  const crashData = useCrashData()
  const multiplierCount = useRef([])
  const timeCount_xaxis = useRef([])

  //JSX
  return (
    <CrashPage>
      <CSSPortalGrid>
        <Div1>
          <CrashBox>
            <div
              className="basically-the-graph"
              style={{
                width: '100%',
                position: 'absolute',
                top: '12%',
                backgroundImage: 'url(/images/crash/grid.svg)',
              }}
            >
              {crashData.chartData ? (
                <CrashChart chartData={crashData.chartData} chartOptions={crashData.chartOptions} />
              ) : (
                ''
              )}
            </div>
            <div style={{ position: 'absolute', zIndex: 12, top: '22%' }}>
              {(() => {
                // if (liveMultiplier > 1.5) {
                //   return (
                //     <Image src="/images/games/kazamacrash/nyan.gif" width={300} height={300} zIndex={0} position="absolute" top="0" left="0" />
                //   )
                // }
                if (crashData.bBettingPhase) {
                  return <CountdownText>Starting in {crashData.bettingPhaseTime} seconds ..</CountdownText>
                } else {
                  return (
                    <CrashText
                      className={` ${
                        !crashData.liveMultiplierSwitch &&
                        crashData.liveMultiplier !== 'Betting closed ..' &&
                        crashData.liveMultiplier !== <BetsClosed>Connecting ..</BetsClosed>
                          ? 'multipler_crash_value_message'
                          : ''
                      }`}
                    >
                      {crashData.liveMultiplier !== 'Betting closed ..' ? (
                        crashData.liveMultiplier + 'x'
                      ) : (
                        <BetsClosed>Betting closed ..</BetsClosed>
                      )}
                    </CrashText>
                  )
                }
              })()}
            </div>
          </CrashBox>
          <CrashHistoryIndexes>
            <CrashHistoryBox>
              <ul className="history-table">
                {crashData.crashHistory
                  .slice(0)
                  .reverse()
                  .map((crash, index) => (
                    <li key={uuidv4()} className={`table-row ${crash >= 2 ? 'table-row-greens' : 'table-row-reds'}`}>
                      {crash}x
                      <div class="col col-1" style={{ fontSize: '11px', fontFamily: 'Flama', color: '#a6a7aa' }}>
                        ID: {crashData.roundIdList[index]}{' '}
                      </div>
                    </li>
                  ))}
              </ul>
            </CrashHistoryBox>
          </CrashHistoryIndexes>
        </Div1>
        <Div3></Div3>
        <Div4></Div4>
      </CSSPortalGrid>
    </CrashPage>
  )
}

export default KazamaCrash
