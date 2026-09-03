export const warehouses = [
  { id: 1, name: 'Central Warehouse Corporation', type: 'godown', location: 'Sector 5, Industrial Area', distance: 8, capacity: 5000, available: 2300, ratePerQuintal: 15, rating: 4.3, icon: '🏗️' },
  { id: 2, name: 'National Cold Storage', type: 'cold_storage', location: 'NH-44, Bypass Road', distance: 12, capacity: 2000, available: 800, ratePerQuintal: 35, rating: 4.6, icon: '❄️' },
  { id: 3, name: 'FPO Warehouse - Kisaan Sewa', type: 'godown', location: 'Village Road, Block B', distance: 3, capacity: 800, available: 450, ratePerQuintal: 10, rating: 4.0, icon: '🏗️' },
  { id: 4, name: 'Agri Cold Chain Pvt Ltd', type: 'cold_storage', location: 'APMC Market Yard', distance: 15, capacity: 3000, available: 1200, ratePerQuintal: 40, rating: 4.7, icon: '❄️' },
]

export const transportOptions = [
  { id: 1, vehicleType: 'Mini Truck (1 ton)', icon: '🚛', capacity: 10, pricePerKm: 18, available: true, driver: 'Sunil Kumar', phone: '98XXXXXXXX', rating: 4.2 },
  { id: 2, vehicleType: 'Truck (5 ton)', icon: '🚚', capacity: 50, pricePerKm: 35, available: true, driver: 'Rajesh Singh', phone: '97XXXXXXXX', rating: 4.5 },
  { id: 3, vehicleType: 'Truck (10 ton)', icon: '🚛', capacity: 100, pricePerKm: 55, available: false, driver: 'Manoj Yadav', phone: '96XXXXXXXX', rating: 4.1 },
  { id: 4, vehicleType: 'Tractor Trolley', icon: '🚜', capacity: 25, pricePerKm: 12, available: true, driver: 'Dinesh Patel', phone: '95XXXXXXXX', rating: 3.9 },
]

export const payments = [
  { id: 'TXN-001', buyerName: 'Farhan Agro Fresh Ltd', commodityId: 'onion', quantity: 100, amount: 185000, status: 'paid', date: '2026-08-15', paidDate: '2026-08-17' },
  { id: 'TXN-002', buyerName: 'Abuzer Agri Business', commodityId: 'soybean', quantity: 30, amount: 154500, status: 'pending', date: '2026-08-22', expectedDate: '2026-08-30' },
  { id: 'TXN-003', buyerName: 'Siddiqui Traders', commodityId: 'wheat', quantity: 25, amount: 60500, status: 'overdue', date: '2026-08-01', expectedDate: '2026-08-10' },
  { id: 'TXN-004', buyerName: 'Fash pvt.ltd', commodityId: 'wheat', quantity: 50, amount: 122500, status: 'paid', date: '2026-07-20', paidDate: '2026-07-23' },
  { id: 'TXN-005', buyerName: 'Bharat Idustries', commodityId: 'rice', quantity: 40, amount: 92000, status: 'pending', date: '2026-08-28', expectedDate: '2026-09-05' },
]

export const disputes = [
  { id: 'DSP-001', transactionId: 'TXN-003', buyerName: 'Siddiqui Traders', type: 'payment_issue', description: 'Payment overdue by 20 days', status: 'in_progress', filedDate: '2026-08-20', updates: [
    { date: '2026-08-20', message: 'Dispute filed', status: 'open' },
    { date: '2026-08-22', message: 'Buyer contacted by platform', status: 'in_progress' },
  ]},
  { id: 'DSP-002', transactionId: 'TXN-001', buyerName: 'Abuzer Agri Business', type: 'quality_dispute', description: 'Buyer claimed quality mismatch on 10 quintals', status: 'resolved', filedDate: '2026-08-16', updates: [
    { date: '2026-08-16', message: 'Dispute filed', status: 'open' },
    { date: '2026-08-17', message: 'Quality inspection ordered', status: 'in_progress' },
    { date: '2026-08-19', message: 'Resolved in farmer favor - full payment confirmed', status: 'resolved' },
  ]},
]
