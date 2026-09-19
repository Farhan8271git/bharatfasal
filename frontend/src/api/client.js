const API_BASE_URL = '/api'

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const getAuthToken = () => {
  return sessionStorage.getItem('bf_auth_token')
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  const text = await response.text().catch(() => '')

  return text ? { message: text } : null
}

export const apiRequest = async (path, options = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    auth = true,
    signal,
  } = options

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body !== undefined && body !== null) {
    requestHeaders['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getAuthToken()

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      body:
        body !== undefined && body !== null
          ? JSON.stringify(body)
          : undefined,
      signal,
    })
  } catch {
    throw new ApiError(
      'Unable to connect to the server. Please try again.'
    )
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(
      data?.message || 'Something went wrong. Please try again.',
      response.status,
      data
    )
  }

  return data
}