import React, { createElement, ReactElement, memo } from "react";
import styled from "styled-components";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel, DataLabel, LinkStatus } from "./MenuEntry";
import { PanelProps, PushedProps } from "../types";
import MenuItem from "../../../components/MenuItem";

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 5px 10px 80px;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links, activeItem, activeSubItem }) => {
  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;
  const handleClickNav = () => pushNav(!isPushed);
  return (
    <Container>
      {links.map((entry) => {
        const Icon = entry.icon;
        // const itemIconElement = <Icon width="24px" mr="8px" />;
        const iconElement = createElement(Icon as any, {
          color:
            entry.href === activeItem || entry.items?.some((item) => item.href === activeSubItem)
              ? "secondary"
              : "textSubtle",
          marginRight: "7px",
        });

        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

        if (entry.items && entry.items.length > 0) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === activeSubItem);
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0;
          activeItem;
          return (
            <>
              <Accordion
                key={entry.label}
                isPushed={isPushed}
                pushNav={pushNav}
                icon={iconElement}
                label={entry.label}
                dataText={entry.data}
                status={entry.status}
                initialOpenState={initialOpenState}
                className={calloutClass}
                isActive={entry.href === activeItem || entry.items?.some((item) => item.href === activeSubItem)}
              >
                {isPushed &&
                  entry.items.map((item) => {
                    const ItemIcon = item.itemIcon;
                    const itemIconElement = createElement(ItemIcon as any, { marginRight: "7px" });
                    return (
                      <MenuEntry key={item.href} secondary isActive={item.href === activeSubItem} onClick={handleClick}>
                        <MenuItem
                          href={item.href}
                          itemIcon={itemIconElement}
                          isActive={item.href === activeSubItem}
                          statusColor={item.status?.color}
                          isDisabled={item.disabled}
                        >
                          <LinkLabel isPushed={isPushed}>{item.label}</LinkLabel>
                          {item.dataText && (
                            <DataLabel isPushed={isPushed} style={{ marginLeft: "auto" }}>
                              <div style={{ textAlign: "right" }}>{item.dataText}</div>
                            </DataLabel>
                          )}
                          {item.itemData && (
                            <DataLabel isPushed={isPushed} style={{ marginLeft: "auto" }}>
                              <div style={{ textAlign: "right" }}>{item.itemData}</div>
                            </DataLabel>
                          )}
                          {item.status && (
                            <LinkStatus style={{ marginLeft: "auto" }} color={item.status.color}>
                              {item.status.text}
                            </LinkStatus>
                          )}
                        </MenuItem>
                      </MenuEntry>
                    );
                  })}
              </Accordion>
            </>
          );
        }
      })}
    </Container>
  );
};

export default PanelBody;
