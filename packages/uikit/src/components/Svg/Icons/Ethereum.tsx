import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 360 360" {...props}>
      <g transform="matrix(1,0,0,1,2.842170943040401e-14,2.842170943040401e-14)">
        <circle cx="180" cy="180" r="168" fill="#5b606c" />
        <circle cx="180" cy="180" r="144" fill="#3f424b" />
        <g fill="#fff">
          <path d="M238.742 193.241c-.255-.016-57.979 34.192-58.735 34.484-.17-.098-58.401-34.562-58.678-34.527.141.207 58.639 82.802 58.678 82.802.04 0 58.735-82.759 58.735-82.759z" />
          <path d="m180.035 84-58.516 97.867 58.516 34.662 58.517-34.662z" />
        </g>
      </g>
    </Svg>
  );
};

export default Icon;
