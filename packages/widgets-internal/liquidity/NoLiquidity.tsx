import { useTranslation } from "@kazama-defi/localization";
import { Text } from "@kazama-defi/uikit";

export function NoLiquidity() {
  const { t } = useTranslation();

  return (
    <Text color="textSubtle" textAlign="center">
      {t("No liquidity found.")}
    </Text>
  );
}
