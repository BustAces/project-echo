import { createGlobalStyle } from 'styled-components'

import { KazamaTheme } from '@kazama-defi/uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends KazamaTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Bai Jamjuree, sans-serif;
    font-size: 0.9rem;
  }
  html, body {
    background-color: ${({ theme }) => theme.colors.background};
    -ms-overflow-style: none;
    overflow-y: auto; /* Use auto to show scrollbar only when needed */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer and Edge */

    /* Hide scrollbar in WebKit (Chrome, Safari) */
    &::-webkit-scrollbar {
      display: none;
    }

    icon {
      max-width: 100%;
    }
  }

input:focus {
  outline: none;
}

.chat-messages-masked-image {
  -webkit-mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  padding-bottom: 15px;
  overflow-y: auto;
}

.chat-messages {
  -webkit-mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  mask-image: linear-gradient(to top, rgb(32, 28, 41) 87%, transparent 100%);
  padding-bottom: 15px;
  overflow-y: auto;
}

.GifPickerReact {
  --gpr-bg-color: #21252b !important;
  --gpr-picker-border-color: #0D131C !important;
  margin-bottom: 10px;
  padding-bottom: 15px;
  height: 320px;
  --gpr-search-input-placeholder-color: #fff !important;
  --gpr-category-border-color-hover: none !important;
}

.GifPickerReact .gpr-search-container input.gpr-search {
  background-color: #1a1e23 !important;
  border: 1px solid rgba(0, 0, 0, 0.157) !important;
  border-radius: 0.25rem !important;
  color: #fff !important;
  --gpr-search-input-placeholder-color: #a6a7aa !important;;
  font-family: Industry-Black !important;
  font-size: 13px !important;
  height: 37px !important;
  outline: none;
  padding: var(--gpr-search-input-padding);
  transition: all .2s ease-in-out;
  width: 100%;
}

.GifPickerReact .gpr-header {
  border-bottom: 0px solid var(--gpr-picker-border-color) !important;
  min-height: 0;
  padding: 10px !important;
}

.GifPickerReact .gpr-category-list {
  grid-gap: var(--gpr-category-list-padding);
  display: grid;
  flex: 1;
  grid-auto-rows: min-content;
  grid-template-columns: 1fr 1fr;
  overflow-y: scroll;
  padding: 10px !important;
}

.GifPickerReact .gpr-category img {
  background-color: transparent !important;
  border-radius: 0.25rem !important;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  width: 100%;
}

.GifPickerReact .gpr-category-overlay {
  align-items: center;
  background-color: rgba(0,0,0,var(--gpr-category-background-opacity));
  border-radius: 0.25rem !important;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color .15s ease-in-out;
  width: 100%;
}

.GifPickerReact.gpr-main {
  background: #1d2126 !important;
  top: 50px;
  border-color: rgba(0, 0, 0, 0.089) !important;
  border-radius: 0.25rem !important;
  border-style: solid;
  border-width: 1px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 8px -4px,rgba(0, 0, 0, 0.18) 0px 0px 20px 0px,rgba(0, 0, 0, 0.35) 0px 40px 34px -16px;
}

aside.EmojiPickerReact.epr-main {
  border-color: rgba(0, 0, 0, 0.089) !important;
  border-radius: 0.25rem !important;
  border-style: solid;
  border-width: 1px;
  display: flex;
  background: #1d2126 !important;
  flex-direction: column;
  position: absolute; /* Change from relative to absolute */
  top: 50px; /* Adjust the top position as needed */
  left: 50%; /* Adjust the left or right position as needed */
  transform: translateX(-50%); /* Center the element horizontally */
  margin-bottom: 15px !important;
  font-family: 'Flama', sans-serif !important;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 8px -4px, rgba(0, 0, 0, 0.18) 0px 0px 20px 0px, rgba(0, 0, 0, 0.35) 0px 40px 34px -16px;
  z-index: 1000; /* Ensure it appears above other content */
}

