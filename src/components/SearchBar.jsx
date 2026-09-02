import { useTranslation } from 'react-i18next'

export default function SearchBar({ value, onChange, placeholder }) {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || t('search')}
        className="input-field pl-10 pr-12"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 text-lg p-1">
        🎤
      </button>
    </div>
  )
}
