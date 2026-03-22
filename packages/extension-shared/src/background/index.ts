import type { BrowserAPI, MenuClickEvent } from '../api'

export enum MenuItemId {
  DOWNLOAD_DOCX_AS_MARKDOWN = 'download_docx_as_markdown',
  COPY_DOCX_AS_MARKDOWN = 'copy_docx_as_markdown',
  VIEW_DOCX_AS_MARKDOWN = 'view_docx_as_markdown',
}

export const sharedDocumentUrlPatterns: string[] = [
  'https://*.feishu.cn/*',
  'https://*.feishu.net/*',
  'https://*.larksuite.com/*',
  'https://*.feishu-pre.net/*',
  'https://*.larkoffice.com/*',
  'https://*.larkenterprise.com/*',
]

export interface SetupContextMenuOptions {
  i18n: {
    getMessage(key: string): string
  }
}

export const setupContextMenu = (
  api: BrowserAPI,
  options: SetupContextMenuOptions,
): void => {
  const { i18n } = options

  api.contextMenus.create({
    id: MenuItemId.DOWNLOAD_DOCX_AS_MARKDOWN,
    title: i18n.getMessage('download_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })

  api.contextMenus.create({
    id: MenuItemId.COPY_DOCX_AS_MARKDOWN,
    title: i18n.getMessage('copy_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })

  api.contextMenus.create({
    id: MenuItemId.VIEW_DOCX_AS_MARKDOWN,
    title: i18n.getMessage('view_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })
}

export interface ExecuteScriptByFlagOptions {
  onDownload: (tabId: number) => Promise<void>
  onCopy: (tabId: number) => Promise<void>
  onView: (tabId: number) => Promise<void>
}

export const executeScriptByFlag = async (
  flag: string | number,
  tabId: number,
  options: ExecuteScriptByFlagOptions,
): Promise<void> => {
  const { onDownload, onCopy, onView } = options

  switch (flag) {
    case MenuItemId.DOWNLOAD_DOCX_AS_MARKDOWN:
      await onDownload(tabId)
      break
    case MenuItemId.COPY_DOCX_AS_MARKDOWN:
      await onCopy(tabId)
      break
    case MenuItemId.VIEW_DOCX_AS_MARKDOWN:
      await onView(tabId)
      break
    default:
      break
  }
}

export type SetupMessageHandlerOptions = ExecuteScriptByFlagOptions

export const setupMessageHandler = (
  api: BrowserAPI,
  options: SetupMessageHandlerOptions,
): void => {
  api.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const msg = message as { flag: string }

    const executeScript = async () => {
      const activeTabs = await api.tabs.query({
        currentWindow: true,
        active: true,
      })

      const activeTabId = activeTabs.at(0)?.id

      if (activeTabs.length === 1 && activeTabId !== undefined) {
        await executeScriptByFlag(msg.flag, activeTabId, options)
      }
    }

    executeScript().then(sendResponse).catch(console.error)

    return true
  })
}

export const setupContextMenuClickHandler = (
  api: BrowserAPI,
  options: ExecuteScriptByFlagOptions,
): void => {
  api.contextMenus.onClicked.addListener(
    ({ menuItemId, tab }: MenuClickEvent) => {
      if (tab?.id !== undefined) {
        executeScriptByFlag(menuItemId, tab.id, options).catch(console.error)
      }
    },
  )
}
