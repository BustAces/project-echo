import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useWeb3React } from '@kazama-defi/wagmi'
import { getPlatformData } from 'utils/apiRoutes'
import { useSocket } from './SocketManager'
import { useUserData } from './DataRetriever'
import { getAllMessagesRoute } from '../utils/apiRoutes'
import { showKazamaToastError } from 'components/KazamaToasts/error'

// Create a new context with initial state as defaultValue
const chatDataContext = createContext({
  message: {
    text: '',
    emoji_reactions: {
      smile: {
        addresses: [],
      },
      bigsmile: {
        addresses: [],
      },
      sweatsmile: {
        addresses: [],
      },
      rofl: {
        addresses: [],
      },
      wink: {
        addresses: [],
      },
      winkt: {
        addresses: [],
      },
      ctw: {
        addresses: [],
      },
      frowning: {
        addresses: [],
      },
      weary: {
        addresses: [],
      },
      angry: {
        addresses: [],
      },
      sunglasses: {
        addresses: [],
      },
      heyes: {
        addresses: [],
      },
      mm: {
        addresses: [],
      },
      hf: {
        addresses: [],
      },
      cf: {
        addresses: [],
      },
      heart: {
        addresses: [],
      },
      pooh: {
        addresses: [],
      },
      alien: {
        addresses: [],
      },
      rocket: {
        addresses: [],
      },
      scb: {
        addresses: [],
      },
      beers: {
        addresses: [],
      },
      ghost: {
        addresses: [],
      },
      pepe: {
        addresses: [],
      },
      batman_pepe: {
        addresses: [],
      },
      lunatic_pepe: {
        addresses: [],
      },
      pepe_sad: {
        addresses: [],
      },
      pepe_heart: {
        addresses: [],
      },
      suspicious_pepe: {
        addresses: [],
      },
      cheering_pepe: {
        addresses: [],
      },
      thug_pepe: {
        addresses: [],
      },
      pepe_wink: {
        addresses: [],
      },
      smoking_pepe: {
        addresses: [],
      },
      pepe_loves_you: {
        addresses: [],
      },
      excited_pepe: {
        addresses: [],
      },
      magnify_pepe: {
        addresses: [],
      },
      shooting_pepe: {
        addresses: [],
      },
      pepe_mods: {
        addresses: [],
      },
      trippin_pepe: {
        addresses: [],
      },
      skill_issue_pepe: {
        addresses: [],
      },
      ban_pepe: {
        addresses: [],
      },
      nervous_pepe: {
        addresses: [],
      },
      weird_pepe: {
        addresses: [],
      },
      driving_pepe: {
        addresses: [],
      },
      ghostface_pepe: {
        addresses: [],
      },
      flexing_pepe: {
        addresses: [],
      },
      popcorn: {
        addresses: [],
      },
      kekl: {
        addresses: [],
      },
      wojak: {
        addresses: [],
      },
      chad: {
        addresses: [],
      },
      wojak_pepe_hoodie: {
        addresses: [],
      },
      kekwait: {
        addresses: [],
      },
      upforce: {
        addresses: [],
      },
      brimson: {
        addresses: [],
      },
      just_peter: {
        addresses: [],
      },
      disco_cat: {
        addresses: [],
      },
      drinking_peter: {
        addresses: [],
      },
      wojak_and_pepe: {
        addresses: [],
      },
      sunglasses_wojak: {
        addresses: [],
      },
      just_wojak: {
        addresses: [],
      },
      watching_tom: {
        addresses: [],
      },
      trippin_wojak: {
        addresses: [],
      },
      pika: {
        addresses: [],
      },
      niceee: {
        addresses: [],
      },
    },
  },
  sender: null,
})

// Custom hook to access the user data context
export const useChatData = () => useContext(chatDataContext)

// Provider component that wraps your AccountDataRetriever component
export const ChatDataProvider = ({ children }) => {
  const socket = useSocket()
  const userData = useUserData()
  const [messages, setMessages] = useState([])

  // fetch data
  const fetchData = async () => {
    const response = await axios.post(getAllMessagesRoute, {
      sender: userData?._id,
    })
    setMessages(response.data)
  }

  // Fetch messages
  useEffect(() => {
    fetchData()
  }, [])

  // Function to append a new message to the messages state
  const appendMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  // Msg-received useEffect
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('msg-received', (msg) => {
        // Handle received messages here
        appendMessage({
          fromSelf: true,
          _id: msg._id,
          message: msg.message,
          sender: msg.sender,
          emoji_reactions: {},
          updatedAt: msg.updatedAt,
        })
      })
    }
  }, [socket, socket.current])

  // On msg deleted
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('message-deleted', (msg) => {
        // Refetch list
        fetchData()
      })
    }
  }, [socket, socket.current])

  // On emoji added
  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('emoji-reaction-confirmed', (data) => {
        console.log('Received emoji reaction confirmation:', data)

        // Find the message with the given messageId
        const messageToUpdate = messages.find((msg) => msg._id === data.messageId)

        if (messageToUpdate) {
          console.log('Message found for updating:', messageToUpdate)

          // Append the message if it's not already in the state
          if (!messages.some((msg) => msg._id === messageToUpdate._id)) {
            appendMessage(messageToUpdate)
          }

          // Find the emojiType in the emoji_reactions of the message
          const emojiToUpdate = messageToUpdate.emoji_reactions[data.emoji]

          if (emojiToUpdate) {
            console.log('Emoji found for updating:', emojiToUpdate)

            // Add the newAddress to the addresses array of the emoji
            emojiToUpdate.addresses.push(data.newAddress)
            console.log('New address added to emoji:', data.newAddress)

            // Update the state with the modified messages array
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg._id === data.messageId
                  ? { ...msg, emoji_reactions: { ...msg.emoji_reactions, [data.emoji]: emojiToUpdate } }
                  : msg,
              ),
            )
            console.log('Messages state updated with emoji reactions:', messages)
          }
        } else {
          console.log('Message not found for messageId:', data.messageId)
        }
      })
    }
  }, [socket, socket.current, messages])

  return (
    <>
      <chatDataContext.Provider value={{ messages }}>{children}</chatDataContext.Provider>
    </>
  )
}
