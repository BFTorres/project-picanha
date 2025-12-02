import { useTranslation } from "react-i18next"

export function AssetsFiatPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("assets.fiat.heading", "Assets – Fiat currencies")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "assets.fiat.body",
          "Placeholder page focusing on fiat currencies. Later, you can add tables, filters and detail views for EUR, USD, etc.",
        )}
      </p>
    </section>
  )
}