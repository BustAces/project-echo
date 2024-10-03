import styled from 'styled-components'

const BetButton = styled.div<{ bettingOpen: boolean }>`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: Industry-Black;
  padding: 0 20px;
  color: #fff;
  cursor: ${({ bettingOpen }) => (bettingOpen ? 'pointer' : null)};
  user-select: none;
  border-radius: 0.25rem;
  opacity: ${({ bettingOpen }) => (bettingOpen ? '1' : '0.5')};
  &:hover {
    opacity: ${({ bettingOpen }) => (bettingOpen ? '0.9' : '0.5')};
  }
`

export const RedBetButton = styled(BetButton)`
  background-color: #de4c41;
  box-shadow: 0 10px 27px #fa010133, inset 0 2px #e5564b, inset 0 -2px #ad362d !important;
`

export const BlackBetButton = styled(BetButton)`
  background-color: #31353d;
  box-shadow: 0 10px 27px #010a1d1f, inset 0 2px #3b3f47, inset 0 -2px #272b33 !important;
`

export const GreenBetButton = styled(BetButton)`
  background-color: #00c74d;
  box-shadow: 0 10px 27px #00ff0c1a, 0 -3px #00913c inset, 0 2px #35d87b inset !important;
`

export const BetButtonSmall = styled.div`
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 0.25rem;
  background-color: #262a31;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ButtonChildren = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const ButtonLeft = styled.div`
  text-align: left;
  font-size: 16px;
  font-family: Industry-Black;
  color: #fff;
`

export const ButtonMiddle = styled.div`
  text-align: center;
  font-size: 16px;
  color: #fff;
`

export const ButtonRight = styled.div`
  text-align: right;
  font-size: 1.2rem;
`
