export function getMusinsaUrl(keyword: string): string {
  return `https://www.musinsa.com/search/musinsa/goods?q=${encodeURIComponent(keyword)}&gender=female`;
}

export function getZigzagUrl(keyword: string): string {
  return `https://zigzag.kr/search?query=${encodeURIComponent(keyword)}`;
}

export function getWConceptUrl(keyword: string): string {
  return `https://www.wconcept.co.kr/Search?keyword=${encodeURIComponent(keyword)}`;
}
