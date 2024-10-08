import { styled, DefaultTheme } from "styled-components";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, typography, layout } from "styled-system";
import getThemeValue from "../../util/getThemeValue";
import { TextProps } from "./types";

interface ThemedProps extends TextProps {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(theme, `colors.${color}`, color);
};

const Text = styled.div
  .attrs<TextProps>((props) => {
    const title =
      typeof props.title !== "undefined"
        ? props.title
        : props.ellipsis && typeof props.children === "string"
        ? props.children
        : undefined;
    return {
      ...props,
      title,
    };
  })
  .withConfig({
    shouldForwardProp,
  })<TextProps>`
  color: ${getColor};
  line-height: 1.5;
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}

  ${({ small }) => small && `font-size: 13px;`}
`;

Text.defaultProps = {
  color: "text",
  small: false,
  fontSize: "15px",
  ellipsis: false,
};

export default Text;
