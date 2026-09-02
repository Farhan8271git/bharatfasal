import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sprout,
  UserRound,
  Building2,
  Handshake,
  ShieldCheck,
  Volume2,
  ArrowRight,
  Globe,
} from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const { t, i18n } = useTranslation()

  // ================================
  // FORM STATES
  // ================================

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [userType, setUserType] = useState('farmer')

  // Buyer / FPO only
  const [companyName, setCompanyName] = useState('')

  const currentLanguage = i18n.language

  // ================================
  // LANGUAGE
  // ================================

  const handleLanguageChange = (e) => {
    const lang = e.target.value

    i18n.changeLanguage(lang)

    document.documentElement.setAttribute(
      'dir',
      lang === 'ur' ? 'rtl' : 'ltr'
    )

    document.documentElement.setAttribute('lang', lang)
  }

  // ================================
  // ROLE CHANGE
  // ================================

  const handleUserTypeChange = (type) => {
    setUserType(type)

    // Never carry organization name
    // from one role to another.
    setCompanyName('')
  }

  // ================================
  // SEND OTP
  // ================================

  const handleSendOtp = () => {
    if (name.trim().length < 2) {
      alert('Please enter your name')
      return
    }

    if (phone.length !== 10) {
      alert('Please enter a valid 10 digit mobile number')
      return
    }

    // Company name is required only
    // for Buyer and FPO.
    if (
      (userType === 'buyer' || userType === 'fpo') &&
      companyName.trim().length < 2
    ) {
      alert(
        userType === 'buyer'
          ? 'Please enter your company / organization name'
          : 'Please enter your FPO / organization name'
      )
      return
    }

    setOtpSent(true)
    setOtp('')
  }

  // ================================
  // VERIFY OTP
  // ================================

  const handleVerify = () => {
    if (otp.length !== 4) {
      alert('Please enter 4 digit OTP')
      return
    }

    if (name.trim().length < 2) {
      alert('Please enter your name')
      return
    }

    if (phone.length !== 10) {
      alert('Please enter a valid 10 digit mobile number')
      return
    }

    if (
      (userType === 'buyer' || userType === 'fpo') &&
      companyName.trim().length < 2
    ) {
      alert(
        userType === 'buyer'
          ? 'Please enter your company / organization name'
          : 'Please enter your FPO / organization name'
      )
      return
    }

    const user = {
      id: `${userType}-${Date.now()}`,

      name: name.trim(),

      // Only Buyer and FPO get organization name.
      companyName:
        userType === 'buyer' || userType === 'fpo'
          ? companyName.trim()
          : '',

      email: '',

      role: userType,

      location: '',

      phone,
    }

    console.log('LOGIN USER:', user)

    onLogin(userType, user)
  }

  // ================================
  // VOICE
  // ================================

  const speak = () => {
    if (!('speechSynthesis' in window)) return

    const languageVoiceMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      ur: 'ur-PK',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      pa: 'pa-IN',
      hinglish: 'en-IN',
    }

    const voiceLanguage =
      languageVoiceMap[currentLanguage] || 'hi-IN'

    const text = t('login_instruction', {
      defaultValue:
        currentLanguage === 'hi'
          ? 'अपना नाम और मोबाइल नंबर डालें। फिर ओटीपी से लॉगिन करें।'
          : 'Enter your name and mobile number. Then login using OTP.',
    })

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = voiceLanguage
    speech.rate = 0.85

    window.speechSynthesis.speak(speech)
  }

  // ================================
  // ROLES
  // ================================

  const roles = [
    {
      id: 'farmer',
      icon: UserRound,
      label: t('farmer'),
    },
    {
      id: 'fpo',
      icon: Building2,
      label: t('fpo'),
    },
    {
      id: 'buyer',
      icon: Handshake,
      label: t('buyer_marketplace', {
        defaultValue: 'Buyer',
      }),
    },
    {
      id: 'admin',
      icon: ShieldCheck,
      label: t('admin', {
        defaultValue: 'Admin',
      }),
    },
  ]

  const needsOrganizationName =
    userType === 'buyer' || userType === 'fpo'

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-8">

      {/* ================================
          LANGUAGE
      ================================= */}

      <div className="absolute top-5 right-5 z-30">
        <div className="relative">

          <Globe
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-700 pointer-events-none"
          />

          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="appearance-none bg-white/90 backdrop-blur-md border border-white/70 text-gray-700 rounded-xl pl-9 pr-9 py-2.5 text-sm font-semibold shadow-lg outline-none cursor-pointer hover:bg-white transition"
          >
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
            <option value="ur">اردو</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="bn">বাংলা</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="pa">ਪੰਜਾਬੀ</option>
            <option value="hinglish">Hinglish</option>
          </select>

        </div>
      </div>

      {/* ================================
          BACKGROUND
      ================================= */}

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-primary-950/15" />

      {/* ================================
          MAIN
      ================================= */}

      <div className="relative z-10 w-full max-w-md">

        {/* BRAND */}

        <div className="text-center text-white mb-6">

          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-xl mb-4">

            <Sprout
              size={36}
              strokeWidth={1.8}
              className="text-primary-700"
            />

          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {t('app_name')}
          </h1>

          <p className="text-white/85 mt-1">
            {t('tagline')}
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-5 sm:p-7">

          {!otpSent ? (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-900">
                  {t('login')}
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  {t('phone_number')}
                </p>

              </div>

              {/* ROLE */}

              <div className="grid grid-cols-2 gap-3 mb-6">

                {roles.map((role) => {

                  const Icon = role.icon
                  const active = userType === role.id

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() =>
                        handleUserTypeChange(role.id)
                      }
                      className={`min-h-[88px] rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        active
                          ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md'
                          : 'border-gray-200 bg-white/70 text-gray-600 hover:border-primary-300 hover:bg-primary-50/50'
                      }`}
                    >

                      <Icon
                        size={25}
                        strokeWidth={1.8}
                        className="mb-2"
                      />

                      <span className="font-semibold text-sm">
                        {role.label}
                      </span>

                    </button>
                  )
                })}

              </div>

              {/* NAME */}

              <div className="mb-4">

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t('name')}
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('name')}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />

              </div>

              {/* COMPANY / FPO */}

              {needsOrganizationName && (
                <div className="mb-4">

                  <label className="block text-sm font-semibold text-gray-800 mb-2">

                    {userType === 'buyer'
                      ? 'Company / Organization Name'
                      : 'FPO / Organization Name'}

                  </label>

                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) =>
                      setCompanyName(e.target.value)
                    }
                    placeholder={
                      userType === 'buyer'
                        ? 'Enter company / organization name'
                        : 'Enter FPO / organization name'
                    }
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                </div>
              )}

              {/* PHONE */}

              <div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t('phone_number')}
                </label>

                <div className="flex gap-2">

                  <div className="h-12 px-3 flex items-center bg-white/80 border border-gray-200 rounded-xl text-gray-700 font-semibold">
                    +91
                  </div>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10)
                      )
                    }
                    placeholder={t('enter_phone')}
                    className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    maxLength={10}
                  />

                </div>

              </div>

              {/* SEND OTP */}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  name.trim().length < 2 ||
                  phone.length !== 10 ||
                  (needsOrganizationName &&
                    companyName.trim().length < 2)
                }
                className="w-full mt-5 h-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >

                {t('send_otp')}

                <ArrowRight size={19} />

              </button>

              {/* VOICE */}

              <button
                type="button"
                onClick={speak}
                className="w-full mt-3 h-10 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-white/60 flex items-center justify-center gap-2"
              >

                <Volume2 size={17} />

                {t('listen', {
                  defaultValue:
                    currentLanguage === 'hi'
                      ? 'सुनकर समझें'
                      : 'Listen to instructions',
                })}

              </button>

            </>
          ) : (

            <>

              <div className="text-center mb-6">

                <h2 className="text-2xl font-bold text-gray-900">
                  {t('enter_otp')}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {currentLanguage === 'hi'
                    ? `OTP +91 ${phone} पर भेजा गया`
                    : `OTP sent to +91 ${phone}`}
                </p>

              </div>

              {/* DEMO OTP */}

              {/* <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 mb-5 text-center"> */}

                {/* <p className="text-xs text-primary-600">
                  Demo OTP
                </p>

                <p className="text-xl font-bold tracking-[0.35em] text-primary-800">
                  1234
                </p> */}

              {/* </div> */}

              {/* OTP */}

              <div className="flex justify-center gap-2 mb-5">

                {[0, 1, 2, 3].map((i) => (

                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ''}
                    onChange={(e) => {

                      const val =
                        e.target.value.replace(/\D/g, '')

                      const newOtp = otp.split('')

                      newOtp[i] = val

                      setOtp(newOtp.join(''))

                      if (val && i < 3) {
                        document
                          .getElementById(`otp-${i + 1}`)
                          ?.focus()
                      }

                    }}
                    className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-gray-200 bg-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />

                ))}

              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={otp.length !== 4}
                className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                {t('verify')}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                }}
                className="w-full mt-3 h-10 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded-lg"
              >
                ← {t('back')}
              </button>

            </>
          )}

        </div>

        <p className="text-center text-xs text-white/75 mt-5">
          Bharat Fasal · Digital agriculture marketplace
        </p>

      </div>

    </div>
  )
}