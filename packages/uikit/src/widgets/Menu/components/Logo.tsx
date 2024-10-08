import React, { useContext } from 'react';
import { isMobile } from 'react-device-detect';
import styled, { keyframes } from 'styled-components';

import Flex from '../../../components/Box/Flex';
import { HamburgerCloseIcon, HamburgerIcon, LogoIcon } from '../../../components/Svg';
import { MenuContext } from '../context';
import MenuButton from './MenuButton';

interface Props {
  href: string;
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`;

const StyledLink = styled("a")`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 210px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
`;

const Logo: React.FC<React.PropsWithChildren<Props>> = ({ href }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  const innerLogo = (
    <>
    {isMobile ? 
    <LogoIcon className="mobile-icon" aria-label="Toggle menu" />
    :
    <img src="/images/nav_logo.png" alt="Navbar Logo" />
  }
    </>
  );

  return (
    <Flex>
        {/* <MenuButton aria-label="Toggle menu" onClick={togglePush} mr="5px">
        {isPushed ? (
          <HamburgerCloseIcon width="24px" color="textSubtle" />
        ) : (
          <HamburgerIcon width="24px" color="textSubtle" />
        )}
      </MenuButton> */}
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="KazamaSwap">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="KazamaSwap">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  );
};

export default React.memo(Logo);
