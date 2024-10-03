import styled, { keyframes } from 'styled-components'

// Define the shrink animation
const shrinkWidth = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
`

export const RollTimerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 5px;
  background-color: #18191d;
  overflow: hidden;
  clip-path: polygon(
    10px 0%,
    /* Top-left corner */ 99.5% 0%,
    /* Top-right corner, shortened */ 99.5% 10px,
    /* Right top edge */ 99.5% calc(100% - 10px),
    /* Right bottom edge */ calc(99.5% - 10px) 100%,
    /* Bottom-right corner, shortened */ 10px 99.5%,
    /* Bottom-left corner */ 0.5% calc(99.5% - 10px),
    /* Left bottom edge */ 0.5% 0px /* Left top edge */
  );
`

export const RollTimerBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 199, 77, 255);
  animation: ${shrinkWidth} 18s linear forwards, changeColor 18s linear forwards;

  @keyframes changeColor {
    0% {
      background-color: rgba(0, 199, 77, 255);
    }
    55% {
      background-color: rgba(0, 199, 77, 255);
    }
    57% {
      background-color: rgba(245, 187, 33, 255);
    }
    76% {
      background-color: rgba(245, 187, 33, 255);
    }
    78% {
      background-color: rgba(222, 76, 65, 255);
    }
    100% {
      background-color: rgba(222, 76, 65, 255);
    }
  }
`
