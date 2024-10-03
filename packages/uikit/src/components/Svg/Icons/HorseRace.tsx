import * as React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 196.285 196.285" {...props}>
      <g>
        <path
          d="M38.228,155.075c-26.554-39.188-7.814-69.794-7.814-69.794c-4.354-1.289-18.279,7.837-18.279,7.837
          c7.832-28.702,50.91-53.087,50.91-53.087c-4.782-1.75-18.273,1.726-18.273,1.726c35.243-33.919,78.326-21.306,78.326-21.306
          C124.398,13.048,145.73,0,145.73,0c-2.182,2.161-3.062,13.926-3.062,13.926c2.176-3.922,9.15-7.837,9.15-7.837
          c-3.913,9.126,0,28.703,0,28.703c11.312,11.322,23.927,50.49,23.927,50.49l4.8,6.96c6.094,8.715,3.854,22.417-2.182,25.667
          c-22.62,12.212-24.808-10.001-24.808-10.001c-18.713-2.176-32.639-23.07-32.639-23.07c-25.23,13.051-11.178,49.869-0.284,64.007
          c13.997,18.123,3.748,47.44,3.748,47.44S64.448,193.803,38.228,155.075z"
        ></path>
      </g>
    </Svg>
  );
};

export default Icon;
