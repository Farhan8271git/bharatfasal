import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../utils/constants'

export default function LanguageSelector({ onSelect, selectedLang }) {
  const { i18n } = useTranslation()
  const currentLang = selectedLang || i18n.language

  const handleSelect = (code) => {
    i18n.changeLanguage(code)

    const lang = LANGUAGES.find(l => l.code === code)

    if (lang) {
      document.documentElement.setAttribute('dir', lang.dir)
      document.documentElement.setAttribute('lang', code)
    }

    if (onSelect) onSelect(code)
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleSelect(lang.code)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 min-h-[90px] flex flex-col items-center justify-center ${
            currentLang === lang.code
              ? 'border-primary-500 bg-primary-50/90 shadow-md ring-2 ring-primary-200'
              : 'border-gray-200/80 bg-white/75 backdrop-blur-sm hover:border-primary-300 hover:bg-primary-50/70'
          }`}
        >
          {/* Language name */}
          <span className="text-lg font-semibold text-gray-900">
            {lang.name}
          </span>

          {/* English name */}
          <span className="text-sm text-gray-500 mt-1">
            {lang.english}
          </span>
        </button>
      ))}
    </div>
  )
}