.EmojiPickerReact li.epr-emoji-category>.epr-emoji-category-label {
  align-items: center;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  background-image: linear-gradient(to right, #1a1e23, #1d2126) !important;
  color: #fff !important;
  font-weight: 500 !important;
  display: flex;
  font-family: Industry-Black !important;
  font-size: 15px !important;
  height: var(--epr-category-label-height);
  padding: var(--epr-category-label-padding);
  position: -webkit-sticky;
  position: sticky;
  text-transform: capitalize;
  margin-bottom: 7px;
  top: 0;
  width: 100%;
  z-index: var(--epr-category-label-z-index);
}

.EmojiPickerReact .epr-emoji-category-content {
  margin-bottom: 9px;
}

.EmojiPickerReact .epr-search-container input.epr-search {
  background-color: #111923 !important;
  border: 1px solid #111923 !important;
  border-radius: var(--epr-search-input-border-radius);
  color: var(--epr-search-input-text-color);
  height: var(--epr-search-input-height);
  outline: none;
  padding: var(--epr-search-input-padding);
  transition: all .2s ease-in-out;
  width: 100%;
  font-family: '', sans-serif !important;
  color: #fff !important;
  font-size: 15px !important;
}

.EmojiPickerReact {
  --epr-highlight-color: #007aeb;
  --epr-hover-bg-color: #f1f8ff;
  --epr-focus-bg-color: rgb(247, 147, 30)!important;
  --epr-text-color: #fff !important;
  --epr-search-input-bg-color: #f6f6f6;
  --epr-picker-border-color: #e7e7e7;
  --epr-bg-color: #fff;
  --epr-category-icon-active-color: #fff !important;
  --epr-skin-tone-picker-menu-color: #ffffff95;
  --epr-horizontal-padding: 10px;
  --epr-picker-border-radius: 8px;
  --epr-search-border-color: var(--epr-highlight-color);
  --epr-header-padding: 15px var(--epr-horizontal-padding);
  --epr-active-skin-tone-indicator-border-color: #fff !important;
  --epr-active-skin-hover-color: #fff !important;
  --epr-search-input-bg-color-active: var(--epr-search-input-bg-color);
  --epr-search-input-padding: 0 30px;
  --epr-search-input-border-radius: 8px;
  --epr-search-input-height: 40px;
  --epr-search-input-text-color: var(--epr-text-color);
  --epr-search-input-placeholder-color: var(--epr-text-color);
  --epr-search-bar-inner-padding: var(--epr-horizontal-padding);
  --epr-category-navigation-button-size: 30px;
  --epr-emoji-variation-picker-height: 45px;
  --epr-emoji-variation-picker-bg-color: var(--epr-bg-color);
  --epr-preview-height: 70px;
  --epr-preview-text-size: 14px;
  --epr-preview-text-padding: 0 var(--epr-horizontal-padding);
  --epr-preview-border-color: var(--epr-picker-border-color);
  --epr-preview-text-color: var(--epr-text-color);
  --epr-category-padding: 0 var(--epr-horizontal-padding);
  --epr-category-label-bg-color: #ffffffe6;
  --epr-category-label-text-color: var(--epr-text-color);
  --epr-category-label-padding: 0 var(--epr-horizontal-padding);
  --epr-category-label-height: 40px;
  --epr-emoji-size: 30px;
  --epr-emoji-padding: 5px;
  --epr-emoji-fullsize: calc(var(--epr-emoji-size) + var(--epr-emoji-padding)*2);
  --epr-emoji-hover-color: rgb(247, 147, 30) !important;
  --epr-emoji-variation-indicator-color: var(--epr-picker-border-color);
  --epr-emoji-variation-indicator-color-hover: var(--epr-text-color);
  --epr-header-overlay-z-index: 3;
  --epr-emoji-variations-indictator-z-index: 1;
  --epr-category-label-z-index: 2;
  --epr-skin-variation-picker-z-index: 5;
  --epr-preview-z-index: 6;
}

.kazama-crash-container {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.8fr 1.2fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 10px 10px;
  grid-auto-flow: row;
  grid-template-areas:
    "crashbox crashbox current-bets"
    "crashbox crashbox current-bets"
    "user-dash user-dash current-bets";
}

.crashbox { 
  grid-area: crashbox;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  display: flex;
  height: 100%;
  max-height: 500px;
}

.current-bets { 
  grid-area: current-bets;
  background: #21252b;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  overflow-y: scroll;
  height: 85vh;
}

.user-dash {
  grid-area: user-dash;
  background: #1a1e23;
  border: 1px solid rgba(0, 0, 0, 0.35);
  padding: 25px;
}

.kazama-crash-container * {
  position: relative;
}

.kazama-crash-container *:after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
}

