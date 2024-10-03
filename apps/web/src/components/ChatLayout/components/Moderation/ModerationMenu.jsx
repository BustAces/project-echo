import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {
  Input as UIKitInput,
  Modal,
  Button,
  Text,
  ChevronFilledIcon,
  ButtonMenuItem,
  ButtonMenu,
} from '@kazama-defi/uikit'
import { setSlowMode, deleteMessage } from 'utils/apiRoutes'
import { useWeb3React, useSignMessage } from '@kazama-defi/wagmi'
import { showKazamaToastSuccess } from '../../../KazamaToasts/success'
import { showKazamaToastError } from '../../../KazamaToasts/error'
import { getUserData, getModHistory } from 'utils/apiRoutes'

const StyledModal = styled(Modal)`
  background-image: linear-gradient(to bottom, rgba(33, 37, 43, 0.507), #21252b),
    url('https://wordpress.themeholy.com/bame/wp-content/uploads/2023/12/hero-bg1-1.png');
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-height: 540px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    min-height: 540px;
    border-bottom: 2px solid #11141e;
  }
`

const Row = styled.div`
  padding: 5px 10px 5px 15px;
  background: ${({ isExpanded }) => (isExpanded ? 'linear-gradient(to right, #1e2228, rgb(247, 147, 30))' : '#1e2228')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.089);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ isExpanded }) => (isExpanded ? '0' : '2px')};
  border-radius: ${({ isExpanded }) => (isExpanded ? '0.25rem 0.25rem 0 0' : '0.25rem')};
  position: relative;

  &:hover {
    background-image: linear-gradient(to right, #1c1f25, rgb(247, 147, 30));
  }
`

const ExpandedContent = styled.div`
  padding: 16px;
  background: #1e2228;
  border-radius: ${({ isExpanded }) => (isExpanded ? '0 0 0.25rem 0.25rem' : '0')};
  margin-bottom: 4px;
`

const LabelContainer = styled.div`
  display: flex;
  align-items: flex-start;
`

const LabelText = styled(Text)`
  font-family: Industry-Black;
  font-size: 15px;
  color: #fff;
`

const SmallText = styled(Text)`
  font-size: 13px;
  color: #a6a7aa;
`

const ChevronContainer = styled.div`
  position: absolute;
  right: 10px;
`

const StyledChevronClosed = styled(ChevronFilledIcon)`
  width: 12px;
  margin-left: 5px;
`

const StyledChevronOpen = styled(ChevronFilledIcon)`
  transform: rotate(180deg);
  width: 12px;
  margin-left: 5px;
`

const ActiveText = styled(Text)`
  font-size: 13px;
  color: rgb(16, 217, 96) !important;
`

const DisabledText = styled(Text)`
  font-size: 13px;
  color: rgb(247, 147, 30);
`

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
`

const StatusText = styled.span`
  margin-right: 5px;
`

const ConfirmButton = styled(Button)`
  box-shadow: rgb(9, 100, 45) 0px 0px 15px, rgb(255 255 255 / 20%) 0px 1px 0px inset,
    rgb(0 0 0 / 15%) 0px -3px 0px inset, rgb(15, 155, 71) 0px 0px 12px inset;
  height: 35px;
  border-radius: 0.25rem;
  background: rgb(16, 217, 96);
  color: #1a1e23;
  font-size: 14px;
  font-family: Industry-Black;
  display: flex;
  width: 100%;
`

const Tabs = styled.div`
  width: 100%;
  margin-bottom: 10px;
