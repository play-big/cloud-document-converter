/// <reference types="@types/firefox-webext-browser" />

declare namespace Browser {
  namespace scripting {
    type ExecutionWorld = 'ISOLATED' | 'MAIN'

    interface ScriptInjection<T = string[]> {
      injectImmediately?: boolean
      target: {
        tabId: number
        frameIds?: number[]
        allFrames?: boolean
      }
      files?: T
      func?: (...args: any[]) => any
      args?: any[]
      world?: ExecutionWorld
    }
  }
}

interface BrowserObject extends Browser.Browser {
  scripting: Browser.scripting.Static
}

declare const browser: BrowserObject
