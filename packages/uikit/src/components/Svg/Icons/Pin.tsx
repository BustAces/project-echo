import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => (
  <Svg viewBox="0 0 512 512" {...props}>
    <g>
      <g>
        <path
          d="M399.292,267.208c-15.747-29.813-40.315-55.432-69.275-73.206l-8.746-67.596c25.003-19.539,41.396-49.624,41.396-83.74
              C362.667,13.354,307.375,0,256,0S149.333,13.354,149.333,42.667c0,34.118,16.395,64.204,41.401,83.743l-8.772,67.612
              c-28.947,17.758-53.506,43.361-69.254,73.186c-6.729,12.719-7.896,28.198-3.229,42.448c4.271,13.031,13.146,23.604,24.323,29.021
              c33.534,16.259,71.794,21.91,102.813,23.444L245.354,502c0.354,5.625,5.01,10,10.646,10c5.635,0,10.292-4.375,10.646-10
              l8.74-139.879c31.018-1.534,69.277-7.184,102.802-23.434c11.188-5.427,20.063-16,24.333-29.031
              C407.187,295.406,406.021,279.927,399.292,267.208z"
        />
      </g>
    </g>
  </Svg>
);

export default Icon;