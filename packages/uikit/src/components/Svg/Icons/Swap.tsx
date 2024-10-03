import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg width="16" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.42942 4.4874H6.46107L4.50392 13.4588L2.54678 4.4874H0.57843L4.50392 0L8.42942 4.4874Z" />
      <path d="M8.14901 9.81265L10.1174 9.81265L12.0745 0.84121L14.0316 9.81265L16 9.81265L12.0745 14.3L8.14901 9.81265Z" />
    </Svg>
  );
};

export default Icon;
