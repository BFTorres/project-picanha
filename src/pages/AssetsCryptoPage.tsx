import { useTranslation } from "react-i18next"

export function AssetsCryptoPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("assets.crypto.heading", "Assets – Crypto")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "assets.crypto.body",
          "Placeholder page focusing on crypto assets. You can later filter, group or show details specifically for cryptocurrencies.",
        )}
      </p>
    </section>
  )
}