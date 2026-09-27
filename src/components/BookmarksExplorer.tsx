import * as React from "react"
import { IconSearch } from "@tabler/icons-react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"
import {
  getAllBookmarkTags,
  getDomain,
  getSortedBookmarks,
  type BookmarkItem,
} from "@/data/bookmarks"

type BookmarkLinksListProps = {
  items: readonly BookmarkItem[]
  sortItems?: boolean
  className?: string
  showTags?: boolean
  onTagClick?: (tag: string) => void
  activeTag?: string | null
  emptyMessage?: string
}

function ListIcon({ item }: { item: BookmarkItem }) {
  const letterColor = item.color ?? "text-muted-foreground"
  const letter = item.letter ?? item.name.charAt(0)

  return (
    <div className="flex size-5 shrink-0 items-center justify-center overflow-hidden">
      {item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt=""
          width={20}
          height={20}
          className="size-5 rounded object-contain"
          loading="lazy"
        />
      ) : (
        <span
          className={cn(
            "font-sans text-[16px] font-semibold leading-none",
            letterColor,
          )}
        >
          {letter}
        </span>
      )}
    </div>
  )
}

function ListRow({
  item,
  showTags,
  onTagClick,
  activeTag,
}: {
  item: BookmarkItem
  showTags?: boolean
  onTagClick?: (tag: string) => void
  activeTag?: string | null
}) {
  const domain = item.domain ?? getDomain(item.href)
  const mobileDescription = item.shortDescription ?? item.description
  const tags = item.tags

  return (
    <li className="min-w-0">
      <div className="min-w-0">
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cuelume-hover="press"
          className="group flex min-w-0 items-center gap-2.5 py-0.5 max-[499px]:gap-2"
        >
          <ListIcon item={item} />
          <div className="flex min-w-0 flex-1 items-center gap-3 max-[499px]:gap-2">
            <p className="hidden min-w-0 flex-1 truncate font-sans text-sm leading-snug min-[500px]:block">
              <span className="font-semibold text-foreground group-hover:text-foreground/80">
                {item.name}
              </span>
              <span className="text-muted-foreground/40"> / </span>
              <span className="text-muted-foreground">{item.description}</span>
            </p>

            <div className="flex min-w-0 flex-1 items-baseline overflow-hidden min-[500px]:hidden">
              <span className="shrink-0 font-sans text-xs font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                {item.name}
              </span>
              <span className="shrink-0 px-1 font-sans text-xs text-muted-foreground/40">
                /
              </span>
              <span className="min-w-0 truncate font-sans text-xs leading-snug text-muted-foreground">
                {mobileDescription}
              </span>
            </div>

            <span className="shrink-0 font-mono text-sm text-muted-foreground/70 group-hover:text-muted-foreground max-[499px]:text-[11px]">
              {domain}
            </span>
          </div>
        </a>

        {showTags && tags.length > 0 ? (
          <div className="mt-1 ml-7.5 flex flex-wrap gap-x-2 gap-y-0.5 max-[499px]:ml-7">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                data-cuelume-hover="tick"
                onClick={() => onTagClick?.(tag)}
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
    </li>
  )
}

export function BookmarkLinksList({
  items,
  sortItems = true,
  className,
  showTags = false,
  onTagClick,
  activeTag,
  emptyMessage = "No bookmarks yet.",
}: BookmarkLinksListProps) {
  const rows = sortItems ? getSortedBookmarks(items) : items

  if (rows.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
    )
  }

  return (
    <ul
      className={cn(
        "mt-4 flex min-w-0 flex-col gap-2.5 max-[499px]:overflow-hidden",
        className,
      )}
    >
      {rows.map((item) => (
        <ListRow
          key={`${item.name}-${item.href}`}
          item={item}
          showTags={showTags}
          onTagClick={onTagClick}
          activeTag={activeTag}
        />
      ))}
    </ul>
  )
}

type BookmarksExplorerProps = {
  items: readonly BookmarkItem[]
}

function matchesQuery(item: BookmarkItem, query: string) {
  const haystack = [
    item.name,
    item.description,
    item.shortDescription,
    item.domain ?? getDomain(item.href),
    ...item.tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

export function BookmarksExplorer({ items }: BookmarksExplorerProps) {
  const [query, setQuery] = React.useState("")
  const [activeTag, setActiveTag] = React.useState<string | null>(null)
  const tags = React.useMemo(() => getAllBookmarkTags(items), [items])
  const normalized = query.trim().toLowerCase()
  const isFiltering = Boolean(normalized || activeTag)

  const filtered = items.filter((item) => {
    if (activeTag && !item.tags.includes(activeTag)) return false
    if (normalized && !matchesQuery(item, normalized)) return false
    return true
  })

  function toggleTag(tag: string) {
    setActiveTag((current) => (current === tag ? null : tag))
  }

  if (items.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">No bookmarks yet.</p>
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
          placeholder="Search bookmarks or tags…"
          aria-label="Search bookmarks"
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
            onClick={() => setActiveTag(null)}
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

      <BookmarkLinksList
        items={filtered}
        showTags
        activeTag={activeTag}
        onTagClick={toggleTag}
        emptyMessage={
          isFiltering ? "No bookmarks match." : "No bookmarks yet."
        }
      />
    </div>
  )
}
