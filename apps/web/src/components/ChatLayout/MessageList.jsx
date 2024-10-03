/* eslint-disable */
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  kazamaBaseColors,
  Flex,
  Text,
  TipUserIcon,
  useModal,
  HeartLikeIcon,
  HeartLikeFilledIcon,
  ExpandDotsIcon,
  ReplyIcon,
  Image,
  CoinStackIcon,
  AddIcon,
  useToast,
} from '@kazama-defi/uikit'
import styled from 'styled-components'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { PieChart, Pie } from 'recharts'
import { useWeb3React } from '@kazama-defi/wagmi'
import Linkify from 'linkify-react'
import 'linkify-plugin-mention'
import 'linkify-plugin-hashtag'
import TipUser from 'views/Profile/components/Tipping'
import OptionsModal from './components/OptionsModal'
import { useUserData } from 'api/DataRetriever'
import { useRainData } from 'api/RainDataRetriever'
import { useSocket } from 'api/SocketManager'
import { usePlatformData } from 'api/PlatformDataRetriever'
import RankingStyle from './styling/Ranks'
import RainBox from './components/Rain/RainBox'
import EmojiList from './components/Emoji/list'
import ModerationMenu from './components/Moderation/ModerationMenu'
import EmojiPicker, { Categories } from 'kazama-emoji-component'
import { addEmojiReaction } from 'utils/apiRoutes'
import { showKazamaToastError } from 'components/KazamaToasts/error'

const AvatarWrapper = styled.div`
  width: 46px;
  height: 46px;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: -48px;
  margin-top: 2px;
  padding: 3px;
  overflow: hidden;
`

const RankIconWrapper = styled.div`
  background: #262a31;
  border: 2px solid #1d2126;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  margin-top: -15px;
  text-align: center;
  z-index: 100;
  margin-left: 3px;
`

const ChatLink = styled(NextLinkFromReactRouter)`
  color: #fff;
  font-size: 14px;
  font-family: Flama Bold;
  &:hover {
    text-decoration: underline;
  }
`

const ChatDiv = styled.div`
@media screen and (max-width: 60px) {
  display: none !important;
`

const AccountDiv = styled.div`
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
  column-gap: 6.00858px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-flex;
  vertical-align: middle;
  margin-right: 5px;
  max-width: 100%;
`

const MessageContent = styled.div`
  position: relative;
  margin-top: 7px;
  margin-left: 5px;
  margin-right: 7px;
  padding-left: 10px;
  background: ${kazamaBaseColors.kazamaChatMessages};
  border-radius: 0.25rem;
  width: 100%;
  max-width: 269px;
  clip-path: polygon(
    10px 0%,
    calc(100% - 10px) 0%,
    100% 10px,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    10px 100%,
    0% calc(100% - 10px),
    0% 10px
  );

  .message-header {
    display: block;
    align-items: center;
    padding: 10px 5px 10px;
  }

  .message-content {
    display: flex;
    padding: 0 8px 5px 3px;
    width: 100%;
    line-height: 1.375rem;

    .smaller-text {
      font-size: 11px;
      font-weight: 400;
      padding-top: 4px;
      color: #a6a7aa;
    }

    .normal-text {
      color: #a6a7aa;
      word-wrap: break-word;
      overflow-wrap: break-word;
      overflow: hidden;
      font-size: 0.9rem;
      font-family: Bai Jamjuree, sans-serif;
      line-height: 1.375rem;
    }
  }

  .spacenaut-badge {
    border-radius: 4px;
    padding: 0 8px;
    border: 2px solid transparent;
    height: 16px;
    background: #534cd1;
    box-shadow: none;
    color: #fff;
    margin-left: 8px;
    font-size: 11px;
    letter-spacing: 1px;
  }
`

const ReactionsBox = styled.div`
  margin-top: 2px;
  margin-left: 64px;
  margin-right: 7px;
  border-radius: 0.25rem;
  width: 100%;
  max-width: 269px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`

const EmojiReactionBox = styled.div`
  background: #262a31;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 0.25rem;
  margin: 1px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledDotsIcon = styled(ExpandDotsIcon)`
  fill: #a6a7aa;
  width: 17px;

  &:hover {
    fill: #fff;
    cursor: pointer;
  }
`

const StyledCoinStack = styled(CoinStackIcon)`
  fill: #a6a7aa;
  width: 17px;

  &:hover {
    fill: #fff;
    cursor: pointer;
  }
