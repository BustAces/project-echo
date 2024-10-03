// Kazama roll color mapping
export const colorMapping = {
  0: 'green',
  1: 'red',
  2: 'red',
  3: 'red',
  4: 'red',
  5: 'red',
  6: 'red',
  7: 'red',
  8: 'black',
  9: 'black',
  10: 'black',
  11: 'black',
  12: 'black',
  13: 'black',
  14: 'black',
}

// History colors
export const historyColors = {
  red: '#de4c41',
  black: '#31353d',
  green: '#00c74d',
}

// Symbol image paths
export const symbolImages = {
  black_diamond: '/images/roll/diamond_black.svg',
  black_king: '/images/roll/crown_black.svg',
  red_diamond: '/images/roll/kazama_red.svg',
  red_king: '/images/roll/crown_red.svg',
  green: '/images/roll/green.png',
}

// Shadow settings
export const shadowSettings = {
  red: '0 10px 27px #fa010133, inset 0 2px #e5564b, inset 0 -2px #ad362d;',
  black: '0 10px 27px #010a1d1f, inset 0 2px #3b3f47, inset 0 -2px #272b33',
  green: '0 10px 27px #00ff0c1a, inset 0 2px #35d87b, inset 0 -2px #00913c',
}

// Function to handle history images
export const getHistoryImage = (randomNumber) => {
  switch (randomNumber) {
    case 0:
      return symbolImages.green
    case 1:
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
      return symbolImages.red_diamond
    case 4:
      return symbolImages.red_king
    case 8:
    case 9:
    case 10:
    case 12:
    case 13:
    case 14:
      return symbolImages.black_diamond
    case 11:
      return symbolImages.black_king
    default:
      return '' // Default image or empty if no match
  }
}

// Export of all rows
export const DivRows = `
      <div class='row'>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
        <div class='card red'><img width='62px' src="/images/roll/crown_red.svg" /></div>
        <div class='card green'><img width='26px' src="/images/roll/green.png" /></div>
        <div class='card black'><img width='62px' src="/images/roll/crown_black.svg" /></div>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
        <div class='card red'><img width='26px' src="/images/roll/kazama_red.svg" /></div>
        <div class='card black'><img width='44px' src="/images/roll/diamond_black.svg" /></div>
      </div>
    `
