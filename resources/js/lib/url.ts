export function getUrl(): URL {
  return new URL(window.location.href);
}

export function addSubPathToUrl(url: URL, subPath: string): string {
  url.pathname = url.pathname.replace(/\/+$/, '') + '/' + subPath.replace(/^\/+/, '');
  return url.pathname;
}

export function addQueryToUrl(url: URL, query: string): string {
  const q = query?.replace(/^\?/, '') ?? '';
  if (!q) return url.pathname + url.search;

  const params = new URLSearchParams(q);
  params.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  return url.pathname + url.search;
}
