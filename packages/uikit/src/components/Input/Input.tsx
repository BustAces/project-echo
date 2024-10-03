import { styled, DefaultTheme } from "styled-components";
import { InputProps, scales } from "./types";

interface StyledInputProps extends InputProps {
  theme: DefaultTheme;
}

/**
 * Priority: Warning --> Success
 */
const getBoxShadow = ({ isSuccess = false, isWarning = false, theme }: StyledInputProps) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  if (isSuccess) {
    return theme.shadows.success;
  }

  return theme.shadows.inset;
};

const getHeight = ({ scale = scales.MD }: StyledInputProps) => {
  switch (scale) {
    case scales.SM:
      return "32px";
    case scales.LG:
      return "48px";
    case scales.MD:
    default:
      return "40px";
  }
};

const Input = styled("input").withConfig({
  shouldForwardProp: (props) => !["scale", "isSuccess", "isWarning"].includes(props),
})<InputProps>`
  flex-grow: 2;
  -webkit-box-align: center;
  align-items: center;
  min-height: 37px;
  width: 100%;
  padding: 6px 5px 6px 15px;
  border-radius: 0.25rem;
  background: #1a1e23;
  position: relative;
  height: auto;
  color: #fff;
  font-family: Industry-Black;
  font-size: 13px;
  border: 1px solid rgba(0, 0, 0, 0.157);

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;

Input.defaultProps = {
  scale: scales.MD,
  isSuccess: false,
  isWarning: false,
};

export default Input;
