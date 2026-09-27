---
# Copy this file, rename it, then set draft: false when ready to publish.
title: "Debounce with AbortController"
description: "Cancel in-flight work when a newer call arrives — useful for search inputs and other rapid-fire async."
pubDate: 2026-09-26
tags:
  - javascript
  - patterns
draft: true
---

A small pattern I reach for when a user types faster than the network.

```ts
function debounceWithAbort<TArgs extends unknown[], TResult>(
  fn: (signal: AbortSignal, ...args: TArgs) => Promise<TResult>,
  wait = 300,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  return (...args: TArgs) =>
    new Promise<TResult>((resolve, reject) => {
      controller?.abort()
      controller = new AbortController()
      const { signal } = controller

      clearTimeout(timer)
      timer = setTimeout(async () => {
        try {
          resolve(await fn(signal, ...args))
        } catch (error) {
          if (signal.aborted) return
          reject(error)
        }
      }, wait)
    })
}
```

Pass `signal` into `fetch` (or any abortable API) so the previous request is cancelled when a newer one starts.
