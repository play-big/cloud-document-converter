/// <reference types="@types/firefox-webext-browser" />

declare namespace browser.scripting {
  interface ScriptInjection<T> {
    injectImmediately?: boolean
    target: InjectionTarget
    files?: T
    func?: (...args: any[]) => any
    args?: any[]
    world?: 'ISOLATED' | 'MAIN'
  }
}

declare const browser: typeof import('@types/firefox-webext-browser')
