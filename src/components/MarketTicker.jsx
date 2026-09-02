import { useEffect, useState } from 'react'

export default function MarketTicker() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mandi-prices')

        if (!response.ok) {
          throw new Error('Failed to fetch mandi prices')
        }

        const data = await response.json()

        setPrices(data.records || [])
      } catch (error) {
        console.error('Market ticker error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  if (loading) {
    return (
      <div className="w-full bg-white border-y border-gray-200 h-12 flex items-center px-4">
        <span className="text-sm text-gray-500">
          Loading market prices...
        </span>
      </div>
    )
  }

  if (!prices.length) {
    return null
  }

  return (
    <div className="w-full overflow-hidden bg-white border-y border-gray-200">
      <div className="flex items-center h-12">

        {/* Fixed Label */}
        <div className="hidden sm:flex shrink-0 items-center h-full px-5 bg-primary-50 border-r border-primary-100">
          <span className="text-xs font-bold text-primary-700 whitespace-nowrap">
            MARKET PRICES
          </span>
        </div>

        {/* Moving Ticker */}
        <div className="flex-1 overflow-hidden">

          <div className="ticker-track flex w-max">

            {/* First Set */}
            <div className="flex shrink-0">
              {prices.map((item, index) => (
                <MarketItem
                  key={`first-${index}`}
                  item={item}
                />
              ))}
            </div>

            {/* Duplicate Set */}
            <div className="flex shrink-0">
              {prices.map((item, index) => (
                <MarketItem
                  key={`second-${index}`}
                  item={item}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

function MarketItem({ item }) {
  const price = Number(item.modal_price || 0)

  return (
    <div className="flex items-center px-5 whitespace-nowrap">

      <span className="text-sm font-semibold text-gray-800">
        {item.commodity}
      </span>

      <span className="mx-2 text-gray-400">
        —
      </span>

      <span className="text-sm font-bold text-gray-900">
        ₹{price.toLocaleString('en-IN')}/q
      </span>

      <span className="mx-3 text-gray-300">
        |
      </span>

      <span className="text-xs text-gray-500">
        {item.market}
      </span>

    </div>
  )
}