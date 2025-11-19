export function titleShortener(title: string, length: number = 20) {
  return title.length > length ? title.substring(0, length) + '...' : title
}
