export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'good_morning'
  if (hour < 17) return 'good_afternoon'
  return 'good_evening'
}

export const getChangeColor = (change) => {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-500'
}

export const getChangeIcon = (change) => {
  if (change > 0) return '📈'
  if (change < 0) return '📉'
  return '➡️'
}

export const getStatusColor = (status) => {
  const colors = {
    draft: 'badge-yellow',
    listed: 'badge-blue',
    offered: 'badge-green',
    sold: 'badge-green',
    paid: 'badge-green',
    pending: 'badge-yellow',
    overdue: 'badge-red',
    open: 'badge-red',
    in_progress: 'badge-yellow',
    resolved: 'badge-green',
    active: 'badge-blue',
    urgent: 'badge-red',
  }
  return colors[status] || 'badge-blue'
}
