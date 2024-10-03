import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Input as UIKitInput, Modal, Button, Text, Image } from '@kazama-defi/uikit'
import { banUser, getUsername } from 'utils/apiRoutes'
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

const BanUser = ({ onDismiss, address }) => {
  const { account, isActive: isConnected } = useWeb3React()
  const { signMessageAsync } = useSignMessage()
  const [username, setUsername] = useState(address)
  const [days, setDays] = useState(0)

  // Retrieve username
  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${getUsername}/${address}`)
      setUsername(response.data.username)
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
  const messagePrefix = `Kazama DeFi - Ban ${username} \n\nSign this message with the address below to verify you are the owner:\n`

  // Construct the message by concatenating the prefix and the address
  const message = messagePrefix + account

  // Execute mute
  const handleBan = async () => {
    if (account && isConnected) {
      const signature = await signMessageAsync({ message })
      try {
        const response = await axios.post(banUser, {
          address,
          banned: true,
          expiration: days * 24 * 60 * 60, // Convert days to seconds
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

  return (
    <>
      <StyledModal title={`Ban ${username.length > 20 ? truncateHash(username) : username}`} onDismiss={onDismiss}>
        <div>
          <Text>How many days do you want to ban this account?</Text>
          <UIKitInput
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Enter number of days"
          />
          <Button onClick={handleBan}>Ban User</Button>
        </div>
      </StyledModal>
    </>
  )
}

export default BanUser
