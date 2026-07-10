const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5253"

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

let accessToken: string | null = null
let refreshToken: string | null = null
let refreshPromise: Promise<boolean> | null = null

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", access)
    localStorage.setItem("refreshToken", refresh)
  }
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }
}

export function loadTokens() {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken")
    refreshToken = localStorage.getItem("refreshToken")
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) return false
    const data = await res.json()
    if (data.success) {
      setTokens(data.data.token, data.data.refreshToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  loadTokens()
  const { skipAuth, ...fetchOpts } = options
  const headers = new Headers(fetchOpts.headers as Record<string, string> || {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (!skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  let res = await fetch(url, { ...fetchOpts, headers })

  if (res.status === 401 && !skipAuth && refreshToken) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
    }
    const refreshed = await refreshPromise
    refreshPromise = null
    if (refreshed) {
      headers.set("Authorization", `Bearer ${accessToken}`)
      res = await fetch(url, { ...fetchOpts, headers })
    } else {
      clearTokens()
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
  }

  return res
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || "An error occurred")
  }
  return data
}

export const api = {
  get: <T>(path: string, options?: FetchOptions) =>
    fetchWithAuth(`${API_BASE}${path}`, { ...options, method: "GET" }).then(handleResponse<T>),

  post: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    fetchWithAuth(`${API_BASE}${path}`, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>),

  put: <T>(path: string, body?: unknown, options?: FetchOptions) =>
    fetchWithAuth(`${API_BASE}${path}`, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse<T>),

  delete: <T>(path: string, options?: FetchOptions) =>
    fetchWithAuth(`${API_BASE}${path}`, { ...options, method: "DELETE" }).then(handleResponse<T>),
}
