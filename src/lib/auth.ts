// 账户类型常量
export const ACCOUNT_TYPE = {
  ADMIN: 1,
  EMPLOYEE: 2,
} as const

export type AccountType = typeof ACCOUNT_TYPE[keyof typeof ACCOUNT_TYPE]

export type AuthToken = {
  token: string
  token_type: string
  expires_in?: number
  /**
   * ms timestamp
   */
  expires_at?: number
  username?: string
  account_type?: number
}

const AUTH_STORAGE_KEY = 'xcauditing.auth'

export function getStoredAuth(): AuthToken | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthToken
    if (!parsed?.token) return null
    return parsed
  } catch {
    return null
  }
}

export function setStoredAuth(token: AuthToken) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(token))
  } catch {
    // ignore
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function isAuthed(): boolean {
  const auth = getStoredAuth()
  if (!auth?.token) return false

  if (typeof auth.expires_at === 'number') {
    return Date.now() < auth.expires_at
  }

  return true
}

export function getAuthHeaderValue(): string | undefined {
  const auth = getStoredAuth()
  if (!auth?.token) return undefined
  const tokenType = auth.token_type || 'Bearer'
  return `${tokenType} ${auth.token}`
}

function base64UrlDecodeToString(input: string): string | undefined {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
    return atob(base64 + pad)
  } catch {
    return undefined
  }
}

function getJwtPayload(token: string): any | undefined {
  const parts = token.split('.')
  if (parts.length < 2) return undefined
  const payloadStr = base64UrlDecodeToString(parts[1]!)
  if (!payloadStr) return undefined
  try {
    return JSON.parse(payloadStr)
  } catch {
    return undefined
  }
}

export function getAuthedUsername(): string | undefined {
  const auth = getStoredAuth()
  if (!auth?.token) return undefined
  if (auth.username) return auth.username

  const payload = getJwtPayload(auth.token)
  const sub = payload?.sub
  return typeof sub === 'string' && sub ? sub : undefined
}

export function getAuthedAccountType(): number {
  const auth = getStoredAuth()
  if (!auth?.token) return ACCOUNT_TYPE.EMPLOYEE

  // 优先从存储的 auth 对象获取
  if (auth.account_type !== undefined) {
    return auth.account_type
  }

  // 从 JWT payload 获取
  const payload = getJwtPayload(auth.token)
  const accountType = payload?.account_type
  return typeof accountType === 'number' ? accountType : ACCOUNT_TYPE.EMPLOYEE
}

export function isAdmin(): boolean {
  return getAuthedAccountType() === ACCOUNT_TYPE.ADMIN
}

export function normalizeRedirectPath(input?: string): string | undefined {
  if (!input) return undefined

  // Only allow internal redirects
  if (!input.startsWith('/')) return undefined
  if (input.startsWith('//')) return undefined
  return input
}

export function buildLoginRedirectPath(currentHref: string): string {
  const redirectTo = normalizeRedirectPath(currentHref) ?? '/admin/reports'
  return `/login?redirect=${encodeURIComponent(redirectTo)}`
}
