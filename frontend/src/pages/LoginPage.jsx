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
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function LoginPage({ onLogin }) {
  const { t, i18n } = useTranslation()

  // ================================
  // FORM STATES
  // ================================

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const [userType, setUserType] = useState('farmer')

  // Buyer / FPO only
  const [companyName, setCompanyName] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    setError('')
  }

  // ================================
  // LOGIN
  // ================================

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')

    // Name
    if (name.trim().length < 2) {
      setError('Please enter your name.')
      return
    }

    // Mobile
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setError('Please enter a valid 10 digit mobile number.')
      return
    }

    // Company / FPO
    if (
      (userType === 'buyer' || userType === 'fpo') &&
      companyName.trim().length < 2
    ) {
      setError(
        userType === 'buyer'
          ? 'Please enter your company / organization name.'
          : 'Please enter your FPO / organization name.'
      )
      return
    }

    // Password
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      // login request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phone,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed.')
        return
      }

      // save JWT
      localStorage.setItem('bf_token', data.token)

      // save safe user data
      localStorage.setItem(
        'bf_registered_user',
        JSON.stringify(data.user)
      )

      // existing App login flow
      onLogin(data.user.role, data.user)
    } catch (error) {
      console.error('Login error:', error)
      setError(
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
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
          ? 'अपना नाम, मोबाइल नंबर और पासवर्ड डालकर लॉगिन करें।'
          : 'Enter your name, mobile number and password to login.',
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

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-900">
              {t('login')}
            </h2>

            <p className="text-gray-500 mt-1 text-sm">
              Login with your mobile number and password
            </p>

          </div>

          {/* ROLE */}

          <div className="grid grid-cols-3 gap-3 mb-6">

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

          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* NAME */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('name')}
              </label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder={t('name')}
                autoComplete="name"
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
                  name="companyName"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value)
                    setError('')
                  }}
                  placeholder={
                    userType === 'buyer'
                      ? 'Enter company / organization name'
                      : 'Enter FPO / organization name'
                  }
                  autoComplete="organization"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />

              </div>
            )}

            {/* PHONE */}

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {t('phone_number')}
              </label>

              <div className="flex gap-2">

                <div className="h-12 px-3 flex items-center bg-white/80 border border-gray-200 rounded-xl text-gray-700 font-semibold">
                  +91
                </div>

                <input
                  type="tel"
                  name="mobile"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10)
                    )
                    setError('')
                  }}
                  placeholder={t('enter_phone')}
                  autoComplete="tel"
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  maxLength={10}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mb-2">

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 bg-white/80 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end mb-4">

              <button
                type="button"
                onClick={() => {
                  window.location.href = '/forgot-password'
                }}
                className="text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                Forgot Password?
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >

              {loading ? (
                'Logging in...'
              ) : (
                <>
                  {t('login')}
                  <ArrowRight size={19} />
                </>
              )}

            </button>

          </form>

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

        </div>

        <p className="text-center text-xs text-white/75 mt-5">
          Bharat Fasal · Digital agriculture marketplace
        </p>

      </div>

    </div>
  )
}