import axios from 'axios'

export type LoginRequest = {
  username: string
  password: string
}

export type LoginToken = {
  expires_in: number
  token: string
  token_type: string
}

export type LoginResponse = {
  success: boolean
  data?: LoginToken
  message?: string
}

export async function login(req: LoginRequest): Promise<LoginToken> {
  const response = await axios.post<LoginResponse>('/auditing-api/auth/login', req)
  const payload = response.data

  if (!payload?.success || !payload.data?.token) {
    throw new Error(payload?.message || '登录失败')
  }

  return payload.data
}
