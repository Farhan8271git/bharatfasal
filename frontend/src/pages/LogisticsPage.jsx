import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { warehouses, transportOptions } from '../data/mockLogistics'
import { formatCurrency } from '../utils/formatters'

export default function LogisticsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('storage')
  const [calcQty, setCalcQty] = useState(50)
  const [calcDays, setCalcDays] = useState(30)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">🚚 {t('logistics')}</h2>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border-2 border-gray-200">
        <button onClick={() => setTab('storage')} className={`flex-1 py-3 font-semibold ${tab === 'storage' ? 'bg-primary-600 text-white' : 'bg-white'}`}>
          🏗️ {t('nearby_warehouses')}
        </button>
        <button onClick={() => setTab('transport')} className={`flex-1 py-3 font-semibold ${tab === 'transport' ? 'bg-primary-600 text-white' : 'bg-white'}`}>
          🚛 {t('transport')}
        </button>
      </div>

      {tab === 'storage' && (
        <>
          {/* Storage Calculator */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="font-bold mb-3">🧮 {t('storage_calculator')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold">{t('quintals')}</label>
                <input type="number" value={calcQty} onChange={(e) => setCalcQty(+e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-semibold">{t('days')}</label>
                <input type="number" value={calcDays} onChange={(e) => setCalcDays(+e.target.value)} className="input-field" />
              </div>
            </div>
            <p className="mt-3 text-lg font-bold text-blue-800">{t('estimated_cost')}: {formatCurrency(calcQty * 15 * calcDays / 30)}</p>
          </div>

          {/* Warehouses */}
          <div className="space-y-3">
            {warehouses.map(wh => (
              <div key={wh.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{wh.icon}</span>
                      <div>
                        <h3 className="font-bold">{wh.name}</h3>
                        <p className="text-sm text-gray-500">{wh.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>📍 {wh.distance} {t('km_away')}</span>
                      <span>⭐ {wh.rating}</span>
                      <span>📦 {wh.available}/{wh.capacity} {t('quintals')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{wh.ratePerQuintal}</p>
                    <p className="text-xs text-gray-500">{t('per_quintal')}/month</p>
                    <button className="btn-primary text-sm py-1.5 px-3 mt-2">{t('book_now')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'transport' && (
        <div className="space-y-3">
          {transportOptions.map(tr => (
            <div key={tr.id} className={`card ${!tr.available ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tr.icon}</span>
                    <div>
                      <h3 className="font-bold">{tr.vehicleType}</h3>
                      <p className="text-sm text-gray-500">🧑 {tr.driver} · ⭐ {tr.rating}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>📦 {t('capacity')}: {tr.capacity} {t('quintals')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{tr.pricePerKm}/km</p>
                  <span className={`badge ${tr.available ? 'badge-green' : 'badge-red'} mt-1`}>
                    {tr.available ? '✅ Available' : '❌ Busy'}
                  </span>
                  {tr.available && <button className="btn-primary text-sm py-1.5 px-3 mt-2 block">{t('book_now')}</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
