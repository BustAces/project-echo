import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 28 28" {...props}>
    <path
      fillRule="evenodd"
      stroke="none"
      fillOpacity="1"
      d="m31.348 13.8a15.5 15.5 0 0 0 -30.721 4.215 15.614 15.614 0 0 0 13.31 13.351 16.058 16.058 0 0 0 2.08.136 15.351 15.351 0 0 0 7.972-2.217 1.5 1.5 0 0 0 -1.548-2.57 12.5 12.5 0 1 1 -4.789-23.109 12.5 12.5 0 0 1 10.162 16.488 2.166 2.166 0 0 1 -2.079 1.406 2.238 2.238 0 0 1 -2.235-2.235v-9.265a1.5 1.5 0 0 0 -3 0v.014a7.5 7.5 0 1 0 .541 11.523 5.224 5.224 0 0 0 4.694 2.963 5.167 5.167 0 0 0 4.914-3.424 15.535 15.535 0 0 0 .699-7.276zm-15.348 6.7a4.5 4.5 0 1 1 4.5-4.5 4.505 4.505 0 0 1 -4.5 4.5z"
    />
  </Svg>
);

export default Icon;