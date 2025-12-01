import React from "react"
import { useTranslation } from "react-i18next"

export const ImprintPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="imprint-heading"
      className="max-w-2xl space-y-3 text-sm"
    >
      <h1 id="imprint-heading" className="text-xl font-semibold">
        {t("imprint.heading")}
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        {t("imprint.body")}
      </p>
      <p className="text-slate-400 dark:text-slate-500">
        Keine Speicherung von personenbezogenen Daten, keine Cookies, keine
        Trackingtools. Die dargestellten Kurse stammen aus der öffentlichen
        Coinbase-API und dienen ausschließlich Lernzwecken.
      </p>
    </section>
  )
}
