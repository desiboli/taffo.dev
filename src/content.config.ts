import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const snippets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/snippets" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean(),
  }),
})

export const collections = {
  snippets,
}
