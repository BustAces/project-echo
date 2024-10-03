import React from 'react'
import classes from './ItemList.module.css'
import decor from '../assets/decore.png'
import Item from '../Item/Item'

const ItemList = ({ items, getId }) => {
  return (
    <div className={classes.itemList}>
      <h2>Содержимое кейса</h2>
      <img src={decor} alt="" />

      <div className={classes.container}>
        { items.map(el => (
          <Item
            name={el.name}
            subName={el.subName}
            logo={el.logo}
            color={el.color}
            getId={getId}
            id={el.id}
            key={el.id}
          />
        )) }
      </div>

    </div>
  )
}

export default ItemList
