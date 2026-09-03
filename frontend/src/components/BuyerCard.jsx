import { useTranslation } from 'react-i18next'
import { formatNumber } from '../utils/formatters'

export default function BuyerCard({ buyer }) {
  const { t } = useTranslation()

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{buyer.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{buyer.name}</h3>
            {buyer.verified && (
              <span className="badge badge-green text-xs">✅ {t('verified')}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{buyer.location}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>⭐ {buyer.rating}</span>
            <span>📍 {buyer.distance} {t('km_away')}</span>
            <span>🔄 {formatNumber(buyer.totalTransactions)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {buyer.commodities.map(c => (
              <span key={c} className="badge badge-blue text-xs">{t(c)}</span>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button className="btn-primary text-sm py-2 px-4">{t('contact_buyer')}</button>
            <button className="btn-secondary text-sm py-2 px-4">{t('negotiate')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
