import { useIsMounted } from "@kazama-defi/hooks";
import { kazamaBaseColors } from "../..";
import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import { AtomBox } from "../../components/AtomBox";
import KazamaPrice from "../../components/KazamaPrice/KazamaPrice";
import Footer from "../../components/Footer";
import LangSelector from "../../components/LangSelector/LangSelector";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../contexts";
import Logo from "./components/Logo";
import {
  MENU_HEIGHT,
  MOBILE_MENU_HEIGHT,
  SIDEBAR_RIGHT_WIDTH_FULL,
  SIDEBAR_RIGHT_WIDTH_REDUCED,
  SIDEBAR_WIDTH_FULL,
  SIDEBAR_WIDTH_REDUCED,
  SIDEBARS_WIDTH_FULL,
  TOP_BANNER_HEIGHT,
  TOP_BANNER_HEIGHT_MOBILE,
  SCROLL_UP_FULL_WIDTH,
  SCROLL_UP_REDUCED,
} from "./config";
import { MenuContext } from "./context";
import { NavProps } from "./types";
import Panel from "./components/Panel";
import PanelRight from "./components/PanelRight";
import { Button } from "../..";
import { ArrowUpIcon } from "../..";

const Wrapper = styled.div`
  position: relative;
  z-index: 9;
`;

const KazamNavBackground = styled.div`
  background: ${kazamaBaseColors.kazamaNavBar};
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 78px;
  background-position: center;
  background-size: cover;
  z-index: -1;
`;

const KazamaNavContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  width: 100%;
  z-index: 20;
`;

const NavBottomWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const NavBottomPoly = styled.div`
  position: relative;
  padding-left: 10px;
  background: ${kazamaBaseColors.kazamaNavBar};
  width: 60%;
  height: 300px;
  clip-path: polygon(evenodd, 0% 0%, 100% 0%, 91.45% 14.51%, 49.12% 14.51%, 6.79% 14.51%);

  &:after {
    content: "";
    position: absolute;
    top: 39px; /* Adjust this value to position the border correctly */
    left: -5px; /* Adjust this value to position the border correctly */
    width: calc(100% + 10px); /* Adjust this value to account for the left and right position */
    height: calc(100% + 10px); /* Adjust this value to account for the top and bottom position */
    background: transparent;
    border: 5px solid #18191d; /* Adjust the thickness and color */
    clip-path: polygon(evenodd, 0% 0%, 100% 0%, 91.45% 14.51%, 49.12% 14.51%, 6.79% 14.51%);
    z-index: -1; /* Ensure the border is behind the main element */
  }
`;

const NavContainer = styled.div`
  &.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;

    @media (min-width: 576px) {
      max-width: 540px;
    }

    @media (min-width: 768px) {
      max-width: 720px;
    }

    @media (min-width: 992px) {
      max-width: 960px;
    }

    @media (min-width: 1200px) {
      max-width: 1230px;
    }
  }

  &.width-container {
    max-width: 100%;
  }
`;

const KazamaNavTopArea = styled.div`
  background: transparent;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.089);
`;

const NavTopRow = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
`;

const TopBarItem = styled.div`
  -webkit-box-flex: 0;
  -ms-flex: 0 0 50%;
  flex: 0 0 50%;
  max-width: 50%;
`;

const BottomNavItem = styled.div`
  padding: 18px 0;
`;

const TopLeftItems = styled.div`
  display: flex;
  align-items: center;
`;

const TopRightItems = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NavBottomArea = styled.div`
  -webkit-box-flex: 0;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  max-width: 100%;
`;

const NavBottomInner = styled.div`
  background-image: none !important;
  padding: 0 !important;
`;

const NavBottomItems = styled.div`
  display: flex !important;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const BottomNavWrap = styled.div`
  display: flex !important;
  flex-direction: row;
  flex-wrap: wrap;
  flex-grow: 1;
  margin-left: auto;
