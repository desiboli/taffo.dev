import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import {
  formatNoteDate,
  getAllNoteTags,
  getSortedNotes,
  type NoteItem,
} from "@/data/notes"

type NotesListProps = {
  items: readonly NoteItem[]
  sortItems?: boolean
  className?: string
  showTags?: boolean
  onTagClick?: (tag: string) => void
  activeTag?: string | null
  emptyMessage?: string
}

function NoteRow({
  item,
  showTags,
  onTagClick,
  activeTag,
}: {
  item: NoteItem
  showTags?: boolean
  onTagClick?: (tag: string) => void
  activeTag?: string | null
}) {
  return (
    <li className="min-w-0 transition-[filter,opacity] duration-300 group-hover/list:not-[&:hover]:blur-[1px] group-hover/list:not-[&:hover]:opacity-50">
      <a
        href={item.href}
        data-cuelume-hover="press"
        className="flex items-start justify-between gap-4 p-3 transition-colors hover:bg-muted"
      >
        <div className="min-w-0">
          <h3 className="font-sans text-base leading-snug text-foreground">
            {item.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 font-sans text-sm text-muted-foreground">
            {item.description}
          </p>
          {showTags && item.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5">
              {item.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  data-cuelume-hover="tick"
                  onClick={(e) => {
                    e.preventDefault()
                    onTagClick?.(tag)
                  }}
                  className={cn(
                    "font-sans text-[11px] text-muted-foreground/70 transition-colors hover:text-foreground",
                    activeTag === tag && "text-foreground",
                  )}
                >
                  #{tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <time
          dateTime={item.pubDate}
          className="shrink-0 pt-0.5 text-sm text-muted-foreground"
        >
          {formatNoteDate(item.pubDate)}
        </time>
      </a>
    </li>
  )
}

export function NotesList({
  items,
  sortItems = true,
  className,
  showTags = false,
  onTagClick,
  activeTag,
  emptyMessage = "No notes yet.",
}: NotesListProps) {
  const rows = sortItems ? getSortedNotes(items) : items

  if (rows.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <ul
      className={cn(
        "group/list -mx-2 mt-4 divide-y divide-dashed divide-muted-foreground/50",
        className,
      )}
    >
      {rows.map((item) => (
        <NoteRow
          key={item.id}
          item={item}
          showTags={showTags}
          onTagClick={onTagClick}
          activeTag={activeTag}
        />
      ))}
    </ul>
  )
}

type NotesExplorerProps = {
  items: readonly NoteItem[]
}

function matchesQuery(item: NoteItem, query: string) {
  const haystack = [item.title, item.description, ...item.tags]
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

export function NotesExplorer({ items }: NotesExplorerProps) {
  const [query, setQuery] = React.useState("")
  const [activeTag, setActiveTag] = React.useState<string | null>(null)
  const tags = React.useMemo(() => getAllNoteTags(items), [items])
  const normalized = query.trim().toLowerCase()
  const isFiltering = Boolean(normalized || activeTag)

  React.useEffect(() => {
    setActiveTag(new URLSearchParams(window.location.search).get("tag"))
  }, [])

  function setTag(tag: string | null) {
    setActiveTag(tag)

    const params = new URLSearchParams(window.location.search)
    if (tag) {
      params.set("tag", tag)
    } else {
      params.delete("tag")
    }
    const next = params.toString()
    const url = next
      ? `${window.location.pathname}?${next}`
      : window.location.pathname
    window.history.replaceState(null, "", url)
  }

  const filtered = items.filter((item) => {
    if (activeTag && !item.tags.includes(activeTag)) return false
    if (normalized && !matchesQuery(item, normalized)) return false
    return true
  })

  function toggleTag(tag: string) {
    setTag(activeTag === tag ? null : tag)
  }

  if (items.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">No notes yet.</p>
    )
  }

  return (
    <div className="min-w-0">
      <div className="relative mt-6">
        <IconSearch
          size={16}
          stroke={1.5}
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes or tags…"
          aria-label="Search notes"
          className="pl-9"
          autoComplete="off"
        />
      </div>

      {tags.length > 0 ? (
        <div
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1"
          role="group"
          aria-label="Filter by tag"
        >
          <button
            type="button"
            data-cuelume-hover="tick"
            onClick={() => setTag(null)}
            className={cn(
              "font-sans text-xs transition-colors",
              activeTag === null
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              data-cuelume-hover="tick"
              onClick={() => toggleTag(tag)}
              className={cn(
                "font-sans text-xs transition-colors",
                activeTag === tag
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}

      <NotesList
        items={filtered}
        showTags
        activeTag={activeTag}
        onTagClick={toggleTag}
        emptyMessage={isFiltering ? "No notes match." : "No notes yet."}
      />
    </div>
  )
}
