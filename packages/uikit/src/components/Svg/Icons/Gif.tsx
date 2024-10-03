import React from "react";
import Svg from "../Svg"; // Ensure this points to your Svg component file
import { SvgProps } from "../types"; // Ensure this points to your types file

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 512 512" {...props}>
      <g>
        <g>
          <g>
            <path
              d="M146.286,146.286H36.571C14.629,146.286,0,164.571,0,182.857v146.286c0,18.286,14.629,36.571,36.571,36.571h109.714
                c21.943,0,36.571-18.286,36.571-36.571V256H128v54.857H54.857V201.143h128v-18.286
                C182.857,164.571,168.229,146.286,146.286,146.286z"
            />
            <polygon
              points="512,201.143 512,146.286 347.429,146.286 347.429,365.714 402.286,365.714 402.286,292.571 475.429,292.571 
                475.429,237.714 402.286,237.714 402.286,201.143"
            />
            <rect x="237.714" y="146.286" width="54.857" height="219.429" />
          </g>
        </g>
      </g>
    </Svg>
  );
};

export default Icon;
