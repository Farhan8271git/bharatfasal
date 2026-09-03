export const buyers = [
  { id: 1, name: 'Farhan Agro Fresh Ltd.', type: 'processor', rating: 4.5, verified: true, location: 'Ahmedabad, Gujarat', distance: 45, commodities: ['wheat', 'rice', 'maize'], totalTransactions: 1250, avgPaymentDays: 3, avatar: '🏭' },
  { id: 2, name: 'Abuzer Agri Business', type: 'institutional', rating: 4.8, verified: true, location: 'Hyderabad, Telangana', distance: 120, commodities: ['wheat', 'soybean', 'cotton'], totalTransactions: 3400, avgPaymentDays: 2, avatar: '🏢' },
  { id: 3, name: 'Siddiqui Traders', type: 'trader', rating: 4.2, verified: true, location: 'Indore, MP', distance: 25, commodities: ['soybean', 'wheat', 'chana'], totalTransactions: 890, avgPaymentDays: 5, avatar: '🤝' },
  { id: 4, name: 'UP Agro Industries', type: 'processor', rating: 4.0, verified: true, location: 'Pune, Maharashtra', distance: 85, commodities: ['onion', 'tomato', 'potato'], totalTransactions: 670, avgPaymentDays: 7, avatar: '🏭' },
  { id: 5, name: 'Bharat Idustries', type: 'institutional', rating: 4.6, verified: true, location: 'Ludhiana, Punjab', distance: 60, commodities: ['wheat', 'rice', 'bajra'], totalTransactions: 2100, avgPaymentDays: 4, avatar: '🏛️' },
  { id: 6, name: 'Spice Board of India', type: 'institutional', rating: 4.9, verified: true, location: 'Kochi, Kerala', distance: 200, commodities: ['turmeric', 'mustard'], totalTransactions: 450, avgPaymentDays: 10, avatar: '🏛️' },
  { id: 7, name: 'Fash pvt.ltd', type: 'trader', rating: 3.8, verified: false, location: 'Nagpur, Maharashtra', distance: 35, commodities: ['cotton', 'soybean'], totalTransactions: 340, avgPaymentDays: 8, avatar: '🤝' },
  { id: 8, name: 'Arsh pvt.ltd', type: 'institutional', rating: 4.7, verified: true, location: 'Delhi NCR', distance: 15, commodities: ['potato', 'onion', 'tomato'], totalTransactions: 5600, avgPaymentDays: 2, avatar: '🏢' },
]

export const demandBoard = [
  { buyerId: 1, commodityId: 'wheat', quantity: '500 quintals', grade: 'Grade A', priceOffered: 2500, deadline: '2026-09-15', status: 'active' },
  { buyerId: 2, commodityId: 'soybean', quantity: '200 quintals', grade: 'Grade A', priceOffered: 5200, deadline: '2026-09-10', status: 'active' },
  { buyerId: 3, commodityId: 'chana', quantity: '100 quintals', grade: 'Grade B', priceOffered: 5500, deadline: '2026-09-20', status: 'active' },
  { buyerId: 4, commodityId: 'onion', quantity: '300 quintals', grade: 'Grade A', priceOffered: 2000, deadline: '2026-09-05', status: 'urgent' },
  { buyerId: 8, commodityId: 'tomato', quantity: '150 quintals', grade: 'Grade A', priceOffered: 3300, deadline: '2026-09-08', status: 'active' },
  { buyerId: 5, commodityId: 'wheat', quantity: '1000 quintals', grade: 'Grade A', priceOffered: 2480, deadline: '2026-09-25', status: 'active' },
]
