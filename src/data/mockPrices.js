const generateTrend = (base, days = 30) => {
  const trend = []
  let price = base
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    price = price + (Math.random() - 0.48) * (base * 0.02)
    price = Math.max(base * 0.85, Math.min(base * 1.15, price))
    trend.push({ date: date.toISOString().split('T')[0], price: Math.round(price) })
  }
  return trend
}

export const mandiPrices = [
  { commodityId: 'wheat', mandi: 'Azadpur Mandi, Delhi', state: 'Delhi', price: 2450, change: 2.3, trend: generateTrend(2400), arrival: '1,250 quintals' },
  { commodityId: 'wheat', mandi: 'Indore Mandi, MP', state: 'Madhya Pradesh', price: 2380, change: -1.1, trend: generateTrend(2350), arrival: '3,400 quintals' },
  { commodityId: 'wheat', mandi: 'Karnal Mandi, Haryana', state: 'Haryana', price: 2420, change: 1.5, trend: generateTrend(2380), arrival: '2,100 quintals' },
  { commodityId: 'rice', mandi: 'Azadpur Mandi, Delhi', state: 'Delhi', price: 2350, change: 0.8, trend: generateTrend(2300), arrival: '890 quintals' },
  { commodityId: 'rice', mandi: 'Kolkata Mandi', state: 'West Bengal', price: 2280, change: -0.5, trend: generateTrend(2250), arrival: '1,800 quintals' },
  { commodityId: 'cotton', mandi: 'Rajkot Mandi, Gujarat', state: 'Gujarat', price: 7350, change: 3.2, trend: generateTrend(7200), arrival: '560 quintals' },
  { commodityId: 'cotton', mandi: 'Nagpur Mandi, Maharashtra', state: 'Maharashtra', price: 7180, change: 1.8, trend: generateTrend(7100), arrival: '920 quintals' },
  { commodityId: 'soybean', mandi: 'Indore Mandi, MP', state: 'Madhya Pradesh', price: 5100, change: 4.5, trend: generateTrend(4900), arrival: '2,300 quintals' },
  { commodityId: 'maize', mandi: 'Davangere Mandi, Karnataka', state: 'Karnataka', price: 2200, change: 1.2, trend: generateTrend(2150), arrival: '1,100 quintals' },
  { commodityId: 'onion', mandi: 'Lasalgaon Mandi, Maharashtra', state: 'Maharashtra', price: 1850, change: -5.2, trend: generateTrend(1900), arrival: '4,500 quintals' },
  { commodityId: 'onion', mandi: 'Azadpur Mandi, Delhi', state: 'Delhi', price: 2100, change: -3.1, trend: generateTrend(2050), arrival: '2,800 quintals' },
  { commodityId: 'potato', mandi: 'Agra Mandi, UP', state: 'Uttar Pradesh', price: 1200, change: 2.1, trend: generateTrend(1180), arrival: '3,200 quintals' },
  { commodityId: 'tomato', mandi: 'Kolar Mandi, Karnataka', state: 'Karnataka', price: 3200, change: 8.5, trend: generateTrend(3000), arrival: '1,600 quintals' },
  { commodityId: 'mustard', mandi: 'Jaipur Mandi, Rajasthan', state: 'Rajasthan', price: 5800, change: 1.9, trend: generateTrend(5700), arrival: '780 quintals' },
  { commodityId: 'sugarcane', mandi: 'Muzaffarnagar, UP', state: 'Uttar Pradesh', price: 350, change: 0.3, trend: generateTrend(340), arrival: '5,000 quintals' },
  { commodityId: 'chana', mandi: 'Indore Mandi, MP', state: 'Madhya Pradesh', price: 5600, change: 2.8, trend: generateTrend(5500), arrival: '1,400 quintals' },
  { commodityId: 'turmeric', mandi: 'Erode Mandi, Tamil Nadu', state: 'Tamil Nadu', price: 15200, change: 5.1, trend: generateTrend(14800), arrival: '320 quintals' },
  { commodityId: 'groundnut', mandi: 'Rajkot Mandi, Gujarat', state: 'Gujarat', price: 6500, change: 0.9, trend: generateTrend(6450), arrival: '670 quintals' },
]

export const priceAlerts = [
  { commodityId: 'tomato', message: 'Tomato prices surged 8.5% at Kolar Mandi', type: 'up', time: '2 hours ago' },
  { commodityId: 'onion', message: 'Onion prices dropped 5.2% at Lasalgaon', type: 'down', time: '4 hours ago' },
  { commodityId: 'soybean', message: 'Soybean crossed MSP at Indore Mandi', type: 'up', time: '6 hours ago' },
  { commodityId: 'wheat', message: 'Wheat prices stable at Karnal Mandi', type: 'stable', time: '1 day ago' },
]
