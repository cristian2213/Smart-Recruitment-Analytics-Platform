export function getUrl(): URL {
  return new URL(window.location.href);
}

export function addSubPathToUrl(url: URL, subPath: string): string {
  url.pathname = url.pathname.replace(/\/+$/, '') + '/' + subPath.replace(/^\/+/, '');
  return url.pathname;
}
