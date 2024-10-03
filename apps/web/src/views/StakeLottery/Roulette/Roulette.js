import React, { useState, useEffect } from "react";
import classes from "./Roulette.module.css";
import RouletteItem from "../RouletteItem/RouletteItem";
import { Transition } from "react-transition-group";

const Roulette = ({ items, active, ml, itemId }) => {
  const [roulette, setRoulette] = useState(items);
  const [num, setNum] = useState(0);
  const [item, setItem] = useState(null);

  const duration = 6500;
  const defaultStyle = {
    transition: `margin ${duration}ms ease-in-out`,
  };

  const transitionStyles = {
    entered: { margin: `0 0 0 ${ml}px` },
    exited: { margin: `0 0 0 ${ml - (100 - ((-ml - 100) % 200))}px` },
  };

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      setRoulette((roulette) => {
        return [
          ...roulette,
          { ...roulette[Math.floor(Math.random() * roulette.length)] },
        ];
      });
    }
  }, []);

  useEffect(() => {
    setNum(Math.trunc((-ml + 100) / 200));
  }, [ml]);

  useEffect(() => {
    setItem(roulette.find((el) => el.id === itemId));
  }, [itemId]);

  useEffect(() => {
    if (itemId !== null && num > 0) {
      const newRoul = roulette.map((el, index) => {
        if (index === num + 3) {
          return { ...item };
        }
        return el;
      });
      setRoulette(newRoul);
    }
  }, [item]);

  return (
    <div className={classes.roulette}>
      <span className={classes.forLowWidth} />
      <Transition in={active} timeout={{ entered: duration, exited: 150 }}>
        {(state) => (
          <span
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
              marginLeft: 0,
            }}
          />
        )}
      </Transition>
      {roulette.map((el, index) => (
        <RouletteItem
          name={el.name}
          subName={el.subName}
          logo={el.logo}
          color={el.color}
          id={el.id}
          key={index}
          price={el.price}
        />
      ))}
    </div>
  );
};

export default Roulette;
