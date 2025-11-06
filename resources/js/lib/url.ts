export function getUrl(): URL {
  return new URL(window.location.href)
}

export function addSubPathToUrl(url: URL, subPath: string): string {
  url.pathname = url.pathname.replace(/\/+$/, '') + '/' + subPath.replace(/^\/+/, '')
  return url.pathname
}

export function addQueryToUrl(url: URL, query: string): string {
  const q = query?.replace(/^\?/, '') ?? ''
  if (!q) return url.pathname + url.search

  const params = new URLSearchParams(q)
  params.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  return url.pathname + url.search
}

export function encodeUrl(input: URL | string, absolute = false): string {
  const url = typeof input === 'string' ? new URL(input, window.location.origin) : input

  // Encode each path segment separately to avoid encoding '/'
  const encodedPath = url.pathname
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  // Encode query params (keys and values)
  const queryParts: string[] = []
  url.searchParams.forEach((value, key) => {
    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  })

  const search = queryParts.length ? `?${queryParts.join('&')}` : ''

  return absolute ? `${url.origin}${encodedPath}${search}` : `${encodedPath}${search}`
}

export function getQueryParam(param: string) {
  const url = new URL(window.location.href)
  return url.searchParams.get(param) ?? ''
}
