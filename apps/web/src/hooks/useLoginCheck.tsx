import { useEffect } from 'react'
import { useModal } from '@kazama-defi/uikit'
import { useUserData } from 'api/DataRetriever'
import ActivateSession from 'views/Profile/components/Login/sessionModal'

const CheckLogin = () => {
  const [onPresentSessionModal] = useModal(<ActivateSession />)
  const userData = useUserData()

  // Check if has_password = true
  useEffect(() => {
    if (userData && userData.general_data && userData.session_data) {
      if (userData.general_data.has_password && !userData.session_data.active) {
        onPresentSessionModal()
      }
    }
  }, [userData, onPresentSessionModal])

  return null
}

export default CheckLogin
