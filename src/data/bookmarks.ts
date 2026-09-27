export type BookmarkItem = {
  name: string
  description: string
  shortDescription?: string
  href: string
  domain?: string
  imageSrc?: string
  letter?: string
  color?: string
  tags: string[]
  featured: boolean
}

export function getDomain(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return href
  }
}

export function getSortedBookmarks(items: readonly BookmarkItem[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

export function getAllBookmarkTags(items: readonly BookmarkItem[]) {
  const tags = new Set<string>()
  for (const item of items) {
    for (const tag of item.tags) {
      tags.add(tag)
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b))
}

/** Map a content-collection entry to the client-safe bookmark shape. */
export function toBookmarkItem(data: {
  name: string
  description: string
  shortDescription?: string
  href: string
  domain?: string
  imageSrc?: string
  letter?: string
  color?: string
  tags?: string[]
  featured?: boolean
}): BookmarkItem {
  return {
    name: data.name,
    description: data.description,
    shortDescription: data.shortDescription,
    href: data.href,
    domain: data.domain,
    imageSrc: data.imageSrc,
    letter: data.letter ?? data.name.charAt(0),
    color: data.color,
    tags: data.tags ?? [],
    featured: data.featured ?? false,
  }
}
