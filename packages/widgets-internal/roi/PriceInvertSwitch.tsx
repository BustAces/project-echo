import { Currency } from "@kazama-defi/sdk";
import { memo } from "react";
import { useTranslation } from "@kazama-defi/localization";
import { styled } from "styled-components";

import { Flex, Text, Button, SyncAltIcon } from "@kazama-defi/uikit";

const StyledButton = styled(Button)`
  border-radius: 8px;
  padding: 0 0.5em;
  font-size: 12px;
`;

interface Props {
  baseCurrency?: Currency;
  onSwitch?: () => void;
}

export const PriceInvertSwitch = memo(function PriceInvertSwitch({ baseCurrency, onSwitch }: Props) {
  const { t } = useTranslation();

  if (!baseCurrency) {
    return null;
  }

  return (
    <Flex justifyContent="flex-end" alignItems="center" mb="0.5em">
      <Text mr="0.5em" color="textSubtle" fontSize="14px">
        {t("View prices in")}
      </Text>
      <StyledButton
        variant="secondary"
        scale="sm"
        onClick={onSwitch}
        startIcon={<SyncAltIcon color="primary" width="14px" />}
      >
        {baseCurrency.symbol}
      </StyledButton>
    </Flex>
  );
});