`;

const BottomLeftWrap = styled.div`
  margin-left: 0;
  margin-right: auto;
`;

const BottomRightWrap = styled.div`
  display: flex;
`;

const KazamaNavLogo = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -15px;
  z-index: 9;
`;

const KazamaNavBottom = styled.div<{ isPushed: boolean; isPushedRight: boolean }>`
  background-image: url(../images/img/bg/header_bottom_bg.png);
  position: absolute;
  left: 0;
  bottom: -29px;
  right: 0;
  width: 1200px;
  height: 28px;
  margin: 0 auto;
  z-index: -1;
`;

const KazamaNavItem = styled.div`
  display: flex;
  align-items: stretch;
  border-radius: 0.375rem;
  height: 45px;
  border: 1px solid rgba(0, 0, 0, 0.157);
  background-color: #21252b;
  margin-left: 7px;
`;

const StyledNav = styled.nav<{
  isPushed?: boolean;
  isPushedRight?: boolean;
  showMenu?: boolean;
  totalMenuHeight?: number;
}>`
  width: 100%;
  padding: 0px 12px 0px 24px;
  background: #1d2126;
  border-bottom: 1px solid rgba(0, 0, 0, 0.219);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  -webkit-box-align: center;
  align-items: center;
  height: 64px;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; isPushedRight: boolean; showMenu: boolean; totalMenuHeight: number }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    margin-right 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  width: 0px;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    margin-right: ${({ isPushedRight }) =>
      `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px)`};
    max-width: ${({ isPushedRight }) =>
      `calc(100% - ${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px)`};
  }
`;

const ScrollUpDiv = styled.div`
  position: fixed;
  bottom: calc(100px + env(safe-area-inset-bottom));
  display: block;
  background: #23262d;
  font-size: 11px;
  font-family: "Oxanium", cursive;
  border-top: 2px solid #2a2b37;
  border-bottom: 2px solid #2a2b37;
  border-radius: 3px;
  box-shadow: rgb(0 0 0 / 35%) 0px 3px 7px 0px;
`;

const LeftNav = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
`;

const MiddleNav = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-left: 0;
`;

const RightNav = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: flex-end;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  chat,
  top,
  topContentRight,
  themeSwitcher,
  topItems,
  onlineUsers,
  topItemsRight,
  leftSide,
  inMiddle,
  rightSide,
  rightSideAccount,
  rightSideBalance,
  rightSideNotifications,
  rightSideWallet,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  kazamaPriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyKazamaLabel,
  buyCakeLink,
  children,
  chainId,
}) => {
  const { isMobile, isMd } = useMatchBreakpoints();
  const isMounted = useIsMounted();
  const isSmallerScreen = isMobile || isMd;
  const [isPushed, setIsPushed] = useState(!isSmallerScreen);
  const [isPushedRight, setIsPushedRight] = useState(!isSmallerScreen);
  const [showChat, setShowChat] = useState(!isSmallerScreen);
  const [showMenu, setShowMenu] = useState(true);
  const [visible, setVisible] = useState(false);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = isMounted && banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(true);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 1) {
        setVisible(true);
      } else if (scrolled <= 1) {
        setVisible(false);
      }
    };

    const throttledToggleVisible = throttle(toggleVisible, 200);

    window.addEventListener("scroll", throttledToggleVisible);

    return () => window.removeEventListener("scroll", throttledToggleVisible);
  }, []);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  const providerValue = useMemo(() => ({ linkComponent }), [linkComponent]);
  return (
    <MenuContext.Provider value={providerValue}>
      <AtomBox
        asChild
        minHeight={{
          xs: "auto",
          md: "100vh",
        }}
      >
        <Wrapper>
          <KazamaNavContainer showMenu={showMenu} height={totalTopMenuHeight}>
            <KazamNavBackground />
            <NavContainer className="container width-container">
              <KazamaNavTopArea>
                <NavTopRow>
                  <TopBarItem>
                    <TopLeftItems>
                      <Logo href="/" />
                    </TopLeftItems>
                  </TopBarItem>
                  <KazamaNavLogo>
                    <img src="../images/img/logo/h3_logo.png" alt="Logo" />
                  </KazamaNavLogo>
                  <TopBarItem>
                    <TopRightItems>
                      <Flex>
                        <KazamaNavItem>{rightSideBalance}</KazamaNavItem>
                      </Flex>
                      <Flex>
                        <KazamaNavItem>{rightSideWallet}</KazamaNavItem>
                      </Flex>
                      <Flex>
                        <KazamaNavItem>{rightSideAccount}</KazamaNavItem>
                      </Flex>
                      <Flex>{rightSideNotifications}</Flex>
                    </TopRightItems>
                  </TopBarItem>
                </NavTopRow>
              </KazamaNavTopArea>
            </NavContainer>
            <NavBottomWrapper>
              <NavBottomPoly
                style={{
                  marginRight: `${SIDEBAR_RIGHT_WIDTH_FULL}px`,
                  marginLeft: `${SIDEBAR_WIDTH_FULL}px`,
                }}
              />
            </NavBottomWrapper>
          </KazamaNavContainer>

          <BodyWrapper>
            <Panel
              isPushed={isPushed}
              isMobile={isSmallerScreen}
              showMenu={showMenu}
              totalMenuHeight={totalTopMenuHeight}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              kazamaPriceUsd={kazamaPriceUsd}
              pushNav={setIsPushed}
              links={links}
              activeItem={activeItem}
              activeSubItem={activeSubItem}
              topContent={top}
            />
            <PanelRight
              chatLayout={chat}
              onlineUsers={onlineUsers}
              topContentRight={topContentRight}
              topItems={topItems}
              themeSwitcher={themeSwitcher}
              showChat={showChat}
              topItemsRight={topItemsRight}
              isPushedRight={isPushedRight}
              isMobile={isSmallerScreen}
              showMenu={showMenu}
              totalMenuHeight={totalTopMenuHeight}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              kazamaPriceUsd={kazamaPriceUsd}
              pushNav={setIsPushedRight}
              links={links}
              activeItem={activeItem}
              activeSubItem={activeSubItem}
            />

            <Inner
              style={{
                marginRight: `${isPushedRight ? SIDEBAR_RIGHT_WIDTH_FULL : SIDEBAR_RIGHT_WIDTH_REDUCED}px`,
                marginLeft: `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`,
              }}
              isPushed={isPushed}
              isPushedRight={isPushedRight}
              showMenu={showMenu}
              totalMenuHeight={totalTopMenuHeight}
            >
              {children}
              <Footer
                chainId={chainId}
                items={footerLinks}
                isDark={isDark}
                toggleTheme={toggleTheme}
                langs={langs}
                setLang={setLang}
                currentLang={currentLang}
                cakePriceUsd={kazamaPriceUsd}
                buyCakeLabel={buyKazamaLabel}
                buyCakeLink={buyCakeLink}
                mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
              />
            </Inner>
            <ScrollUpDiv
              style={{
                right: `${isPushedRight ? SCROLL_UP_FULL_WIDTH : SCROLL_UP_REDUCED}px`,
                display: visible ? "inline" : "none",
              }}
            >
              <Button
                width={45}
                height={45}
                endIcon={
                  <ArrowUpIcon
                    color="invertedContrast"
                    style={{ marginLeft: 0, background: "transparent !important" }}
                  />
                }
                onClick={scrollToTop}
              />
            </ScrollUpDiv>
          </BodyWrapper>
        </Wrapper>
      </AtomBox>
      {/* <AtomBox display={{ xs: "block", md: "none" }}>
        <BottomNav activeItem={activeItem} activeSubItem={activeSubItem} />
      </AtomBox> */}
    </MenuContext.Provider>
  );
};

export default Menu;
