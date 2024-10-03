import EmojiList from './list'

const getEmojiUrlById = (id) => {
  const emoji = EmojiList.find((emoji) => emoji.id === id)
  return emoji ? emoji.imgUrl : null
}

export { getEmojiUrlById }
