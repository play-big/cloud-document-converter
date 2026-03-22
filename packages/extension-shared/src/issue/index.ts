import { serializeError } from 'serialize-error'
import { i18next, CommonTranslationKey, Namespace } from '../i18n'

interface Issue {
  title: string
  body: string
  labels?: Label[]
  template: string
}

enum Label {
  Bug = 'bug',
}

function generateIssueUrl(issue: Issue): string {
  const { title, body, labels = [], template } = issue

  const baseUrl =
    'https://github.com/whale4113/cloud-document-converter/issues/new'
  const params = new URLSearchParams({
    title: title,
    body: body,
    labels: labels.join(','),
    template,
  })

  return `${baseUrl}?${params.toString()}`
}

export interface ReportBugOptions {
  version: string
}

export const createReportBug = (options: ReportBugOptions) => {
  const { version } = options

  return (error: unknown): void => {
    const url = generateIssueUrl({
      title: '',
      body: i18next.t(CommonTranslationKey.ISSUE_TEMPLATE_BODY, {
        version,
        errorInfo: JSON.stringify(serializeError(error), null, 2),
        ns: Namespace.COMMON,
        interpolation: { escapeValue: false },
      }),
      labels: [Label.Bug],
      template: 'bug.md',
    })

    window.open(url, '__blank')
  }
}
