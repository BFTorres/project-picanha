import { useTranslation } from "react-i18next"

export function LegalPrivacyPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("legal.privacy.heading", "Legal – Privacy")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "legal.privacy.body",
          "Placeholder page for a future data protection and privacy notice. In a real product, this would link to or include a full GDPR-compliant privacy policy.",
        )}
      </p>
    </section>
  )
}