`

// Set mod sections
const ModSection = {
  CHAT: 0,
  USER: 1,
  HISTORY: 2,
}

// Set tab components
const TabsComponent = ({ view, handleClick }) => {
  return (
    <Tabs>
      <ButtonMenu scale="sm" variant="subtle" onItemClick={handleClick} activeIndex={view} fullWidth>
        <ButtonMenuItem>Chat</ButtonMenuItem>
        <ButtonMenuItem>Users</ButtonMenuItem>
        <ButtonMenuItem>History</ButtonMenuItem>
      </ButtonMenu>
    </Tabs>
  )
}

const ModerationMenu = ({
  socket,
  messageId = null,
  username = null,
  slowMode: { active, seconds },
  initialView = ModSection.CHAT,
}) => {
  const [view, setView] = useState(initialView)
  const { account, isActive } = useWeb3React()
  const { signMessageAsync } = useSignMessage()
  const [expandedRow, setExpandedRow] = useState(null)
  const [accountData, setAccountData] = useState(null)
  const [slowModeDuration, setSlowModeDuration] = useState('')
  const [reason, setReason] = useState('')
  const [modHistory, setModHistory] = useState([])
  const [adminHistory, setAdminHistory] = useState([])

  // Switch tab index
  const handleClick = useCallback((newIndex) => {
    setView(newIndex)
  }, [])

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(getModHistory)
        const { mod_history, admin_history } = response.data
        setModHistory(mod_history)
        setAdminHistory(admin_history)
      } catch (error) {
        console.error('Error fetching history:', error)
      }
    }

    fetchHistory()
  }, [])

  // Fetch selected account data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${getUserData}/${username}`)
      setAccountData(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // Execute retrieving
  useEffect(() => {
    if (username) {
      fetchData()
    }
  }, [username])

  // Toggle expanded state for a specific row
  const handleRowClick = (rowId) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId))
  }

  // Combine and sort histories
  const mergedHistory = [...modHistory, ...adminHistory].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Signature prefixes
  const slowModePrefix = `Kazama DeFi - Set Slow Mode\n\nSign this message with the address below to verify you are the owner:\n`
  const delMessagePrefix = `Kazama DeFi - Delete Message (Id: ${messageId})\n\nSign this message with the address below to verify you are the owner:\n`

  // Signature messages
  const slowModeMessage = slowModePrefix + account
  const delMsgMessage = delMessagePrefix + account

  // Execute slow mode
  const handleSlowMode = async () => {
    if (account) {
      const signature = await signMessageAsync({ message: slowModeMessage })
      try {
        const response = await axios.post(setSlowMode, {
          address: account,
          enabled: true,
          seconds: slowModeDuration,
          signature,
        })

        if (response.status === 200) {
          showKazamaToastSuccess('Successfully activated', 'Success')
          socket.current.emit('slow-mode-updated')
        }
      } catch (error) {
        showKazamaToastError('Slow mode activation failed', error.message)
      }
    }
  }

  // Execute slow mode disable
  const handleDisableSlowMode = async () => {
    if (account) {
      const signature = await signMessageAsync({ message: slowModeMessage })
      try {
        const response = await axios.post(setSlowMode, {
          address: account,
          enabled: false,
          seconds: 0,
          signature,
        })

        if (response.status === 200) {
          showKazamaToastSuccess('Successfully deactivated', 'Deactivated')
          socket.current.emit('slow-mode-updated')
        }
      } catch (error) {
        showKazamaToastError('Slow mode deactivation failed', error.message)
      }
    }
  }

  // Execute slow mode disable
  const handleMsgDelete = async () => {
    if (account) {
      const signature = await signMessageAsync({ message: delMsgMessage })
      try {
        const response = await axios.post(deleteMessage, {
          address: account,
          messageId: messageId,
          reason: reason,
          signature,
        })

        if (response.status === 200) {
          showKazamaToastSuccess('Successfully deleted', `Message with id ${messageId} is deleted`)
          socket.current.emit('message-deleted')
        }
      } catch (error) {
        showKazamaToastError('Failed to delete message', error.message)
      }
    }
  }

  // Set chat tabs
  const chatRows = [
    {
      id: 1,
      label: <LabelText>Slow Mode</LabelText>,
      smallText: (
        <StatusContainer>
          <StatusText>Current status:</StatusText>
          <div style={{ display: 'inline-block' }}>
            {active ? <ActiveText>Active</ActiveText> : <DisabledText>Disabled</DisabledText>}
          </div>
        </StatusContainer>
      ),
      content: (
        <div>
          {active ? (
            <ConfirmButton onClick={handleDisableSlowMode}>Deactivate</ConfirmButton>
          ) : (
            <>
              <UIKitInput
                type="number"
                placeholder="Duration in seconds .."
                value={slowModeDuration}
                onChange={(e) => setSlowModeDuration(e.target.value)}
              />
              <ConfirmButton onClick={handleSlowMode} disabled={!slowModeDuration}>
                Activate Slow Mode
              </ConfirmButton>
            </>
          )}
        </div>
      ),
    },
    {
      id: 2,
      label: <LabelText>Delete Message</LabelText>,
      smallText: (
        <StatusContainer>
          <StatusText>Selected Id:</StatusText>
          <div style={{ display: 'inline-block' }}>
            {messageId ? <ActiveText>{messageId}</ActiveText> : <DisabledText>None</DisabledText>}
          </div>
        </StatusContainer>
      ),
      content: (
        <div>
          <UIKitInput
            type="text"
            placeholder="Reason for deletion .."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <ConfirmButton onClick={handleMsgDelete} disabled={!reason}>
            Delete Message
          </ConfirmButton>
        </div>
      ),
    },
  ]

  // Set user tabs
  const userRows = [
    {
      id: 3,
      label: <LabelText>Mute Account</LabelText>,
      smallText: 'Mute account for a certain time in the chat',
      content: (
        <div>
          <Text mb="8px">{accountData ? accountData.general_data.username : null}</Text>
          <UIKitInput type="number" />
          <Button onClick={handleSlowMode}>Send Tip</Button>
        </div>
      ),
    },
    {
      id: 4,
      label: <LabelText>Ban Account</LabelText>,
      smallText: 'Exclude from all non smart contract components',
      content: (
        <div>
          <Text mb="8px">Row 2 different content</Text>
          <UIKitInput type="text" />
          <Button onClick={handleSlowMode}>Send Text</Button>
        </div>
      ),
    },
    {
      id: 5,
      label: <LabelText>Reset Avatar</LabelText>,
      smallText: 'Reset the accounts avatar to default',
      content: (
        <div>
          <Text mb="8px">Row 3 other content</Text>
          <UIKitInput type="password" />
          <Button onClick={handleSlowMode}>Send Password</Button>
        </div>
      ),
    },
    {
      id: 6,
      label: <LabelText>Reset Username</LabelText>,
      smallText: 'Reset the accounts username to default (address)',
      content: (
        <div>
          <Text mb="8px">Row 3 other content</Text>
          <UIKitInput type="password" />
          <Button onClick={handleSlowMode}>Send Password</Button>
        </div>
      ),
    },
    {
      id: 7,
      label: <LabelText>Deactivate Account</LabelText>,
      smallText: 'Same as ban but can reactivate with kazama tokens',
      content: (
        <div>
          <Text mb="8px">Row 3 other content</Text>
          <UIKitInput type="password" />
          <Button onClick={handleSlowMode}>Send Password</Button>
        </div>
      ),
    },
  ]

  return (
    <StyledModal title={`Moderation Menu`}>
      {(view === ModSection.CHAT || view === ModSection.USER || view === ModSection.HISTORY) && (
        <TabsComponent view={view} handleClick={handleClick} />
      )}
      {view === ModSection.HISTORY ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>ACTION</th>
                <th>REASON</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {mergedHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.admin || entry.mod}</td>
                  <td>{entry.action}</td>
                  <td>{entry.reason}</td>
                  <td>{new Date(entry.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {view === ModSection.CHAT
            ? chatRows.map((row, index) => (
                <div key={row.id}>
                  <Row isExpanded={expandedRow === row.id} onClick={() => handleRowClick(row.id)}>
                    <LabelContainer>
                      <div>
                        <LabelText>{row.label}</LabelText>
                        <SmallText>{row.smallText}</SmallText>
                      </div>
                    </LabelContainer>
                    <ChevronContainer>
                      {expandedRow === row.id ? <StyledChevronOpen /> : <StyledChevronClosed />}
                    </ChevronContainer>
                  </Row>
                  {expandedRow === row.id && <ExpandedContent isExpanded={true}>{row.content}</ExpandedContent>}
                </div>
              ))
            : userRows.map((row, index) => (
                <div key={row.id}>
                  <Row isExpanded={expandedRow === row.id} onClick={() => handleRowClick(row.id)}>
                    <LabelContainer>
                      <div>
                        <LabelText>{row.label}</LabelText>
                        <SmallText>{row.smallText}</SmallText>
                      </div>
                    </LabelContainer>
                    <ChevronContainer>
                      {expandedRow === row.id ? <StyledChevronOpen /> : <StyledChevronClosed />}
                    </ChevronContainer>
                  </Row>
                  {expandedRow === row.id && <ExpandedContent isExpanded={true}>{row.content}</ExpandedContent>}
                </div>
              ))}
        </>
      )}
    </StyledModal>
  )
}

export default ModerationMenu
