import { useTranslation } from "react-i18next"

export function LegalTermsPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("legal.terms.heading", "Legal – Terms & conditions")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "legal.terms.body",
          "Placeholder page for future terms & conditions or contract details. For now, it only serves as a demo route.",
        )}
      </p>
    </section>
  )
}