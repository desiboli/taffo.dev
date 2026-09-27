// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Mustafa Alshammaa"
export const SITE_DESCRIPTION =
  "Product-minded software engineer with 10+ years of experience building high-quality, impactful digital experiences."
export const SITE_NAME = "taffo.dev"
export const SITE_AUTHOR = "Mustafa Alshammaa"
export const SITE_LOCALE = "en_US"
/** Default Open Graph / Twitter share image (public path) */
export const SITE_OG_IMAGE = "/taffo-dev-cover.jpg"
export const SITE_OG_IMAGE_WIDTH = 960
export const SITE_OG_IMAGE_HEIGHT = 480
export const SITE_OG_IMAGE_ALT = "Mustafa Alshammaa — taffo.dev"

export const SITE_SAME_AS = [
  "https://github.com/desiboli",
  "https://www.linkedin.com/in/mustafa-alshammaa/",
] as const

export const PAGE_SEO = {
  home: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  about: {
    title: `About | ${SITE_TITLE}`,
    description:
      "Born and raised in Stockholm — partner, dad of two, Real Madrid fan, and product-minded software engineer.",
  },
  blog: {
    title: `Writing | ${SITE_TITLE}`,
    description:
      "Essays and notes on software craft, product thinking, and building with intention.",
  },
  notes: {
    title: `Notes | ${SITE_TITLE}`,
    description:
      "Working snippets, patterns, and code notes I want to find again.",
  },
  bookmarks: {
    title: `Bookmarks | ${SITE_TITLE}`,
    description:
      "Tools, docs, and references that earn a spot on the shelf.",
  },
} as const
