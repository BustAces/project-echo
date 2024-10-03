import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { Text } from '@kazama-defi/uikit'
import truncateHash from '@kazama-defi/utils/truncateHash'
import { NextLinkFromReactRouter } from 'components/NextLink'
import ProgressBar from '@ramonak/react-progress-bar'
import { getFollowersList } from 'utils/apiRoutes'

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`

const TableRow = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${(props) => (props.isEven ? 'transparent' : '#1d2126')};
`

const TableCell = styled.div`
  margin-right: 20px;
  font-size: 0.9rem;
  width: ${(props) => props.width || 'auto'};
`

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`

const AccountLink = styled(NextLinkFromReactRouter)`
  color: #fff;
  font-size: 15px;
  font-family: Flama Bold;
`

const TableHeaderRow = styled(TableRow)`
  background-color: #262a31;
  border-radius: 0.25rem 0.25rem 0 0;
`

const TableFooterRow = styled(TableHeaderRow)`
  border-radius: 0 0 0.25rem 0.25rem;
  min-height: 30px;
`

const NonHolderBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  border: 2px solid transparent;
  height: 20px;
  background: rgb(53, 58, 67);
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const ShrimpBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(224, 34, 34), rgb(225, 79, 79));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const CrabBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(135, 135, 136), rgb(174, 174, 175));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const FishBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(58, 107, 103), rgb(105, 165, 160));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const TurtleBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(10, 128, 57), rgb(19, 173, 81));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const DolphinBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(56, 83, 109), rgb(75, 111, 145));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const OrcaBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(27, 27, 27), rgb(29, 29, 29));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const SharkBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(42, 55, 63), rgb(50, 60, 66));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const WhaleBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(56, 106, 190), rgb(91, 128, 190));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

const KrakenBadge = styled.div`
  border-radius: 4px;
  padding: 0 8px;
  height: 20px;
  background-image: linear-gradient(to bottom right, rgb(216, 124, 18), rgb(247, 147, 30));
  box-shadow: none;
  color: #fff;
  margin-left: 8px;
  font-size: 14px;
  font-family: Industry-Black;
  text-align: center;
`

// Badge func
const kazamaRankBadge = (rank) => {
  if (rank === 'non_holder') {
    return <NonHolderBadge>Non Holder</NonHolderBadge>
  } else if (rank === 'shrimp') {
    return <ShrimpBadge>Shrimp</ShrimpBadge>
  } else if (rank === 'crab') {
    return <CrabBadge>Crab</CrabBadge>
  } else if (rank === 'fish') {
    return <FishBadge>Fish</FishBadge>
  } else if (rank === 'turtle') {
    return <TurtleBadge>Turtle</TurtleBadge>
  } else if (rank === 'dolphin') {
    return <DolphinBadge>Dolphin</DolphinBadge>
  } else if (rank === 'orca') {
    return <OrcaBadge>Orca</OrcaBadge>
  } else if (rank === 'shark') {
    return <SharkBadge>Shark</SharkBadge>
  } else if (rank === 'whale') {
    return <WhaleBadge>Whale</WhaleBadge>
  } else if (rank === 'kraken') {
    return <KrakenBadge>Kraken</KrakenBadge>
  }
}

// Date func
const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(weeks / 4)
  const years = Math.floor(months / 12)

  if (seconds < 60) {
    return 'Less than a minute'
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (days < 7) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

// Rank icon return
const rankIcon = (level) => {
  let imagePath
  let rankName

  if (level === 0) {
    return (imagePath = `${process.env.NEXT_PUBLIC_KAZAMA_RANK_IMAGE_PATH}/unranked_.png`)
  }
}

const FollowersList = ({ followersList, profileAddress }) => {
  const [followerData, setFollowerData] = useState([])

  // Retrieve followers data
  const fetchFollowers = async () => {
    await axios.get(`${getFollowersList}/${profileAddress}`).then((response) => {
      setFollowerData(response.data)
    })
  }

  // Execute retrieving
  useEffect(() => {
    fetchFollowers()
  }, [profileAddress])

  return (
    <TableContainer>
      <TableHeaderRow>
        <TableCell width="140px">Username</TableCell>
        <TableCell width="140px">Rank</TableCell>
        <TableCell width="150px">Kazama Rank</TableCell>
        <TableCell width="150px" style={{ textAlign: 'right' }}>
          Date
        </TableCell>
      </TableHeaderRow>
      {followerData.map((follower, index) => {
        // Fetch truncate on address
        const nameDisplay =
          follower.username !== follower.address ? `${follower.username}` : truncateHash(follower.address, 5, 5)

        // Fetch date
        const formattedDate = formatDate(new Date(follower.date_followed))

        // Get true kazama_holder_ranks
        const trueRanks = Object.keys(follower.kazama_holder_ranks).filter((key) => follower.kazama_holder_ranks[key])

        return (
          <TableRow key={index} isEven={index % 2 === 0}>
            <TableCell width="140px">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={follower.avatar_image} />
                <AccountLink to={`/${follower.username}`}>{nameDisplay}</AccountLink>
              </div>
            </TableCell>
            <TableCell width="120px">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div style={{ marginRight: '10px' }}>
                  <img src={rankIcon(follower.rank_level)} width={18} />
                </div>
                <div style={{ flexDirection: 'row', width: '100%' }}>
                  <div>{follower.rank_level}</div>
                  <div>
                    <ProgressBar
                      className="glowing-progress-bar"
                      baseBgColor="white"
                      margin="5px 0px 0px 0px"
                      transitionTimingFunction="ease-in-out"
                      bgColor="red"
                      height="5px"
                      width="100%"
                      borderRadius="2px"
                      isLabelVisible={false}
                      completed={follower.rank_progress}
                      maxCompleted={100}
                    />
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell width="150px">
              {' '}
              {trueRanks.map((rank) => (
                <div key={rank}>{kazamaRankBadge(rank)}</div>
              ))}
            </TableCell>
            <TableCell width="150px" style={{ textAlign: 'right' }}>
              {formattedDate}
            </TableCell>
          </TableRow>
        )
      })}
      <TableFooterRow />
    </TableContainer>
  )
}

export default FollowersList
