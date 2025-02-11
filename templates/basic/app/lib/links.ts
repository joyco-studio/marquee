import type { LinkDescriptors } from 'react-router/route-module'

type CrossOrigin = 'anonymous' | 'use-credentials' | undefined
type As = 'script' | 'style' | 'font' | 'image' | 'fetch' | 'worker' | 'document' | 'audio' | 'video'

type LinksConfig = {
  stylesheets: string[]
  /**
   * Use https://realfavicongenerator.net/ to generate a complete favicon set
   */
  favicon: {
    '32x32': string
    '16x16': string
    'apple-touch-icon'?: string
  }
  manifest?: string
  preconnect?: { href: string; crossOrigin?: CrossOrigin }[]
  preload?: {
    href: string
    as?: As
    type?: string
    crossOrigin?: CrossOrigin
  }[]
}

/**
 * Generate head <link> tags for Remix.
 *
 * @param links - Links configuration
 * @param extra - Extra links
 * @returns Remix links
 */
export const generateLinks = (links: LinksConfig, extra: LinkDescriptors = []): LinkDescriptors => {
  const _links: LinkDescriptors = []

  if (links.stylesheets) {
    _links.push(...links.stylesheets.map((stylesheet) => ({ rel: 'stylesheet', href: stylesheet })))
  }

  if (links.favicon) {
    _links.push(
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: links.favicon['32x32'] },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: links.favicon['16x16'] }
    )

    if (links.favicon['apple-touch-icon']) {
      _links.push({ rel: 'apple-touch-icon', href: links.favicon['apple-touch-icon'] })
    }
  }

  if (links.manifest) {
    _links.push({ rel: 'manifest', href: links.manifest })
  }

  if (links.preconnect) {
    _links.push(...links.preconnect.map(({ href, crossOrigin }) => ({ rel: 'preconnect', href, crossOrigin })))
  }

  if (links.preload) {
    _links.push(
      ...links.preload.map(({ href, as, type, crossOrigin }) => ({ rel: 'preload', href, as, type, crossOrigin }))
    )
  }

  return [..._links, ...extra]
}
