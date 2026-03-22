/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function normalizeKeys(
  keys?: string | string[] | { [name: string]: any },
): string[] {
  if (keys === undefined) {
    return []
  }

  if (typeof keys === 'string') {
    return [keys]
  }

  if (Array.isArray(keys)) {
    return keys
  }

  return Object.keys(keys)
}

class StorageImpl {
  constructor(public ns: string) {}

  async get(
    keys?: string | string[] | { [name: string]: any },
  ): Promise<{ [name: string]: any }> {
    await timeout(Math.random() * 1000)

    const storage = JSON.parse(localStorage.getItem(this.ns) ?? '{}') as {
      [name: string]: any
    }
    const normalizedKeys = normalizeKeys(keys)
    const items = normalizedKeys.reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = storage[key]

      return acc
    }, {})
    return items
  }

  async set(items: { [name: string]: any }): Promise<void> {
    await timeout(Math.random() * 1000)

    const originItems = JSON.parse(localStorage.getItem(this.ns) ?? '{}') as {
      [name: string]: any
    }

    localStorage.setItem(
      this.ns,
      JSON.stringify(Object.assign(originItems, items)),
    )
  }
}

type BrowserStorage = typeof browser.storage

export const storage: BrowserStorage = import.meta.env.DEV
  ? ({
      sync: new StorageImpl('sync'),
    } as BrowserStorage)
  : browser.storage
