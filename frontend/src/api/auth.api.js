import { apiRequest } from './client'

export const registerUser = async (payload) => {
  return apiRequest('/auth/register', {
    method: 'POST',
    auth: false,
    body: payload,
  })
}

export const loginUser = async ({ mobile, password }) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: {
      mobile,
      password,
    },
  })
}

export const getCurrentUser = async () => {
  return apiRequest('/auth/me', {
    method: 'GET',
    auth: true,
  })
}

export const logoutUser = async () => {
  return apiRequest('/auth/logout', {
    method: 'POST',
    auth: true,
  })
}