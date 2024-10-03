import React, { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import { styled } from "styled-components";
import { Box, Flex } from "../../../../components/Box";
import { ChevronDownIcon, ChevronFilledIcon } from "../../../../components/Svg";
import { UserMenuProps, variants } from "./types";
import MenuIcon from "./MenuIcon";
import { UserMenuItem } from "./styles";

interface AvatarImageProps {
  src?: string;
  borderColor?: string;
  alt?: string;
}

export const StyledUserMenu = styled(Flex)`
  align-items: center;
  background-color: #23272e;
  border-radius: 6px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: inline-flex;
  height: 40px;
  padding-right: 8px;
  margin-right: 5px;
  position: relative;
  &:hover {
    opacity: 0.65;
  }
`;

const StyledChevronClosed = styled(ChevronFilledIcon)`
  width: 12px;
  margin-left: 5px;
`;

const StyledChevronOpen = styled(ChevronFilledIcon)`
  transform: rotate(180deg);
  width: 12px;
  margin-left: 5px;
`;

export const LabelText = styled.div`
  color: #fff;
  text-shadow: -1px -1px 0 black, 2px -1px 0 black, -1px 2px 0 black, 2px 2px 0 black;
  display: none;
  font-family: Industry-Black !important;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-family: Industry-Black !important;
    display: block;
    margin-left: 8px;
    margin-right: 4px;
  }
`;

const Menu = styled.div<{ $isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding-bottom: 4px;
  padding-top: 4px;
  pointer-events: auto;
  width: 280px;
  visibility: visible;
  z-index: 1001;

  ${({ $isOpen }) =>
    !$isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}

  ${UserMenuItem}:first-child {
    border-radius: 8px 8px 0 0;
  }

  ${UserMenuItem}:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const AvatarImage = styled.div.attrs<AvatarImageProps>(({ alt }) => ({
  alt,
}))<AvatarImageProps>`
  background: url("${({ src }) => src}");
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 38px;
  height: 38px;
  border: 3px ${({ borderColor }) => borderColor || "#353b45"} solid;

  & > img {
    border-radius: 50%;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  account,
  username,
  text,
  avatarSrc,
  avatarClassName,
  variant = variants.DEFAULT,
  children,
  disabled,
  rankProgress,
  placement = "bottom-end",
  recalculatePopover,
  ellipsis = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLDivElement | null>(null);

  const { styles, attributes, update } = usePopper(targetRef, tooltipRef, {
    strategy: "fixed",
    placement,
    modifiers: [{ name: "offset", options: { offset: [0, 0] } }],
  });

  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null;

  // recalculate the popover position
  useEffect(() => {
    if (recalculatePopover && isOpen && update) update();
  }, [isOpen, update, recalculatePopover]);

  useEffect(() => {
    const showDropdownMenu = () => {
      setIsOpen(true);
    };

    const hideDropdownMenu = (evt: MouseEvent | TouchEvent) => {
      const target = evt.target as Node;
      if (target && !tooltipRef?.contains(target)) {
        setIsOpen(false);
        evt.stopPropagation();
      }
    };

    targetRef?.addEventListener("mouseenter", showDropdownMenu);
    targetRef?.addEventListener("mouseleave", hideDropdownMenu);

    return () => {
      targetRef?.removeEventListener("mouseenter", showDropdownMenu);
      targetRef?.removeEventListener("mouseleave", hideDropdownMenu);
    };
  }, [targetRef, tooltipRef, setIsOpen]);

  return (
    <Flex alignItems="center" height="100%" ref={setTargetRef} {...props}>
      <StyledUserMenu
        onTouchStart={() => {
          setIsOpen((s) => !s);
        }}
      >
        <AvatarImage src={avatarSrc} />
        <LabelText title={typeof text === "string" ? text || account : account}>
          <div style={{ flexDirection: "column", fontFamily: "Industry-Black" }}>
            <div style={{ fontFamily: "Industry-Black", fontSize: "15px" }}>
              {text || username || (ellipsis ? accountEllipsis : accountEllipsis)}
            </div>
            <div>{rankProgress}</div>
          </div>
        </LabelText>
        {isOpen ? <StyledChevronOpen /> : <StyledChevronClosed />}
      </StyledUserMenu>
      {!disabled && (
        <Menu style={styles.popper} ref={setTooltipRef} {...attributes.popper} $isOpen={isOpen}>
          <Box onClick={() => setIsOpen(false)}>{children?.({ isOpen })}</Box>
        </Menu>
      )}
    </Flex>
  );
};

export default UserMenu;
