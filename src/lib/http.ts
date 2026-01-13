import axios from 'axios'
import { clearStoredAuth, getAuthHeaderValue, buildLoginRedirectPath } from './auth'

declare global {
  // eslint-disable-next-line no-var
  var __xcauditing_http_inited: boolean | undefined
}

function initAxiosAuthInterceptors() {
  if (globalThis.__xcauditing_http_inited) return
  globalThis.__xcauditing_http_inited = true

  axios.interceptors.request.use((config) => {
    const headerValue = getAuthHeaderValue()
    if (!headerValue) return config

    config.headers = config.headers ?? {}
    // don't override if caller explicitly set it
    if (!('Authorization' in config.headers)) {
      ;(config.headers as any).Authorization = headerValue
    }

    return config
  })

  axios.interceptors.response.use(
    (resp) => resp,
    (error) => {
      const status = error?.response?.status
      if (status === 401) {
        clearStoredAuth()

        // avoid infinite loop
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          const href = `${window.location.pathname}${window.location.search}${window.location.hash}`
          window.location.assign(buildLoginRedirectPath(href))
        }
      }

      return Promise.reject(error)
    },
  )
}

initAxiosAuthInterceptors()
