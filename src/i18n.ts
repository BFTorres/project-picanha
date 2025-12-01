import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  de: {
    translation: {
      appTitle: "Project Picanha",
      nav: {
        dashboard: "Dashboard",
        imprint: "Impressum",
      },
      dashboard: {
        heading: "Dashboard",
        description: "Spielwiese für React und API Experimente mit Coinbase.",
        coinbaseCardTitle: "Coinbase Wechselkurse (Basis: {{currency}})",
        coinbaseCardError: "Fehler beim Laden der Wechselkurse.",
        coinbaseCardLoading: "Lade Wechselkurse…",
      },
      settings: {
        heading: "Einstellungen & Barrierefreiheit",
        themeLabel: "Darstellung",
        themeLight: "Hell",
        themeDark: "Dunkel",
        themeContrast: "Kontrast (Demo)",
        fontSizeLabel: "Schriftgröße",
        fontFamilyLabel: "Schriftart",
        languageLabel: "Sprache",
      },
      imprint: {
        heading: "Impressum",
        body:
          "Dies ist eine rein fiktive Lernanwendung ohne Bezug zu echten Produkten oder Kundendaten.",
      },
    },
  },
  en: {
    translation: {
      appTitle: "Project Picanha",
      nav: {
        dashboard: "Dashboard",
        imprint: "Imprint",
      },
      dashboard: {
        heading: "Dashboard",
        description: "Playground for React and API experiments with Coinbase.",
        coinbaseCardTitle: "Coinbase exchange rates (base: {{currency}})",
        coinbaseCardError: "Failed to load exchange rates.",
        coinbaseCardLoading: "Loading exchange rates…",
      },
      settings: {
        heading: "Settings & Accessibility",
        themeLabel: "Theme",
        themeLight: "Light",
        themeDark: "Dark",
        themeContrast: "High contrast (demo)",
        fontSizeLabel: "Font size",
        fontFamilyLabel: "Font family",
        languageLabel: "Language",
      },
      imprint: {
        heading: "Imprint (Demo)",
        body:
          "This is a purely fictitious learning application with no relation to real products or customer data.",
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "de",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
