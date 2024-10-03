import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { Input as UIKitInput, Modal, Button, Text, Image, cog } from '@kazama-defi/uikit'
import { useSignMessage } from '@kazama-defi/wagmi'
import { register } from 'utils/apiRoutes'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    background: #21252b;
    border-bottom: 2px solid #11141e;
  }
`

const Input = styled.input`
  /* Your styles for input */
  transition: margin 0.5s ease-in-out;
`

const KazamaToastHeader = styled.div`
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 3px;
`

// External APIs
const IPIFY_API = process.env.NEXT_PUBLIC_IPIFY

const RegisterAccount = ({ onDismiss, address, socket, onDismissCallback }) => {
  // Set consts
  const { signMessageAsync } = useSignMessage()
  const [username, setUsername] = useState(address)
  const [password, setPassword] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('No recovery email')
  const [ip, setIP] = useState('0.0.0.0')
  const [avatarImage, setAvatarImage] = useState('https://assets.kazama.io/profiles/avatars/default.jpg')
  const [additionalSecurity, setAdditionalSecurity] = useState(false)

  // Fetch IP
  useEffect(() => {
    getIp()
  }, [])

  // Func to get Ip
  const getIp = async () => {
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_IPIFY)
      setIP(res.data.ip)
    } catch (error) {
      console.error('Error fetching IP:', error)
    }
  }

  // Handle default registration on dismiss
  const handleDismiss = () => {
    if (onDismissCallback) {
      onDismissCallback()
    }
    onDismiss()
  }

  const handleRegistration = async () => {
    try {
      const response = await axios.post(register, {
        address,
        general_data: {
          username,
          has_password: additionalSecurity,
          password,
          recovery_email: recoveryEmail,
          balance_kazama: 0,
          ip,
          anonymous: false,
          avatar_image: avatarImage,
        },
        online_status: {
          is_online: true,
        },
        kazama_holder_ranks: {
          spacenaut: false,
          kraken: false,
          whale: false,
          shark: false,
          orca: false,
          dolphin: false,
          turtle: false,
          fish: false,
          crab: false,
          shrimp: false,
          holder: false,
        },
      })

      console.log('Registration successful:', response.data)
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <>
      <StyledModal title={'New Account'} onDismiss={handleDismiss}>
        <Text mb="8px">New account: {address}</Text>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <div style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            id="additionalSecurity"
            checked={additionalSecurity}
            onChange={() => setAdditionalSecurity(!additionalSecurity)}
          />
          <label htmlFor="additionalSecurity">Enable additional password security</label>
        </div>
        {additionalSecurity && (
          <>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Recovery Email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
          </>
        )}
        <Button onClick={handleRegistration}>Register</Button>
      </StyledModal>
    </>
  )
}

export default RegisterAccount
