import React from 'react'
import { Box, ButtonMenu, ButtonMenuItem, Flex, Text, SwapLineChart } from '@kazama-defi/uikit'
import 'chart.js/auto'
import { Chart, Line } from 'react-chartjs-2'
import moment from 'moment'
import 'chartjs-adapter-moment'
import { createChart, IChartApi, LineStyle, UTCTimestamp } from 'lightweight-charts'

//--------------------------------------------------------------------------------------------------------------
function CrashChart({ chartData, chartOptions }) {
  return (
    <>
      <div>
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>
    </>
  )
}

export default CrashChart
