import React from 'react'
import styled from 'styled-components'
import { toast } from 'kazama-defi-react-toasts'
import 'kazama-defi-react-toasts/dist/KazamaToasts.css'
import { Zoom } from 'kazama-defi-react-toasts'
import { Text, Image } from '@kazama-defi/uikit'

// Styled component
const KazamaToastHeader = styled.div`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 3px;
  z-index: 1000;
`

// Function to show the toast
export const showKazamaToastError = (header, text) => {
  toast.error(
    <>
      <KazamaToastHeader>{header}</KazamaToastHeader>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div>
          <Text style={{ fontSize: '13px' }}>{text}</Text>
        </div>
      </div>
    </>,
    {
      position: 'top-right',
      autoClose: 7500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      icon: <Image src="/images/chat/icons/wallet.png" width={22} height={22} alt="Wallet Icon" />,
      transition: Zoom,
    },
  )
}
