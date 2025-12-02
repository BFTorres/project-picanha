import i18n from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  de: {
    translation: {
      appTitle: "Project Picanha",
      nav: {
        dashboard: "Datenübersicht",
        information: "Vermögenswerte",
        accessibility: "Barrierefreiheit",
        imprint: "Impressum",
      },
      common: {
        loading: "Lädt…",
        errorPrefix: "Fehler:",
      },
      dashboard: {
        heading: "Dashboard",
        description: "Spielwiese für React- und API-Experimente mit Coinbase.",
        coinbaseCardTitle: "Coinbase-Wechselkurse (Basis: {{currency}})",
        coinbaseCardError: "Fehler beim Laden der Wechselkurse.",
        coinbaseCardLoading: "Lade Wechselkurse…",
        priceChart: {
          ariaLabel: "Kursdiagramm",
          title: "Ausgewählter Vermögenswert",
          subtitle:
            "Simulierte Intraday-Kurse auf Basis des aktuellen Coinbase-Kurses.",
          selectPlaceholder: "Symbol",
          noData: "Für dieses Symbol sind keine Daten verfügbar.",
          chartAria:
            "Liniendiagramm mit simulierten Intraday-Kursbewegungen.",
          currentLabel: "Aktueller Kurs",
          changeLabel: "Veränderung über den Zeitraum",
        },
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
      accessibility: {
        title: "Barrierefreiheit & Darstellung",
        subtitle:
          "Passe Darstellung, Typografie, Bewegung und Sprache an, um die Oberfläche angenehmer und zugänglicher zu machen.",

        // Language
        languageTitle: "Sprache",
        languageDescription:
          "Wechselt die Sprache der Benutzeroberfläche. Betrifft alle Beschriftungen und Inhalte.",
        languageHint:
          "Wir aktualisieren auch das Sprachattribut (lang) der Seite, um Screenreader besser zu unterstützen.",

        // Theme & contrast
        themeTitle: "Theme & Kontrast",
        themeDescription:
          "Wähle ein Theme, das für deine Augen gut funktioniert. Kontraststarke Varianten verbessern die Lesbarkeit.",
        themeLight: "Hell",
        themeLightDesc: "Standard-Theme mit hellem Hintergrund.",
        themeDark: "Dunkel",
        themeDarkDesc: "Dunkles Theme für Umgebungen mit wenig Licht.",
        themeContrast: "Hoher Kontrast (dunkel)",
        themeContrastDesc:
          "Stärkerer Kontrast auf dunklem Hintergrund, hilfreich bei geringer Sehkraft.",
        themeContrastLight: "Hoher Kontrast (hell)",
        themeContrastLightDesc:
          "Stärkerer Kontrast auf hellem Hintergrund, z. B. für gut beleuchtete Bildschirme.",

        // Typography
        typographyTitle: "Typografie",
        typographyDescription:
          "Steuere Schriftgröße, Schriftart und Zeilenabstand. Diese Einstellungen betreffen sowohl Text als auch Zahlen.",
        fontSizeLabel: "Schriftgröße",
        fontSizeSmall: "Klein",
        fontSizeMedium: "Mittel",
        fontSizeLarge: "Groß",
        fontFamilyLabel: "Schriftart",
        fontFamilySans: "Serifenlos",
        fontFamilySerif: "Serif",
        fontFamilyMono: "Monospace",
        fontFamilyHighLegibility: "Gut lesbar",

        lineHeightLabel: "Zeilenabstand",
        lineHeightNormal: "Normal",
        lineHeightRelaxed: "Entspannt",
        lineHeightLoose: "Groß",

        // Interaction & focus
        interactionTitle: "Interaktion & Fokus",
        interactionDescription:
          "Steuere Bewegung, Linkdarstellung, Fokusrahmen und Überschriften, um die Bedienung zu erleichtern.",
        reducedMotionLabel: "Bewegung reduzieren",
        reducedMotionDesc:
          "Reduziert Animationen und Übergänge. Hilfreich, wenn dich Bewegungen ablenken oder belasten.",
        highVisLinksLabel: "Alle Links unterstreichen",
        highVisLinksDesc:
          "Links werden durchgängig unterstrichen und besser hervorgehoben – nicht nur durch Farbe.",
        strongFocusLabel: "Starker Fokusrahmen",
        strongFocusDesc:
          "Verwendet einen deutlich sichtbaren Fokusrahmen, damit du den Tastaturfokus leichter findest.",
        highlightHeadingsLabel: "Überschriften hervorheben",
        highlightHeadingsDesc:
          "Fügt Überschriften einen dezenten Hintergrund und eine Markierung hinzu, um Abschnitte leichter zu scannen.",
      },
      imprint: {
        heading: "Impressum",
        body: "Dies ist eine rein fiktive Lernanwendung ohne Bezug zu echten Produkten oder Kundendaten.",
      },
      information: {
        heading: "Vermögenswerte",
        subtitle:
          "Öffentliche Coinbase-Daten zu Krypto- und Fiat-Währungen. Nur zu Demo- und Übungszwecken.",
      },
      watchlist: {
        heading: "Watchlist",
        empty: "Noch keine Symbole in der Watchlist.",
      },
    },
  },
  en: {
    translation: {
      appTitle: "Project Picanha",
      nav: {
        dashboard: "Dashboard",
        information: "Assets",
        accessibility: "Accessibility",
        imprint: "Imprint",
      },
      common: {
        loading: "Loading…",
        errorPrefix: "Error:",
      },
      dashboard: {
        heading: "Dashboard",
        description:
          "Playground for React and API experiments with Coinbase.",
        coinbaseCardTitle: "Coinbase exchange rates (base: {{currency}})",
        coinbaseCardError: "Failed to load exchange rates.",
        coinbaseCardLoading: "Loading exchange rates…",
        priceChart: {
          ariaLabel: "Price chart",
          title: "Selected asset",
          subtitle: "Mock intraday series based on current Coinbase rate.",
          selectPlaceholder: "Symbol",
          noData: "No data available for this symbol.",
          chartAria: "Line chart of simulated intraday price movements.",
          currentLabel: "Current price",
          changeLabel: "Change over period",
        },
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
      accessibility: {
        title: "Accessibility & display settings",
        subtitle:
          "Adjust theme, typography, motion and language to make the interface more comfortable and accessible.",

        // Language
        languageTitle: "Language",
        languageDescription:
          "Switch the interface language. This affects all labels and content in the app.",
        languageHint:
          "We also update the page language (lang attribute) to support assistive technologies.",

        // Theme & contrast
        themeTitle: "Theme & contrast",
        themeDescription:
          "Choose a theme that works best for your eyes. High-contrast modes improve legibility.",
        themeLight: "Light",
        themeLightDesc: "Standard light theme.",
        themeDark: "Dark",
        themeDarkDesc: "Dark theme for low-light environments.",
        themeContrast: "High contrast (dark)",
        themeContrastDesc:
          "Stronger contrast on a dark background, helpful for low vision.",
        themeContrastLight: "High contrast (light)",
        themeContrastLightDesc:
          "Stronger contrast on a light background, e.g. for bright displays.",

        // Typography
        typographyTitle: "Typography",
        typographyDescription:
          "Control font size, typeface and line spacing. These settings affect both text and numbers.",
        fontSizeLabel: "Font size",
        fontSizeSmall: "Small",
        fontSizeMedium: "Medium",
        fontSizeLarge: "Large",
        fontFamilyLabel: "Font family",
        fontFamilySans: "Sans-serif",
        fontFamilySerif: "Serif",
        fontFamilyMono: "Monospace",
        fontFamilyHighLegibility: "High-legibility",

        lineHeightLabel: "Line spacing",
        lineHeightNormal: "Normal",
        lineHeightRelaxed: "Relaxed",
        lineHeightLoose: "Loose",

        // Interaction & focus
        interactionTitle: "Interaction & focus",
        interactionDescription:
          "Control motion, link appearance, focus outlines and headings to better suit your needs.",
        reducedMotionLabel: "Reduce motion",
        reducedMotionDesc:
          "Minimise animations and transitions. Useful if motion is distracting or uncomfortable.",
        highVisLinksLabel: "Underline all links",
        highVisLinksDesc:
          "Always underline links and increase their visibility, not only through color.",
        strongFocusLabel: "Strong focus outline",
        strongFocusDesc:
          "Use a thicker focus outline to better see where the keyboard focus currently is.",
        highlightHeadingsLabel: "Highlight headings",
        highlightHeadingsDesc:
          "Add a subtle background and marker to headings to make sections easier to scan.",
      },
      imprint: {
        heading: "Imprint (Demo)",
        body: "This is a purely fictitious learning application with no relation to real products or customer data.",
      },
      information: {
        heading: "Assets",
        subtitle:
          "Public Coinbase data for crypto and fiat currencies. For demo and practice purposes only.",
      },
      watchlist: {
        heading: "Watchlist",
        empty: "No symbols in the watchlist yet.",
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
