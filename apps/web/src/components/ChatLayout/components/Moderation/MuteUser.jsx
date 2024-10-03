import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Input as UIKitInput, Modal, Button, Text, Image } from '@kazama-defi/uikit'
import { muteUser, getUsername } from 'utils/apiRoutes'
import { useWeb3React, useSignMessage } from '@kazama-defi/wagmi'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { showKazamaToastSuccess } from '../../../KazamaToasts/success'
import { showKazamaToastError } from '../../../KazamaToasts/error'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    background: #21252b;
    border-bottom: 2px solid #11141e;
  }
`

const MuteUser = ({ onDismiss, address, status, time }) => {
  const [account, isConnected] = useWeb3React()
  const { signMessageAsync } = useSignMessage()
  const [username, setUsername] = useState(address)

  // Retrieve username
  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${getUsername}/${address}`)
      setUsername(response.username)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Execute retrieving
  useEffect(() => {
    if (account) {
      fetchUsername()
    }
  }, [account, address])

  // Additional text included in the message on the frontend
  const messagePrefix = `Kazama DeFi - Mute ${username} \n\nSign this message with the address below to verify you are the owner:\n`

  // Construct the message by concatenating the prefix and the address
  const message = messagePrefix + account

  // Execute retrieving
  useEffect(() => {
    if (account) {
      fetchUsername()
    }
  }, [account, address])

  // Execute mute
  const handleMute = async () => {
    if (account && isConnected) {
      const signature = await signMessageAsync({ message })
      try {
        const response = await axios.post(muteUser, {
          address,
          muted: status,
          expiration: time,
          signature,
        })

        if (response.status === 200) {
          showKazamaToastSuccess('Mute account', response.data.message)
        }
      } catch (error) {
        showKazamaToastError('Mute failed', error.message)
      }
    }
  }

  // Return modal
  return (
    <>
      <StyledModal
        title={`Tip ${receiverUsername.length > 20 ? truncateHash(receiverUsername) : receiverUsername}`}
        onDismiss={onDismiss}
      >
        <Text mb="8px">Enter tip amount:</Text>
        <Input type="number" value={tipAmount} onChange={(e) => setTipAmount(Number(e.target.value))} />
        <Button onClick={handleSendTip}>Send Tip</Button>
      </StyledModal>
    </>
  )
}

export default MuteUser