`

const StyledReactionIcon = styled(AddIcon)`
  fill: #a6a7aa;
  width: 17px;

  &:hover {
    fill: #fff;
    cursor: pointer;
  }
`

const KazamaAdminBadge = styled.div`
  background: #ee5519;
  border-radius: 0.25rem;
  width: fit-content;
  font-family: Industry-Black;
  font-size: 11px;
  color: #1a1e23;
  padding: 3px;
`

const KazamaModBadge = styled.div`
  background: rgb(25, 197, 255);
  border-radius: 0.25rem;
  width: fit-content;
  font-family: Industry-Black;
  font-size: 11px;
  color: #1a1e23;
  padding: 3px;
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  left: -167px;
  top: 0;
`

const MessageList = ({ scrollRef, messages }) => {
  const { account } = useWeb3React()
  const [connectedUser, setConnectedUser] = useState('')
  const [receiverUsername, setReceiverUsername] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [optionsAccount, setOptionsAccount] = useState(null)
  const [selectedMessageId, setSelectedMessageId] = useState(null)
  const [dismiss, setDismiss] = useState(false)
  const userData = useUserData()
  const platformData = usePlatformData()
  const rainData = useRainData()
  const socket = useSocket()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef(null)
  const [tipModal] = useModal(receiverUsername ? <TipUser receiverUsername={receiverUsername} socket={socket} /> : null)
  const [optionsModal] = useModal(optionsAccount ? <OptionsModal username={optionsAccount} /> : null)
  const [modModal] = useModal(
    selectedAccount ? (
      <ModerationMenu
        socket={socket}
        username={selectedAccount}
        messageId={selectedMessageId}
        slowMode={platformData.settings.chat_settings.slow_mode}
      />
    ) : null,
  )

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

  // Outside clicks handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  // link render component
  const renderLink = ({ attributes, content }) => {
    const { href, ...props } = attributes
    return (
      <ChatLink to={href} {...props}>
        {content}
      </ChatLink>
    )
  }

  // Render options
  const urlRenderOptions = {
    render: {
      url: renderLink,
      mention: renderLink,
      hashtag: renderLink,
    },
  }

  useEffect(() => {
    if (userData && userData.general_data) {
      setConnectedUser(userData.general_data.username)
    }
  }, [account])

  // Handle tips
  const handleTipClick = (username) => {
    setReceiverUsername(username)
  }

  // Handle mod menu
  const handleModMenu = (username, messageId) => {
    setSelectedAccount(username)
    setSelectedMessageId(messageId)
  }

  // Handle options box
  const handleAccountOptions = (username) => {
    setOptionsAccount(username)
  }

  // Handle receiving username
  useEffect(() => {
    if (receiverUsername) {
      tipModal()
      // Toggle the dismiss state
      setDismiss((prevDismiss) => !prevDismiss)
    }
  }, [receiverUsername])

  // Handle selected account
  useEffect(() => {
    if (selectedAccount) {
      modModal()
      // Toggle the dismiss state
      setDismiss((prevDismiss) => !prevDismiss)
    }
  }, [selectedAccount])

  // Handle options box
  useEffect(() => {
    if (optionsAccount) {
      optionsModal()
      // Toggle the dismiss state
      setDismiss((prevDismiss) => !prevDismiss)
    }
  }, [optionsAccount])

  useEffect(() => {
    setReceiverUsername(null)
    setSelectedAccount(null)
    setOptionsAccount(null)
  }, [dismiss])

  // Function to get image URL by emoji ID
  const getEmojiUrlById = (id) => {
    const emoji = EmojiList.find((emoji) => emoji.id === id)
    return emoji ? emoji.imgUrl : null
  }

  // Handle emoji reaction
  const handleEmojiReaction = async (messageId, emojiType, userAddress) => {
    try {
      const payload = { messageId, emojiType, userAddress }
      console.log('Sending payload:', payload)
      const response = await axios.post(addEmojiReaction, payload)
      console.log('Server response:', response)
      socket.current.emit('emoji-reaction-added', messageId, emojiType, account)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 400) {
        showKazamaToastError('Bad Request', 'Please check the input values.')
      } else {
        showKazamaToastError('Error adding emoji reaction', error.message)
      }
    }
  }

  // Emoji handler
  const handleEmojiClick = (messageId) => (e) => {
    // Remove the `:` prefix and suffix from the emoji ID
    const emojiId = e.emoji.replace(/:/g, '')
    setShowEmojiPicker(false)
    handleEmojiReaction(messageId, emojiId, account)
  }

  // Emojii handler for existing emojis
  const handleExistingEmoji = (messageId, emojiId) => {
    handleEmojiReaction(messageId, emojiId, account)
  }

  // Set default level bg
  let levelBackground = '#353a43'

  // Function to render emoji reactions
  const renderEmojiReactions = (message) => {
    if (!message.emoji_reactions) {
      return null
    }

    return EmojiList.map((emoji) => {
      // Remove the `:` prefix and suffix from the emoji ID
      const emojiId = emoji.id.replace(/:/g, '')
      // Get the number of addresses for the current emoji
      const addressesLength = message.emoji_reactions[emojiId] ? message.emoji_reactions[emojiId].addresses.length : 0
      // Check if the account is present in the addresses array
      const isAccountPresent = message.emoji_reactions[emojiId]?.addresses.includes(account)

      // Only render the emoji if there are one or more addresses
      if (addressesLength > 0) {
        return (
          <EmojiReactionBox
            key={emojiId}
            onClick={!isAccountPresent ? () => handleExistingEmoji(message._id, emojiId) : null}
            style={{ cursor: !isAccountPresent ? 'pointer' : 'default' }}
          >
            <img src={emoji.imgUrl} alt={emojiId} width={18} style={{ marginRight: '5px' }} />
            <span>{addressesLength}</span>
          </EmojiReactionBox>
        )
      }
      return null
    })
  }

  // Return list
  return (
    <>
      <div>{rainData.rain_active ? <RainBox key={rainData.rain_id} rainData={rainData} socket={socket} /> : null}</div>
      <div className="chat-messages" onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
        {messages.map((message) => {
          const sender = message.sender
          const rankStyle = RankingStyle(sender?.rank_data.level)

          const RankProgress = [
            { name: 'Progress', value: sender?.rank_data.rank_progress },
            { name: 'Completed', value: 23, fill: rankStyle.background },
          ]

          // Chat message return
          const ReturnMessage = () => {
            // Check for @everyone tag
            if (message.message.includes('@Everyone')) {
              // Check if sender is admin or mod
              if (sender?.role === 'admin' || sender?.role === 'mod') {
                return (
                  <div
                    className="message-content"
                    style={{
                      background: '#2c3551',
                      marginLeft: '-10px',
                      marginBottom: '5px',
                      paddingLeft: '10px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                    }}
                  >
                    <p className="normal-text">{message.message}</p>
                  </div>
                )
                // If not admin or mod, return message
              } else {
                return null
              }
            }

            // Check for tagged user
            if (message.message.includes(`@${connectedUser}`)) {
              return (
                <div
                  className="message-content"
                  style={{
                    background: 'red !important',
                    marginLeft: '-10px',
                    marginBottom: '5px',
                    paddingLeft: '10px',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  }}
                >
                  <p className="normal-text">
                    <Linkify options={urlRenderOptions}>{message.message}</Linkify>
                  </p>
                </div>
              )
            }

            // Check for GIF
            if (message.message.startsWith('http') && message.message.endsWith('.gif')) {
              return (
                <div className="message-content gif-preview" style={{ overflow: 'hidden' }}>
                  <img
                    style={{
                      borderRadius: '3px',
                      width: '100%',
                      overflow: 'hidden',
                      clipPath:
                        'polygon(0% 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px))',
                    }}
                    src={message.message}
                  />
                </div>
              )
            }

            // Check for emojis in the message
            const messageWithEmojis = message.message.split(' ').map((word, index) => {
              if (word.startsWith(':') && word.endsWith(':')) {
                const emojiUrl = getEmojiUrlById(word)
                if (emojiUrl) {
                  return (
                    <img
                      key={index}
                      src={emojiUrl}
                      width={24}
                      alt={word}
                      style={{ verticalAlign: 'middle', marginRight: '4px', width: '10px !important' }}
                    />
                  )
                }
              }
              return word + ' '
            })

            // Normal message
            return (
              <>
                <div className="message-content" style={{ display: 'flex', alignItems: 'center' }}>
                  {message.message.endsWith('.gif') && message.message.startsWith('https://') ? (
                    <p className="normal-text">{message.message}</p>
                  ) : (
                    <p className="normal-text">
                      <Linkify options={urlRenderOptions}>{messageWithEmojis}</Linkify>
                    </p>
                  )}
                </div>
              </>
            )
          }

          return (
            <ChatDiv key={message.id} ref={scrollRef}>
              <Flex flexDirection="row">
                <Flex ml="7px" mr="5px" mt="9px" alignItems="center">
                  <Flex flexDirection="column">
                    <Flex>
                      <PieChart width={49} height={49}>
                        <Pie
                          dataKey="value"
                          data={RankProgress}
                          cx={19}
                          stroke="transparent"
                          startAngle={-55}
                          endAngle={310}
                          cy={20}
                          innerRadius={21}
                          outerRadius={24}
                          fill={rankStyle.progressColor}
                        />
                      </PieChart>
                      <AvatarWrapper>
                        <img
                          style={{ borderRadius: '50%', padding: '1px', width: '100%' }}
                          src={sender?.general_data.avatar_image}
                        />
                      </AvatarWrapper>
                    </Flex>
                    <Flex justifyContent="center" alignItems="center">
                      <RankIconWrapper>
                        <img src={rankStyle.imagePath} width={rankStyle.rankWidth} />
                      </RankIconWrapper>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex width="100%">
                  <MessageContent>
                    <div className="message-header">
                      <Flex flexDirection="row">
                        <AccountDiv>
                          <Flex>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <NextLinkFromReactRouter to={`/${sender.general_data.username}`}>
                                {sender.general_data.role === 'admin' ? (
                                  <p
                                    style={{
                                      fontSize: '15px',
                                      color: '#EE5519',
                                      fontFamily: 'Industry-Black',
                                    }}
                                  >
                                    {sender?.general_data.username.length > 20
                                      ? truncateHash(sender?.general_data.username)
                                      : sender?.general_data.username}
                                  </p>
                                ) : sender.general_data.role === 'mod' ? (
                                  <p
                                    style={{
                                      fontSize: '15px',
                                      color: 'rgb(25, 197, 255)',
                                      fontFamily: 'Industry-Black',
                                    }}
                                  >
                                    {sender?.general_data.username.length > 20
                                      ? truncateHash(sender?.general_data.username)
                                      : sender?.general_data.username}
                                  </p>
                                ) : sender.general_data.role === 'user' ? (
                                  <p
                                    style={{
                                      fontSize: '15px',
                                      color: '#fff',
                                      fontFamily: 'Industry-Black',
                                    }}
                                  >
                                    {sender?.general_data.username.length > 20
                                      ? truncateHash(sender?.general_data.username)
                                      : sender?.general_data.username}
                                  </p>
                                ) : null}
                              </NextLinkFromReactRouter>
                              {sender.general_data.role === 'admin' ? (
                                <div style={{ marginLeft: '5px' }}>
                                  <KazamaAdminBadge>Admin</KazamaAdminBadge>
                                </div>
                              ) : sender.general_data.role === 'mod' ? (
                                <div style={{ marginLeft: '5px' }}>
                                  <KazamaModBadge>Mod</KazamaModBadge>
                                </div>
                              ) : null}
                            </div>
                          </Flex>
                          <Flex>
                            {/* Badge rendering logic */}
                            {/* {sender?.kazama_holder_ranks.spacenaut && (<> <p className="spacenaut-badge">👨‍🚀 SPACENAUT</p> </> )} */}
                          </Flex>
                        </AccountDiv>
                        <Flex ml="auto" mr="5px" pb="5px">
                          <StyledCoinStack onClick={() => handleTipClick(sender?.general_data.username)} />
                          {/* <StyledReactionIcon
                            ml="5px"
                            onClick={() => {
                              setShowEmojiPicker((prev) => !prev)
                            }}
                          /> */}
                          {/* <StyledDotsIcon
                            ml="5px"
                            onClick={() => handleModMenu(sender?.general_data.username, message._id)}
                          /> */}
                          <StyledDotsIcon
                            ml="5px"
                            onClick={() => handleAccountOptions(sender?.general_data.username)}
                          />
                        </Flex>
                      </Flex>
                    </div>
                    <div flexDirection="column">
                      <div className="message-content">{ReturnMessage()}</div>
                      <div>
                        {showEmojiPicker && (
                          <EmojiPickerContainer ref={emojiPickerRef}>
                            <EmojiPicker
                              onEmojiClick={handleEmojiClick(message._id)}
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
                      </div>
                    </div>
                  </MessageContent>
                </Flex>
              </Flex>
              <ReactionsBox>{renderEmojiReactions(message)}</ReactionsBox>
            </ChatDiv>
          )
        })}
      </div>
    </>
  )
}

export default MessageList
