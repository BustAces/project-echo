import React, { useState } from "react";
import Roulette from "../Roulette/Roulette";
import ItemList from "../ItemList/ItemList";
import classes from "./App.module.css";

import logo from "../assets/header-title.png";
import cursor from "../assets/cursor.png";

import case00 from "../assets/case/desert-eagle-printstream.png";
import case01 from "../assets/case/m4a4-tooth-fairy.png";
import case02 from "../assets/case/karambit-gamma-doppler.png";
import case03 from "../assets/case/ak-47-case-hardened.png";
import case04 from "../assets/case/mag-7-monster-call.png";
import case05 from "../assets/case/glock-18-vogue.png";
import case06 from "../assets/case/awp-asiimov.png";
import case07 from "../assets/case/ak-47-legion-of-anubis.png";
import case08 from "../assets/case/skeleton-knife-fade.png";
import case09 from "../assets/case/galil-ar-connexion.png";
import case10 from "../assets/case/mac-10-allure.png";
import case11 from "../assets/case/m9-bayonet-doppler.png";
import case12 from "../assets/case/cz75-auto-yellow-jacket.png";
import case13 from "../assets/case/m4a1-s-printstream.png";
import case14 from "../assets/case/classic-knife-slaughter.png";
import case15 from "../assets/case/m4a1-s-hot-rod.png";
import case16 from "../assets/case/r8-revolver-fade.png";
import case17 from "../assets/case/desert-eagle-fennec-fox.png";
import case18 from "../assets/case/awp-silk-tiger.png";
import case19 from "../assets/case/talon-knife-blue-steel.png";
import case20 from "../assets/case/mac-10-neon-rider.png";
import case21 from "../assets/case/usp-s-kill-confirmed.png";
import case22 from "../assets/case/nova-red-quartz.png";
import case23 from "../assets/case/famas-roll-cage.png";
import case24 from "../assets/case/m9-bayonet-damascus-steel.png";
import case25 from "../assets/case/sg-553-bulldozer.png";
import case26 from "../assets/case/paracord-knife-case-hardened.png";
import case27 from "../assets/case/ak-47-wasteland-rebel.png";

const items = [
  {
    name: "Desert Eagle",
    subName: "Printstream",
    logo: case00,
    price: "150",
    color: "legendary",
    id: 0,
  },
  {
    name: "M4A4",
    subName: "Tooth Fairy",
    logo: case01,
    price: "135",
    color: "orange",
    id: 1,
  },
  {
    name: "Karambit",
    subName: "Gamma Doppler",
    logo: case02,
    price: "74",
    color: "red",
    id: 2,
  },
  {
    name: "AK-47",
    subName: "Case Hardened",
    logo: case03,
    price: "256",
    color: "purple",
    id: 3,
  },
  {
    name: "MAG-7",
    subName: "Monster Call",
    logo: case04,
    price: "602",
    color: "blue",
    id: 4,
  },
  {
    name: "Glock-18",
    subName: "Vogue",
    logo: case05,
    price: "82",
    color: "light",
    id: 5,
  },
  {
    name: "AWP",
    subName: "Asiimov",
    logo: case06,
    price: "40",
    color: "gray",
    id: 6,
  },
  {
    name: "AK-47",
    subName: "Legion of Anubis",
    logo: case07,
    price: "38",
    color: "legendary",
    id: 7,
  },
  {
    name: "Skeleton Knife",
    subName: "Fade",
    logo: case08,
    price: "366",
    color: "orange",
    id: 8,
  },
  {
    name: "Galil AR",
    subName: "Connexion",
    logo: case09,
    price: "274",
    color: "red",
    id: 9,
  },
  {
    name: "MAC-10",
    subName: "Allure",
    logo: case10,
    price: "24",
    color: "purple",
    id: 10,
  },
  {
    name: "M9 Bayonet",
    subName: "Doppler",
    logo: case11,
    price: "754",
    color: "blue",
    id: 11,
  },
  {
    name: "CZ-75 Auto",
    subName: "Yellow Jacket",
    logo: case12,
    price: "255",
    color: "light",
    id: 12,
  },
  {
    name: "M4A1-S",
    subName: "Printstream",
    logo: case13,
    price: "651",
    color: "gray",
    id: 13,
  },
  {
    name: "Classic Knife",
    subName: "Slaughter",
    logo: case14,
    price: "23",
    color: "legendary",
    id: 14,
  },
  {
    name: "M4A1-S",
    subName: "Hot Rod",
    logo: case15,
    price: "751",
    color: "orange",
    id: 15,
  },
  {
    name: "R8 Revolver",
    subName: "Fade",
    logo: case16,
    price: "21",
    color: "red",
    id: 16,
  },
  {
    name: "Desert Eagle",
    subName: "Fennec Fox",
    logo: case17,
    price: "460",
    color: "purple",
    id: 17,
  },
  {
    name: "AWP",
    subName: "Silk Tiger",
    logo: case18,
    price: "128",
    color: "blue",
    id: 18,
  },
  {
    name: "Talon Knife",
    subName: "Blue Steel",
    logo: case19,
    price: "76",
    color: "light",
    id: 19,
  },
  {
    name: "MAC-10",
    subName: "Neon Rider",
    logo: case20,
    price: "16",
    color: "gray",
    id: 20,
  },
  {
    name: "USP-S",
    subName: "Kill Confirmed",
    logo: case21,
    price: "742",
    color: "legendary",
    id: 21,
  },
  {
    name: "Nova",
    subName: "Red Quartz",
    logo: case22,
    price: "119",
    color: "orange",
    id: 22,
  },
  {
    name: "FAMAS",
    subName: "Roll Cage",
    logo: case23,
    price: "46",
    color: "red",
    id: 23,
  },
  {
    name: "M9 Bayonet",
    subName: "Damascus Steel",
    logo: case24,
    price: "91",
    color: "purple",
    id: 24,
  },
  {
    name: "SG 553",
    subName: "Bulldozer",
    logo: case25,
    price: "659",
    color: "blue",
    id: 25,
  },
  {
    name: "Paracord Knife",
    subName: "Case Hardened",
    logo: case26,
    price: "54",
    color: "light",
    id: 26,
  },
  {
    name: "AK-47",
    subName: "Wasteland Rebel",
    logo: case27,
    price: "885",
    color: "gray",
    id: 27,
  },
];

const App = () => {
  const [btn, setBtn] = useState(false);
  const [ml, setMl] = useState(0);
  const [itemId, setItemId] = useState(null);

  const roul = () => {
    setMl((prevState) => prevState - (Math.random() * (6000 - 4000) + 4000));
    setBtn(true);
    setTimeout(() => {
      setBtn(false);
    }, 7000);
  };

  const onButtonHandler = () => {
    roul();
  };

  const onItemHandler = (id) => {
    roul();
    setItemId(id);
  };

  return (
    <div className={classes.App}>
      <img src={logo} alt="Spring Event" />
      <img className={classes.rouletteCursor} src={cursor} alt="" />

      <Roulette items={items} active={btn} ml={ml} itemId={itemId} />

      <div className={classes.rouletteStatusWrapper}>
        {btn ? (
          <p className={classes.rouletteStatus}>Открывается...</p>
        ) : (
          <button className={classes.rouletteButton} onClick={onButtonHandler}>
            Открыть
          </button>
        )}
      </div>

      <ItemList items={items} getId={onItemHandler} />
    </div>
  );
};

export default App;
