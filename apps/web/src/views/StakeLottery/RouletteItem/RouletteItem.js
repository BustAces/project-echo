import React from 'react'
import classes from './RouletteItem.module.css'

const RouletteItem = ({ name, subName, logo, color, price }) => {
  let styleColor = ''

  switch (color) {
    case 'legendary':
      styleColor = '#FFAB2E'
      break
    case 'orange':
      styleColor = '#FF532E'
      break
    case 'red':
      styleColor = '#FF2E53'
      break
    case 'purple':
      styleColor = '#C92EFF'
      break
    case 'blue':
      styleColor = '#4B2EFF'
      break
    case 'light':
      styleColor = '#2EC0FF'
      break
    case 'gray':
      styleColor = '#9793AA'
      break
    default:
      styleColor = '#FF0000'
  }

  const style = `radial-gradient(116.96% 153.22% at 131.9% -61.54%, ${styleColor} -200%, rgba(28, 29, 37, 0) 100%), #18181E`

  return (
    <div className={classes.rouletteItem} style={{background: style}}>
      <span className={classes.rouletteJustLine} style={{borderRight: `2px solid ${styleColor}`}} />
      <div className={classes.rouletteItemInner}>
        <div className={classes.rouletteItemPrice}>{price} ₽</div>
        <div className={classes.rouletteItemLogo}>
          <img src={logo} alt=""/>
        </div>
        <div className={classes.rouletteItemDescription}>
          <p>{name}</p>
          <p className={classes.rouletteItemSubName}>{subName}</p>
        </div>
      </div>
    </div>
  )
}

export default RouletteItem
