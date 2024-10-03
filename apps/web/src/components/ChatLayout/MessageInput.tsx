import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  kazamaBaseColors,
  Button,
  Flex,
  EmojiIcon,
  EmojiGlassesIcon,
  GifIcon,
  TimerIcon,
  CogIcon,
  useModal,
  ArrowFirstIcon,
} from '@kazama-defi/uikit'
import EmojiPicker, { Categories } from 'kazama-emoji-component'
import GifPicker, { TenorImage } from 'gif-picker-react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectToChat from 'components/ConnectToChat'
import Taglist from './Taglist'
import { usePlatformData } from 'api/PlatformDataRetriever'
import EmojiList from './components/Emoji/list'
import { useUserData } from 'api/DataRetriever'
import ModerationMenu from './components/Moderation/ModerationMenu'

const EmojiPickerIcon = styled(EmojiIcon)`
  fill: #a6a7aa !important;
  :hover {
    cursor: pointer;
    fill: rgba(255, 255, 255, 0.884) !important;
  }
`

const SendButton = styled(Button)<{ isInputActive: boolean }>`
  box-shadow: rgb(245 139 19 / 40%) 0px 0px 15px, rgb(255 255 255 / 20%) 0px 1px 0px inset,
    rgb(0 0 0 / 15%) 0px -3px 0px inset, rgb(245, 139, 19) 0px 0px 12px inset;
  height: 35px;
  border-radius: 0.25rem;
  background: rgb(247, 147, 30);
  color: #1a1e23;
  font-size: 13px;
  margin-left: 5px;
  font-family: Industry-Black;
  display: ${({ isInputActive }) => (isInputActive ? 'flex' : 'none')};
`

const ChatControls = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-top: 0.3rem;
  justify-content: space-between;
  align-items: center;
`

const LeftControls = styled.div`
  display: flex;
  align-items: center;

  > div {
    margin-right: 5px;
  }
`

const RightControl = styled.div`
  margin-left: auto;
  border-radius: 0.25rem;
`

const GifPickerIcon = styled(GifIcon)`
  fill: #a6a7aa !important;
  width: 20px;
  :hover {
    cursor: pointer;
    fill: rgba(255, 255, 255, 0.884) !important;
  }
`

const Container = styled.div<{ isInputActive: boolean }>`
  padding: 8px;
  background-color: ${kazamaBaseColors.kazamaPanels};
  z-index: 5;
  margin-bottom: 12px;
  width: ${({ isInputActive }) => (isInputActive ? `100%` : 'auto')};

.input-container {
  display: flex;
  align-items: center;
  font-size: 13px;
  
  input {
    flex-grow: 2;
    -webkit-box-align: center;
    align-items: center;
    min-height: 37px;
    width: 100%;
    padding: 6px 5px 6px 15px;
    border-radius: 0.25rem 0px 0px 0.25rem;
    border: 0px solid transparent;
    background: #1a1e23;
    position: relative;
    height: auto;
    color: #fff;
    font-family: Industry-Black;
    font-size: 13px;

    input:focus {
      outline: none; /* Remove the default outline */
      border-color: #007BFF; /* Change border color on focus */
      background-color: #282c34; /* Change background color on focus */
    }
  }

  .chars-container {
    flex-grow: 1;
    display: flex;
    width: 50px;
    justify-content: flex-end;
    border-radius: 0px 0.25rem 0.25rem 0px;
    padding-right: 10px;
    background-color: #1a1e23;
    min-height: 37px;
    justify-content: center; /* Horizontal alignment */
    align-items: center;  

    svg {
      width: 20px;
      height: 20px;
    }
  }
 }
}
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  left: -167px;
  top: 0;
`

const GifPickerContainer = styled.div`
  position: absolute;
  left: -320px;
  top: 0;
`

const RemainingChars = styled.div<{ isOverLimit: boolean }>`
  color: ${({ isOverLimit }) => (isOverLimit ? '#e74c3c' : '#fff')};
  font-family: Industry-Black;
  font-size: 13px;
`

const SlowModeBox = styled.div`
  font-size: 11px;
  font-family: Industry-Black;
  border-radius: 0.25rem;
  background: rgb(247, 147, 30);
  width: fit-content;
  color: #1a1e23;
  padding: 3px;
  height: 28px;
  display: flex;
  align-items: center;
`

const InputOverlay = styled.div`
  background: rgba(29, 33, 38, 0.904);
  position: absolute;
  width: calc(100%);
  height: auto;
  font-family: Industry-Black;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 15px;
  z-index: 1000;
  user-select: none;
`

const ChatTimer = styled(TimerIcon)`
  fill: #fff !important;
