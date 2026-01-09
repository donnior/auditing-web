// 统一管理 TanStack Router 的 search 参数编解码策略：
// - 不做 JSON 编码/解码（避免出现 staff=%222%22 这种带引号的 URL）
// - 不做类型推断（避免 "2" 被解析成 number）

export type SearchValue = string | string[] | undefined
export type SearchRecord = Record<string, SearchValue>

export function parseSearch(searchStr: string): SearchRecord {
  const raw = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr
  const params = new URLSearchParams(raw)
  const out: SearchRecord = {}

  for (const [key, value] of params.entries()) {
    const prev = out[key]
    if (prev === undefined) {
      out[key] = value
    } else if (Array.isArray(prev)) {
      prev.push(value)
      out[key] = prev
    } else {
      out[key] = [prev, value]
    }
  }

  return out
}

export function stringifySearch(search: SearchRecord): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(search ?? {})) {
    if (value === undefined) continue

    if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, String(v))
      }
    } else {
      params.set(key, String(value))
    }
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}
