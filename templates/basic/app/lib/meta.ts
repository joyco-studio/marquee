import type { MetaDescriptor } from 'react-router'

type MetaImage = {
  url: string
  /**
   * Recommended: 1200px
   */
  width: number
  /**
   * Recommended: 630px
   */
  height: number
  type: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp'
}

type MetaConfigBase = {
  title: string
  description: string
  url: string
  siteName: string
  image: MetaImage
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
    creator?: string
    site?: string
    image?: MetaImage
  }
}

type MetaConfig =
  | (MetaConfigBase & {
      strict?: true
    })
  | (Partial<MetaConfigBase> & {
      strict?: false
    })

/**
 * Generate meta tags for Remix. It also runs dedupe and purge for duplicate and empty meta tags.
 *
 * @param structuredMeta - Meta configuration
 * @param extra - Extra meta tags
 * @returns Remix meta tags
 */
export const generateMeta = (structuredMeta: MetaConfig, extra?: MetaDescriptor[]): MetaDescriptor[] => {
  const _meta: MetaDescriptor[] = []

  const dedupeAndPurge = (meta: MetaDescriptor[]) => {
    const deduped = new Map<string, MetaDescriptor>()
    meta.forEach((m) => {
      if ('name' in m && m.content !== undefined) {
        deduped.set(m.name as string, m)
      } else if ('property' in m && m.content !== undefined) {
        deduped.set(m.property as string, m)
      } else {
        deduped.set(Object.keys(m)[0] as string, m)
      }
    })
    return Array.from(deduped.values())
  }

  const { title, description, url, siteName, twitter, image } = structuredMeta

  /* base */
  _meta.push({ title }, { name: 'description', content: description })

  /* og */
  _meta.push(
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: siteName },
    { property: 'og:image', content: structuredMeta.image?.url },
    { property: 'og:image:width', content: structuredMeta.image?.width.toString() },
    { property: 'og:image:height', content: structuredMeta.image?.height.toString() },
    { property: 'og:image:type', content: structuredMeta.image?.type }
  )

  /* twitter */
  _meta.push(
    { name: 'twitter:card', content: twitter?.card || 'summary_large_image' },
    { name: 'twitter:title', content: twitter?.title || title },
    { name: 'twitter:description', content: twitter?.description || description },
    { name: 'twitter:creator', content: twitter?.creator },
    { name: 'twitter:site', content: twitter?.site }
  )
  _meta.push(
    { name: 'twitter:image', content: twitter?.image?.url || image?.url },
    { name: 'twitter:image:width', content: twitter?.image?.width?.toString() || image?.width?.toString() },
    { name: 'twitter:image:height', content: twitter?.image?.height?.toString() || image?.height?.toString() },
    { name: 'twitter:image:type', content: twitter?.image?.type || image?.type }
  )

  return dedupeAndPurge([..._meta, ...(extra || [])])
}

export const mergeMeta = (parentMeta: MetaDescriptor[], metaTags: MetaDescriptor[]) => {
  const merged = new Map<string, MetaDescriptor>()

  const getMetaKey = (meta: MetaDescriptor) => {
    if ('name' in meta) return `name:${meta.name}`
    if ('property' in meta) return `property:${meta.property}`
    return Object.keys(meta)[0]
  }

  parentMeta.forEach((meta) => {
    merged.set(getMetaKey(meta), meta)
  })

  metaTags.forEach((meta) => {
    merged.set(getMetaKey(meta), meta)
  })

  return Array.from(merged.values())
}
