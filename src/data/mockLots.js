export const myLots = [
  { id: 'LOT-001', commodityId: 'wheat', quantity: 50, grade: 'Grade A', expectedPrice: 2500, status: 'listed', createdAt: '2026-08-25', offers: [
    { buyerId: 1, buyerName: 'Abuzer  Agri Business', price: 2450, quantity: 50, timestamp: '2026-08-27' },
    { buyerId: 3, buyerName: 'UP Agro Industries', price: 2420, quantity: 50, timestamp: '2026-08-28' },
  ]},
  { id: 'LOT-002', commodityId: 'soybean', quantity: 30, grade: 'Grade A', expectedPrice: 5200, status: 'offered', createdAt: '2026-08-20', offers: [
    { buyerId: 2, buyerName: 'ITC Limited', price: 5150, quantity: 30, timestamp: '2026-08-22' },
  ]},
  { id: 'LOT-003', commodityId: 'onion', quantity: 100, grade: 'Grade B', expectedPrice: 1900, status: 'sold', createdAt: '2026-08-10', offers: [], soldTo: 'Mother Dairy', soldPrice: 1850, soldDate: '2026-08-15' },
  { id: 'LOT-004', commodityId: 'cotton', quantity: 20, grade: 'Grade A', expectedPrice: 7400, status: 'draft', createdAt: '2026-08-30', offers: [] },
]
