import { useEffect } from "react"

const giscusThemes = {
  light: "https://giscus.app/themes/noborder_light.css",
  dark: "https://giscus.app/themes/noborder_gray.css",
} as const

export const changeGiscusTheme = (theme: keyof typeof giscusThemes) => {
  const sendMessage = (config: unknown) => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    )

    iframe?.contentWindow?.postMessage({ giscus: config }, "https://giscus.app")
  }

  sendMessage({
    setConfig: {
      theme: giscusThemes[theme],
    },
  })
}

export const GiscusSection = (props: React.HTMLAttributes<HTMLElement>) => {
  useEffect(() => {
    const theme: keyof typeof giscusThemes =
      document.documentElement.classList.contains("dark") ? "dark" : "light"

    const giscusAttributes = {
      src: "https://giscus.app/client.js",
      "data-repo": "desiboli/taffo.dev",
      "data-repo-id": "R_kgDONMr-sw",
      "data-category": "Posts Comments",
      "data-category-id": "DIC_kwDONMr-s84CkHuc",
      "data-mapping": "url",
      "data-strict": "0",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-lang": "en",
      "data-loading": "lazy",
      "data-theme": giscusThemes[theme],
      crossorigin: "anonymous",
      async: "",
    }

    const giscusScript = document.createElement("script")
    Object.entries(giscusAttributes).forEach(([key, value]) =>
      giscusScript.setAttribute(key, value)
    )
    document.querySelector("#giscus")?.appendChild(giscusScript)
  }, [])

  return (
    <section {...props} style={{ minHeight: "372px" }} id="giscus"></section>
  )
}
