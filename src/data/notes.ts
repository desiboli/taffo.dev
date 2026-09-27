export type NoteItem = {
  id: string
  href: string
  title: string
  description: string
  pubDate: string
  tags: string[]
}

export function getSortedNotes(items: readonly NoteItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.pubDate).valueOf() - new Date(a.pubDate).valueOf(),
  )
}

export function getAllNoteTags(items: readonly NoteItem[]) {
  const tags = new Set<string>()
  for (const item of items) {
    for (const tag of item.tags) {
      tags.add(tag)
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b))
}

export function formatNoteDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Map a content-collection entry to the client-safe note shape. */
export function toNoteItem(entry: {
  id: string
  data: {
    title: string
    description: string
    pubDate: Date
    tags?: string[]
  }
}): NoteItem {
  return {
    id: entry.id,
    href: `/notes/${entry.id}/`,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate.toISOString(),
    tags: entry.data.tags ?? [],
  }
}
