import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
    }),
})

const bookmarks = defineCollection({
  // One YAML file per bookmark — drop a new file to add an entry.
  loader: glob({ base: "./src/content/bookmarks", pattern: "**/*.{yml,yaml}" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    shortDescription: z.string().optional(),
    href: z.string().url(),
    domain: z.string().optional(),
    /** Logo under `/public`, e.g. `/bookmarks/cursor.webp` */
    imageSrc: z.string().optional(),
    /** Fallback letter when no imageSrc */
    letter: z.string().max(2).optional(),
    /** Tailwind color class for letter fallback */
    color: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Set `false` (or remove) when ready to publish. */
    draft: z.boolean().default(false),
  }),
})

const notes = defineCollection({
  // Short snippets or longer code notes — Markdown / MDX under `src/content/notes/`.
  loader: glob({ base: "./src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Set `false` (or remove) when ready to publish. */
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog, bookmarks, notes }
