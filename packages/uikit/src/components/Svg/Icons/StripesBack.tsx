import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="74" height="11" viewBox="0 0 74 11" {...props}>
      <defs>
        <linearGradient id="a" x1="73.646" y1="5.433" x2="0" y2="5.433" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <path
        fill="url(#a)"
        fillOpacity="0.3"
        d="m68.5.015 5.1 10.837h-5.5L63 .015h5.5Zm-14.5 0 5.1 10.837h5.5L59.5.015H54Zm-9 0 5.1 10.837h5.5L50.5.015H45Zm-9 0 5.1 10.837h5.5L41.5.015H36Zm-9 0 5.1 10.837h5.5L32.5.015H27Zm-9 0 5.1 10.837h5.5L23.5.015H18Zm-9 0 5.1 10.837h5.5L14.5.015H9Zm-9 0 5.1 10.837h5.5L5.5.015H0Z"
      />
    </Svg>
  );
};

export default Icon;
