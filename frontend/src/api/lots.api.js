import { apiRequest } from './client'

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

export const getLots = async ({
  commodity,
  status = 'listed',
  page = 1,
  limit = 20,
} = {}) => {
  const queryString = buildQueryString({
    commodity,
    status,
    page,
    limit,
  })

  return apiRequest(`/lots${queryString}`, {
    method: 'GET',
    auth: false,
  })
}

export const getMyLots = async ({
  status,
  page = 1,
  limit = 20,
} = {}) => {
  const queryString = buildQueryString({
    status,
    page,
    limit,
  })

  return apiRequest(`/lots/my${queryString}`, {
    method: 'GET',
    auth: true,
  })
}

export const getLotById = async (lotId) => {
  return apiRequest(`/lots/${encodeURIComponent(lotId)}`, {
    method: 'GET',
    auth: false,
  })
}

export const createLot = async (payload) => {
  return apiRequest('/lots', {
    method: 'POST',
    auth: true,
    body: payload,
  })
}

export const updateLot = async (lotId, payload) => {
  return apiRequest(`/lots/${encodeURIComponent(lotId)}`, {
    method: 'PATCH',
    auth: true,
    body: payload,
  })
}

export const cancelLot = async (lotId) => {
  return apiRequest(`/lots/${encodeURIComponent(lotId)}`, {
    method: 'DELETE',
    auth: true,
  })
}