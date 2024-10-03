import React from 'react'
import classes from './Item.module.css'

const Item = ({ name, subName, logo, color, getId, id }) => {
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
      styleColor = ''
  }

  let style = `radial-gradient(116.96% 153.22% at 131.9% -61.54%, ${styleColor} -200%, rgba(28, 29, 37, 0) 100%), #232531`

  return (
    <div className={classes.item} style={{background: style}} onClick={() => getId(id)}>
      <span className={classes.itemJustLine} style={{borderRight: `2px solid ${styleColor}`}} />
      <div className={classes.itemInner}>
        <div className={classes.itemLogo}>
          <img src={logo} alt=""/>
        </div>
        <div className={classes.itemDescription}>
          <p className={classes.itemName}>{name}</p>
          <p className={classes.itemSubName}>{subName}</p>
        </div>
      </div>
    </div>
  )
}

export default Item