.Kazama__toast-container--top-right {
  top: 125px;
  right: 8px;
  z-index: 1000 !important;
}

.Kazama__close-button {
  color: #fff;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  align-self: flex-start;
  z-index: 1;
  margin-top: 8px;
  margin-right: 5px;
}




.kazama-lottery {
  margin: -26px auto;
  width: 1400px;
  height: 227px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 24px 109px rgba(0, 0, 0, 0.39);
  position: relative;
}

@media screen and (max-width: 1420px) {
  .kazama-lottery {
    width: 1000px;
  }

  .forLowWidth {
    margin-left: 0;
  }
}










.kazama-roll-wrapper{
  position:relative;
  display:flex;
  justify-content:center;
  width:100%;
  margin:0 auto;
  overflow:hidden;
  background: #1d2126;
  padding: 17px 0px 17px 0px;
  clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px);
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* Internet Explorer/Edge */
  user-select: none;         /* Standard */
}

.kazama-roll-wrapper .selector{
position: absolute;
    left: calc(50% - .1875rem);
    top: 0;
    width: .1875rem;
    height: 100%;
    background-color: #fff;
    z-index: 2;
    transition: opacity .5s;
}

.kazama-roll-wrapper .spinner{
  display:flex;
}

.kazama-roll-wrapper .spinner .row{
  display:flex;
}

.kazama-roll-wrapper .spinner .row .card{
  height:75px;
  width:75px;
  margin:3px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:white;
  font-size:1.5em;
}

@keyframes growAndShrink {
  0% {
    transform: scale(1); /* Start at normal size */
  }
  50% {
    transform: scale(1.2); /* Grow to 120% of its size */
  }
  100% {
    transform: scale(1); /* Shrink back to normal size */
  }
}

.card.red{
    background-color: #de4c41;
    box-shadow: 0 10px 27px #fa010133, inset 0 2px #e5564b, inset 0 -2px #ad362d;
}

.card.purple{
  background-color: #9d00ff;
  box-shadow: 0 10px 27px #5f00b533, inset 0 2px #b847ff, inset 0 -2px #7800b3;
}

.card.black{
    background-color: #31353d;
    box-shadow: 0 10px 27px #010a1d1f, inset 0 2px #3b3f47, inset 0 -2px #272b33;
}

.card.green{
    background-color: #00c74d;
    box-shadow: 0 10px 27px #00ff0c1a, inset 0 2px #35d87b, inset 0 -2px #00913c;
}

.gold{
    background-color: #d4af37;
    box-shadow: 0 10px 27px #d4af371a, inset 0 2px #e0bc43, inset 0 -2px #b8860b;
}

.card.darkened {
  opacity: 0.26;
  transition: opacity 0.1s !important;
}

.card.all-darkened {
  opacity: 0.26;
  transition: opacity 0.5s !important;
}

.card.won {
  animation: growAndShrink 4.5s ease-in-out;
}

.card.normal {
  opacity: 1;
  transition: opacity 1s !important;
}

.card.highlighted {
  opacity: 1 !important;
  transition: opacity 0.1s !important;
}
  
*{
  box-sizing:border-box;
}

.kazama-roll-wrapper:before,
.kazama-roll-wrapper:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  pointer-events: none;
  z-index: 3;
}

.kazama-roll-wrapper:before {
  left: 0;
  background: linear-gradient(to right, rgba(28, 31, 38, 1), rgba(28, 31, 38, 0));
}

.kazama-roll-wrapper:after {
  right: 0;
  background: linear-gradient(to left, rgba(28, 31, 38, 1), rgba(28, 31, 38, 0));
}


`

export default GlobalStyle
