/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Button } from '@kazama-defi/uikit'
import axios from 'axios'
import { useWeb3React } from '@kazama-defi/wagmi'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import ConnectToChat from 'components/ConnectToChat'
import { sendMessageRoute, setXp } from '../../utils/apiRoutes'
import { useChatData } from 'api/ChatDataRetriever'
import { useUserData } from 'api/DataRetriever'
import { useSocket } from 'api/SocketManager'
import { showKazamaToastError } from 'components/KazamaToasts/error'

const ActivateButton = styled(Button)`
  box-shadow: rgb(238 26 121 / 40%) 0px 0px 15px, rgb(255 255 255 / 20%) 0px 1px 0px inset,
    rgb(0 0 0 / 15%) 0px -3px 0px inset, rgb(238 26 121) 0px 0px 12px inset;
  height: 40px;
  border-radius: 7px;
  background: rgb(238, 26, 120);
  font-family: 'Rajdhani', sans-serif;
  color: #fff;
  font-size: 15px;
  width: 100%;
`

const ActivateBox = styled.div`
  padding: 15px;
  background: #1a1e23;
  width: 100%;
`

const ChatComponent = () => {
  const socket = useSocket()
  const scrollRef = useRef()
  const { account } = useWeb3React()
  const { messages } = useChatData()
  const userData = useUserData()

  const handleSendMsg = async (msg) => {
    if (!userData.general_data.is_activated) {
      // Early return if the user is not activated
      return
    }

    try {
      // Send the message to the server
      const response = await axios.post(sendMessageRoute, {
        sender: userData,
        message: msg,
      })

      // Time
      const updateTime = Date.now()

      // Emit the message to the socket server
      socket.current.emit('send-msg', {
        sender: userData,
        message: msg,
        updatedAt: updateTime,
      })

      if (account) {
        const addedXp = 200
        const accountId = userData._id
        await axios.post(`${setXp}/${accountId}`, {
          userId: accountId,
          xpChange: addedXp,
        })

        socket.current.emit('update-xp', userData.general_data.username)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.message) {
          showKazamaToastError('Failed sending message', error.response.data.message)
        }
      }
    }
  }

  // Scrollref
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Check if input should be showed
  const ShowMessageInput = () => {
    if (!account) {
      return (
        <ActivateBox>
          <ConnectToChat width="100%" />
        </ActivateBox>
      )
    }
    if (userData.general_data.is_activated) {
      return <MessageInput handleSendMsg={handleSendMsg} />
    }
    return (
      <ActivateBox>
        <ActivateButton>Activate Profile To Chat</ActivateButton>
      </ActivateBox>
    )
  }

  // Return message list + input
  return (
    <>
      <MessageList scrollRef={scrollRef} messages={messages} />
      {ShowMessageInput()}
    </>
  )
}

export default ChatComponent