`

const KazamaChatInput = styled.input`
  &::placeholder {
    color: #a6a7aa;
  }
`

export default function MessageInput({ handleSendMsg }): JSX.Element {
  const { account } = useActiveWeb3React()
  const userData = useUserData()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [showModMenu, setShowModMenu] = useState(false)
  const [isInputActive, setInputActive] = useState(false)
  const [atSymbol, setAtSymbol] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState('')
  const [taglistInput, setTaglistInput] = useState('')
  const [isTaglistOpen, setIsTaglistOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const inputRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const gifPickerRef = useRef(null)
  const modMenuRef = useRef(null)
  const platformData = usePlatformData()
  const [remainingChars, setRemainingChars] = useState(300)
  const [isOverLimit, setIsOverLimit] = useState(false)
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  const [isMod, setIsMod] = useState(false)
  const TENOR_API_KEY = 'AIzaSyCdRm-UH7PVl6V0NnQwz1b-TmIjw9I6vpI'
  const [modModal] = useModal(<ModerationMenu />)

  // Check user is admin or mod
  useEffect(() => {
    const checkMod = () => {
      // Check admin
      if (userData.general_data.role === 'admin') {
        setIsMod(true)
      }
      // Check mod
      if (userData.general_data.role === 'mod') {
        setIsMod(true)
      }
    }
    checkMod()
  }, [account, userData])

  // Check if slowmode is active and if user has still waiting time
  useEffect(() => {
    const checkSlowmodeData = () => {
      if (platformData.settings.chat_settings.slow_mode) {
        const currentTime = new Date()
        const lastMessageTime = userData.chat_data.last_message ? new Date(userData.chat_data.last_message) : null
        const slowModeSeconds = platformData.settings.chat_settings.slow_mode.seconds
        if (lastMessageTime) {
          const diff = Math.ceil((lastMessageTime.getTime() + slowModeSeconds * 1000 - currentTime.getTime()) / 1000)
          if (diff > 0) {
            setCountdown(diff)
            setShowOverlay(true)
          }
        }
      }
    }

    checkSlowmodeData()
  }, [platformData, userData.chat_data.last_message])

  // Slowmode overlay
  useEffect(() => {
    if (platformData.settings.chat_settings.slow_mode.active && lastMessageTime instanceof Date) {
      const currentTime = new Date()
      const slowModeSeconds = platformData.settings.chat_settings.slow_mode.seconds
      const diff = Math.ceil((lastMessageTime.getTime() + slowModeSeconds * 1000 - currentTime.getTime()) / 1000)
      if (diff > 0) {
        setCountdown(diff)
        setShowOverlay(true)
      }
    }
  }, [lastMessageTime, platformData])

  // Countdown
  useEffect(() => {
    if (countdown !== null) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown && prevCountdown > 1) {
            return prevCountdown - 1
          } else {
            clearInterval(timer)
            setShowOverlay(false)
            return null
          }
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [countdown])

  // Categories
  const categoryList = [
    {
      category: Categories.DEFAULT,
      name: 'Default',
    },
    {
      category: Categories.PEPE,
      name: 'Pepe',
    },
    {
      category: Categories.TEXT,
      name: 'Text',
    },
    {
      category: Categories.KEK,
      name: 'Keks',
    },
    {
      category: Categories.WOJAK,
      name: 'Wojak',
    },
    {
      category: Categories.FAMILY_GUY,
      name: 'Family Guy',
    },
    {
      category: Categories.CURRENCIES,
      name: 'Currencies',
    },
    {
      category: Categories.OTHER,
      name: 'Other',
    },
  ]

  // Input toggle
  const toggleInputActive = () => {
    setInputActive(true)
  }

  // Handle hide/show for emoji
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  // Exec gif picker
  const handleGifPicker = () => {
    setShowGifPicker(!showGifPicker)
  }

  // Mod menu handler
  const handleModMenu = () => {
    setShowModMenu(!showModMenu)
  }

  // Emoji handler
  const handleEmojiClick = (e, emoji) => {
    let message = msg
    message += e.emoji + ' '
    setRemainingChars(300 - message.length)
    setMsg(message)
    setShowEmojiPicker(false)
  }

  // GIF handler
  const handleGifClick = (e) => {
    handleSendMsg(e.url)
    setShowGifPicker(!showGifPicker)
    setLastMessageTime(new Date())
  }

  // Outside clicks handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
      if (showGifPicker && gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
        setShowGifPicker(false)
      }
      if (showModMenu && modMenuRef.current && !modMenuRef.current.contains(event.target)) {
        setShowModMenu(false)
      }
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setInputActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker, showGifPicker, showModMenu])

  // Function to handle "@" symbol detection
  const handleInputChange = (e) => {
    if (!showOverlay) {
      const text = e.target.value
      setMsg(text)
      setRemainingChars(300 - text.length)
      if (remainingChars < 0) {
        setIsOverLimit(true)
      } else {
        setIsOverLimit(false)
      }
      if (text.endsWith('@')) {
        setAtSymbol(true)
      } else {
        setAtSymbol(false)
        // Extract text after "@" symbol and set it to taglistInput
        const atIndex = text.lastIndexOf('@')
        if (atIndex !== -1) {
          setTaglistInput(text.slice(atIndex + 1))
        } else {
          setTaglistInput('')
        }
      }
    }
  }

  // Function to handle username selection from the taglist
  const handleUsernameSelection = (username) => {
    setSelectedUsername(username)
    setMsg(msg + `${username} `) // Append the selected username to the message
    setInputActive(true) // Keep the input active
  }

  // Send msg
  const sendChat = (e) => {
    e.preventDefault()
    if (showEmojiPicker) setShowEmojiPicker(!showEmojiPicker)
    if (showGifPicker) setShowGifPicker(!showGifPicker)
    if (msg.length > 0) {
      handleSendMsg(msg)
      setMsg('')
      setLastMessageTime(new Date())
    }
  }

  // Return input
  const ShowInput = () => {
    if (!account) {
      return <ConnectToChat width="100%" />
    }

    // Function to format seconds into HH:MM:SS
    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)

      const pad = (num) => {
        return num.toString().padStart(2, '0')
      }

      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    }

    // ModModal handler
    const handleModMenuModal = () => {
      modModal()
    }

    return (
      <Container isInputActive={isInputActive}>
        {showEmojiPicker && (
          <EmojiPickerContainer ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              categories={categoryList}
              customEmojis={EmojiList}
              skinTonesDisabled={true}
              previewConfig={{
                defaultEmoji: ':pepe:',
                defaultCaption: 'Pepe',
                showPreview: true,
              }}
              width="300px"
              height="auto"
            />
          </EmojiPickerContainer>
        )}
        {showGifPicker && (
          <GifPickerContainer ref={gifPickerRef}>
            <GifPicker onGifClick={handleGifClick} tenorApiKey={TENOR_API_KEY} width="300px" height="747px" />
          </GifPickerContainer>
        )}
        <form className="input-container" ref={inputRef} onSubmit={(e) => sendChat(e)}>
          <div
            style={{
              borderRadius: '0.25rem',
              border: '1px solid rgba(0, 0, 0, 0.158)',
              display: 'flex',
              flexGrow: '2',
              transition: 'all .3s ease-in-out;',
            }}
          >
            {showOverlay && (
              <InputOverlay>
                <ChatTimer mr="5px" /> {formatTime(countdown)}
              </InputOverlay>
            )}
            <KazamaChatInput
              onClick={toggleInputActive}
              type="text"
              placeholder="Say something .."
              value={msg}
              onChange={handleInputChange}
            />
            <div className="chars-container">
              <Flex>
                <RemainingChars isOverLimit={isOverLimit}>{remainingChars}</RemainingChars>
              </Flex>
            </div>
          </div>
          <SendButton type="submit" scale="sm" isInputActive={isInputActive}>
            Send
          </SendButton>
        </form>
        <ChatControls>
          <LeftControls>
            <Flex
              style={{ background: '#24282e', padding: '4px', borderRadius: '0.25rem', cursor: 'pointer' }}
              onClick={handleEmojiPickerHideShow}
            >
              <EmojiPickerIcon width={20} onClick={handleEmojiPickerHideShow} />
            </Flex>
            <Flex
              style={{ background: '#24282e', padding: '4px', borderRadius: '0.25rem', cursor: 'pointer' }}
              onClick={handleGifPicker}
            >
              <GifPickerIcon width={26} onClick={handleGifPicker} />
            </Flex>
            {/* {isMod ? (
              <Flex
                style={{ background: '#24282e', padding: '4px', borderRadius: '0.25rem', cursor: 'pointer' }}
                onClick={modModal}
              >
                <CogIcon width={20} onClick={modModal} />
              </Flex>
            ) : null} */}
          </LeftControls>
          <RightControl>
            {platformData.settings.chat_settings.slow_mode.active ? (
              <SlowModeBox>{platformData.settings.chat_settings.slow_mode.seconds}</SlowModeBox>
            ) : null}
          </RightControl>
        </ChatControls>
      </Container>
    )
  }

  return (
    <div>
      {atSymbol && (
        <Taglist
          selectedUsername={selectedUsername}
          handleUsernameSelection={handleUsernameSelection}
          taglistInput={taglistInput}
        />
      )}
      {ShowInput()}
    </div>
  )
}
