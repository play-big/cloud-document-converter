import type {
  BrowserAPI,
  MenuCreateOptions,
  ScriptOptions,
  TabQueryOptions,
  Tab,
} from './types'

export const chromeAPI: BrowserAPI = {
  contextMenus: {
    create(options: MenuCreateOptions): void {
      chrome.contextMenus.create({
        id: options.id,
        title: options.title,
        documentUrlPatterns: options.documentUrlPatterns,
        contexts: options.contexts,
      })
    },
    onClicked: {
      addListener(callback): void {
        chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
          callback({
            menuItemId,
            tab: tab ? { id: tab.id, url: tab.url } : undefined,
          })
        })
      },
    },
  },

  scripting: {
    async executeScript(options: ScriptOptions): Promise<void> {
      await chrome.scripting.executeScript({
        files: options.files,
        target: options.target,
        world: options.world,
      })
    },
  },

  storage: {
    sync: {
      async get(keys: string[]): Promise<Record<string, unknown>> {
        return await chrome.storage.sync.get(keys)
      },
      async set(items: Record<string, unknown>): Promise<void> {
        await chrome.storage.sync.set(items)
      },
    },
  },

  runtime: {
    async sendMessage(message: unknown): Promise<unknown> {
      return await chrome.runtime.sendMessage(message)
    },
    onMessage: {
      addListener(callback): void {
        chrome.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            return callback(message, sender, sendResponse)
          },
        )
      },
    },
    async openOptionsPage(): Promise<void> {
      await chrome.runtime.openOptionsPage()
    },
    getURL(path: string): string {
      return chrome.runtime.getURL(path)
    },
  },

  tabs: {
    async query(options: TabQueryOptions): Promise<Tab[]> {
      const tabs = await chrome.tabs.query(options)
      return tabs.map(tab => ({
        id: tab.id,
        url: tab.url,
      }))
    },
  },

  i18n: {
    getMessage(key: string): string {
      return chrome.i18n.getMessage(key)
    },
  },
}
