import type {
  BrowserAPI,
  MenuCreateOptions,
  ScriptOptions,
  TabQueryOptions,
  Tab,
} from './types'

export const safariAPI: BrowserAPI = {
  contextMenus: {
    create(options: MenuCreateOptions): void {
      browser.contextMenus.create({
        id: options.id,
        title: options.title,
        documentUrlPatterns: options.documentUrlPatterns,
        contexts: options.contexts,
      })
    },
    onClicked: {
      addListener(callback): void {
        browser.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
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
      await browser.scripting.executeScript({
        files: options.files,
        target: options.target,
        world: options.world,
      })
    },
  },

  storage: {
    sync: {
      async get(keys: string[]): Promise<Record<string, unknown>> {
        return await browser.storage.sync.get(keys)
      },
      async set(items: Record<string, unknown>): Promise<void> {
        await browser.storage.sync.set(items)
      },
    },
  },

  runtime: {
    async sendMessage(message: unknown): Promise<unknown> {
      return await browser.runtime.sendMessage(message)
    },
    onMessage: {
      addListener(callback): void {
        browser.runtime.onMessage.addListener(
          (message, sender, sendResponse) => {
            return callback(message, sender, sendResponse)
          },
        )
      },
    },
    async openOptionsPage(): Promise<void> {
      await browser.runtime.openOptionsPage()
    },
    getURL(path: string): string {
      return browser.runtime.getURL(path)
    },
  },

  tabs: {
    async query(options: TabQueryOptions): Promise<Tab[]> {
      const tabs = await browser.tabs.query(options)
      return tabs.map(tab => ({
        id: tab.id,
        url: tab.url,
      }))
    },
  },

  i18n: {
    getMessage(key: string): string {
      return browser.i18n.getMessage(key)
    },
  },
}
