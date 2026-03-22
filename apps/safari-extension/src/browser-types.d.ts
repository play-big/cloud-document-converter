/// <reference types="@types/firefox-webext-browser" />

type ExecutionWorld = 'ISOLATED' | 'MAIN'

interface ScriptInjectionWithWorld {
  files?: string[]
  target: {
    tabId: number
    frameIds?: number[]
    allFrames?: boolean
  }
  world?: ExecutionWorld
  injectImmediately?: boolean
}

declare global {
  const browser: {
    runtime: typeof import('@types/firefox-webext-browser').runtime
    storage: typeof import('@types/firefox-webext-browser').storage
    tabs: typeof import('@types/firefox-webext-browser').tabs
    contextMenus: typeof import('@types/firefox-webext-browser').contextMenus
    i18n: typeof import('@types/firefox-webext-browser').i18n
    scripting: {
      executeScript(
        injection: ScriptInjectionWithWorld,
      ): Promise<Array<{ frameId: number; result?: unknown }>>
    }
  }
}

export {}
