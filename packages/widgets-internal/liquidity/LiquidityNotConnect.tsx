import { useTranslation } from "@kazama-defi/localization";
import { Text } from "@kazama-defi/uikit";

export function LiquidityNotConnect() {
  const { t } = useTranslation();

  return (
    <Text color="textSubtle" textAlign="center">
      {t("Connect to a wallet to view your liquidity.")}
    </Text>
  );
}
