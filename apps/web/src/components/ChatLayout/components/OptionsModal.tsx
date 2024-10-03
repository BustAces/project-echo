import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { Modal } from '@kazama-defi/uikit'
import { useAccount } from 'wagmi'
import { useSignMessage, useWeb3React } from '@kazama-defi/wagmi'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 425px;
    max-width: 425px;
    background: #21252b;
    border-bottom: 2px solid #11141e;
  }
`

// Set props
interface OptionsModalProps {
  onDismiss?: () => void
  onDone?: () => void
  username: string
}

const OptionsModal: React.FC<OptionsModalProps> = ({ onDismiss, onDone, username }) => {
  // Set consts
  const { signMessageAsync } = useSignMessage()
  const { address: account } = useAccount()
  const [balance, setBalance] = useState(0)

  // Return modal
  return (
    <StyledModal title={`${username.length > 20 ? truncateHash(username) : username}`} onDismiss={onDismiss}>
      {balance}
    </StyledModal>
  )
}

export default OptionsModal
