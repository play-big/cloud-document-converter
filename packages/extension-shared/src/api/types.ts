export interface MenuCreateOptions {
  id: string
  title: string
  documentUrlPatterns?: string[]
  contexts?: ('page' | 'editable')[]
}

export interface MenuClickEvent {
  menuItemId: string | number
  tab?: {
    id?: number
  }
}

export interface ScriptOptions {
  files: string[]
  target: { tabId: number }
  world?: 'ISOLATED' | 'MAIN'
}

export interface TabQueryOptions {
  currentWindow?: boolean
  active?: boolean
}

export interface Tab {
  id?: number
  url?: string
}

export interface BrowserAPI {
  contextMenus: {
    create(options: MenuCreateOptions): void
    onClicked: {
      addListener(callback: (event: MenuClickEvent) => void): void
    }
  }
  scripting: {
    executeScript(options: ScriptOptions): Promise<void>
  }
  storage: {
    sync: {
      get(keys: string[]): Promise<Record<string, unknown>>
      set(items: Record<string, unknown>): Promise<void>
    }
  }
  runtime: {
    sendMessage(message: unknown): Promise<unknown>
    onMessage: {
      addListener(
        callback: (
          message: unknown,
          sender: unknown,
          sendResponse: (response?: unknown) => void,
        ) => boolean | undefined,
      ): void
    }
    openOptionsPage(): Promise<void>
    getURL(path: string): string
  }
  tabs: {
    query(options: TabQueryOptions): Promise<Tab[]>
  }
  i18n: {
    getMessage(key: string): string
  }
}

export type Platform = 'chrome' | 'safari'
