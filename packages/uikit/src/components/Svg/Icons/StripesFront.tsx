import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="74" height="11" viewBox="0 0 74 11" {...props}>
      <defs>
        <linearGradient id="a" x1="0" y1="5.433" x2="73.646" y2="5.433" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <path
        fill="url(#a)"
        fillOpacity="0.3"
        d="M10.6.015 5.5 10.852H0L5.1.015h5.5Zm3.5 0L9 10.852h5.5L19.6.015h-5.5Zm9 0L18 10.852h5.5L28.6.015h-5.5Zm9 0L27 10.852h5.5L37.6.015h-5.5Zm9 0L36 10.852h5.5L46.6.015h-5.5Zm9 0L45 10.852h5.5L55.6.015h-5.5Zm9 0L54 10.852h5.5L64.6.015h-5.5Zm9 0L63 10.852h5.5L73.6.015h-5.5Z"
      />
    </Svg>
  );
};

export default Icon;
