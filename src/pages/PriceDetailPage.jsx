import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TrendChart from '../components/TrendChart'
import { mandiPrices } from '../data/mockPrices'
import { commodities } from '../data/mockCommodities'
import { formatCurrency, getChangeColor, getChangeIcon } from '../utils/formatters'

export default function PriceDetailPage() {
  const { commodityId } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const commodity = commodities.find(c => c.id === commodityId)
  const prices = mandiPrices.filter(p => p.commodityId === commodityId)
  const bestPrice = prices.reduce((max, p) => p.price > max.price ? p : max, prices[0])

  if (!commodity || prices.length === 0) {
    return <div className="text-center py-12"><p>{t('no_results')}</p></div>
  }

  return (
    <div className="space-y-4">
      <button onClick={() => navigate('/prices')} className="text-primary-600 font-semibold flex items-center gap-1">
        ← {t('back')}
      </button>

      {/* Commodity Header */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{commodity.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{t(commodityId)}</h2>
            {commodity.msp && (
              <span className="badge badge-yellow">{t('msp')}: {formatCurrency(commodity.msp)}</span>
            )}
          </div>
        </div>

        {/* Best Price Highlight */}
        <div className="bg-primary-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-primary-600 font-semibold">{t('todays_best_price')}</p>
          <p className="text-3xl font-bold text-primary-700">{formatCurrency(bestPrice.price)}</p>
          <p className="text-sm text-gray-600">{bestPrice.mandi}</p>
        </div>

        {/* Trend Chart */}
        <h3 className="font-bold mb-2">{t('price_trend')} - {t('last_30_days')}</h3>
        <TrendChart data={bestPrice.trend} height={200} />
      </div>

      {/* Sale Recommendation */}
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="font-bold text-green-800">{t('sale_recommendation')}</h3>
            <p className="text-green-700 text-sm">
              {bestPrice.change > 2 ? t('sell_now') + ' - ' + t('price_rising') : t('hold') + ' - ' + t('price_stable')}
            </p>
          </div>
        </div>
      </div>

      {/* Compare Mandis */}
      <div>
        <h3 className="text-lg font-bold mb-3">{t('compare_mandis')}</h3>
        <div className="space-y-2">
          {prices.sort((a, b) => b.price - a.price).map((price, i) => (
            <div key={i} className={`card flex items-center justify-between ${i === 0 ? 'border-primary-300 bg-primary-50/50' : ''}`}>
              <div>
                <p className="font-semibold">{price.mandi}</p>
                <p className="text-xs text-gray-500">{price.state} · {price.arrival}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{formatCurrency(price.price)}</p>
                <p className={`text-sm ${getChangeColor(price.change)}`}>
                  {getChangeIcon(price.change)} {Math.abs(price.change)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => navigate('/lots')} className="btn-primary w-full">
        📦 {t('create_lot')}
      </button>
    </div>
  )
}
