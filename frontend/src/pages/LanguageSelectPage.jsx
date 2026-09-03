import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sprout, ArrowRight, Volume2 } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'

export default function LanguageSelectPage({ onComplete }) {
  const { i18n } = useTranslation()
  const [selected, setSelected] = useState(i18n.language)

  const handleLanguageSelect = (lang) => {
    setSelected(lang)
    i18n.changeLanguage(lang)
  }

  const speakInstruction = () => {
    if (!('speechSynthesis' in window)) return

    const text =
      selected === 'hi'
        ? 'अपनी भाषा चुनें और आगे बढ़ें'
        : 'Select your language and continue'

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = selected === 'hi' ? 'hi-IN' : 'en-IN'
    speech.rate = 0.85

    window.speechSynthesis.speak(speech)
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-8 sm:px-6">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85')",
        }}
      />
{/* Dark transparent overlay */}
<div className="absolute inset-0 bg-black/35" />

{/* Green tint */}
<div className="absolute inset-0 bg-primary-950/20" />

{/* Soft gradient for readability */}
<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl">

        {/* Brand */}
        <div className="text-center text-white mb-6 sm:mb-8">

          <div className="mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/95 flex items-center justify-center shadow-xl">
            <Sprout
              size={38}
              strokeWidth={1.8}
              className="text-primary-700"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            भारत फसल
          </h1>

          <p className="text-lg sm:text-xl font-medium mt-1 text-white/90">
            Bharat Fasal
          </p>

          <p className="text-white/90 text-base sm:text-lg mt-3">
            अपनी भाषा चुनें
          </p>

          <p className="text-white/75 text-sm mt-1">
            Select the language you are most comfortable with
          </p>

        </div>

        {/* Language Card */}
       <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-4 sm:p-7">

          <LanguageSelector
            selectedLang={selected}
            onSelect={handleLanguageSelect}
          />

          {/* Voice Assistance */}
          <div className="flex justify-center mt-5">

            <button
              type="button"
              onClick={speakInstruction}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-700 transition-colors text-sm font-medium"
            >
              <Volume2 size={17} />
              <span>सुनकर समझें / Listen</span>
            </button>

          </div>

          {/* Continue Button */}
          <button
            onClick={onComplete}
            className="w-full mt-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-xl py-4 px-5 flex items-center justify-center gap-3 text-lg font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <span>आगे बढ़ें</span>

            <span className="text-white/75">
              Continue
            </span>

            <ArrowRight size={21} />
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-white/70 mt-5">
          Bharat Fasal · Digital agriculture marketplace
        </p>

      </div>
    </div>
  )
}