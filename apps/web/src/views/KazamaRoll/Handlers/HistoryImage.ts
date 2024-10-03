import { symbolImages } from '../Styles/Images'

// Function to handle history images
export const handleHistoryImage = (randomNumber) => {
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
