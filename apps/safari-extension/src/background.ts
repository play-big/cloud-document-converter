import { type Message, Flag } from './common/message'

const sharedDocumentUrlPatterns: string[] = [
  'https://*.feishu.cn/*',
  'https://*.feishu.net/*',
  'https://*.larksuite.com/*',
  'https://*.feishu-pre.net/*',
  'https://*.larkoffice.com/*',
  'https://*.larkenterprise.com/*',
]

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: Flag.ExecuteDownloadScript,
    title: browser.i18n.getMessage('download_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })

  browser.contextMenus.create({
    id: Flag.ExecuteCopyScript,
    title: browser.i18n.getMessage('copy_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })

  browser.contextMenus.create({
    id: Flag.ExecuteViewScript,
    title: browser.i18n.getMessage('view_docx_as_markdown'),
    documentUrlPatterns: sharedDocumentUrlPatterns,
    contexts: ['page', 'editable'],
  })
})

const executeScriptByFlag = async (flag: string | number, tabId: number) => {
  switch (flag) {
    case Flag.ExecuteDownloadScript:
      await browser.scripting.executeScript({
        files: ['bundles/scripts/download-lark-docx-as-markdown.js'],
        target: { tabId },
        // @ts-expect-error Safari supports 'MAIN' world but @types/firefox-webext-browser doesn't include it
        world: 'MAIN',
      })
      break
    case Flag.ExecuteCopyScript:
      await browser.scripting.executeScript({
        files: ['bundles/scripts/copy-lark-docx-as-markdown.js'],
        target: { tabId },
        // @ts-expect-error Safari supports 'MAIN' world but @types/firefox-webext-browser doesn't include it
        world: 'MAIN',
      })
      break
    case Flag.ExecuteViewScript:
      await browser.scripting.executeScript({
        files: ['bundles/scripts/view-lark-docx-as-markdown.js'],
        target: { tabId },
        // @ts-expect-error Safari supports 'MAIN' world but @types/firefox-webext-browser doesn't include it
        world: 'MAIN',
      })
      break
    default:
      break
  }
}

browser.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
  if (tab?.id !== undefined) {
    executeScriptByFlag(menuItemId, tab.id).catch(console.error)
  }
})

browser.runtime.onMessage.addListener((_message, sender, sendResponse) => {
  const message = _message as Message

  const executeScript = async () => {
    const activeTabs = await browser.tabs.query({
      currentWindow: true,
      active: true,
    })

    const activeTabId = activeTabs.at(0)?.id

    if (activeTabs.length === 1 && activeTabId !== undefined) {
      await executeScriptByFlag(message.flag, activeTabId)
    }
  }

  executeScript().then(sendResponse).catch(console.error)

  return true
})
