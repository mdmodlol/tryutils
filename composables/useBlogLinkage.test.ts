import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { getBlogCtaDefinition, MAINLINE_TOOL_IDS } from '~/data/blog-cta'
import { getToolById } from '~/data/toolConfig'
import { normalizeBlogLinkage, resolveBlogFaqItems } from '~/composables/useBlogLinkage'
import { getPublicBlogPathFromContentPath } from '~/utils/blog-paths'

type ParsedFrontmatter = {
  relatedTools?: string[]
  canonical?: string
  embedTool?: string
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match) {
    return {}
  }

  const result: Record<string, unknown> = {}
  let currentArrayKey: string | null = null

  for (const line of match[1].split(/\r?\n/)) {
    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/)

    if (arrayItemMatch && currentArrayKey) {
      const items = Array.isArray(result[currentArrayKey]) ? result[currentArrayKey] as string[] : []
      items.push(stripQuotes(arrayItemMatch[1].trim()))
      result[currentArrayKey] = items
      continue
    }

    const keyValueMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)

    if (keyValueMatch) {
      const [, key, rawValue] = keyValueMatch

      if (!rawValue.trim()) {
        result[key] = []
        currentArrayKey = key
        continue
      }

      result[key] = stripQuotes(rawValue.trim())
      currentArrayKey = null
      continue
    }

    currentArrayKey = null
  }

  return result as ParsedFrontmatter
}

function getDomainContentFiles(domain: 'imagecompression' | 'heicconverter') {
  const dir = path.join(repoRoot, 'content', 'blog', domain)

  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(dir, file))
}

function buildArticleSource(filePath: string) {
  const markdown = fs.readFileSync(filePath, 'utf8')
  const relativeToContent = path.relative(path.join(repoRoot, 'content'), filePath)
  const contentPath = `/${relativeToContent.replace(/\\/g, '/').replace(/\.md$/, '')}`
  const locale = filePath.endsWith('.en.md') ? 'en' : 'zh'
  const publicPath = getPublicBlogPathFromContentPath(contentPath, locale)

  return {
    frontmatter: parseFrontmatter(markdown),
    locale,
    contentPath,
    publicPath,
  }
}

describe('normalizeBlogLinkage', () => {
  it('produces complete linkage for every imagecompression article', () => {
    const files = getDomainContentFiles('imagecompression')

    expect(files.length).toBeGreaterThan(0)

    for (const filePath of files) {
      const article = buildArticleSource(filePath)
      const linkage = normalizeBlogLinkage(
        {
          _path: article.contentPath,
          ...article.frontmatter,
        },
        {
          locale: article.locale,
          publicPath: article.publicPath,
        },
      )

      expect(linkage, filePath).not.toBeNull()
      expect(linkage?.contentDomain, filePath).toBe('imagecompression')
      expect(linkage?.primaryTool, filePath).toBe('image-compressor')
      expect(linkage?.ctaVariant, filePath).toBe('compress-now')
      expect(linkage?.faqCategory, filePath).toBe('imagecompression')
      expect(linkage?.relatedTools.length, filePath).toBeGreaterThanOrEqual(1)
      expect(linkage?.relatedTools.length, filePath).toBeLessThanOrEqual(3)
      expect(linkage?.relatedTools[0], filePath).toBe('image-compressor')
      expect(linkage?.canonicalPath, filePath).toBe(`https://www.tryutils.com${article.publicPath}`)

      if (article.frontmatter.canonical) {
        expect(linkage?.canonicalPath, filePath).toBe(article.frontmatter.canonical)
      }
    }
  })

  it('produces complete linkage for every heicconverter article', () => {
    const files = getDomainContentFiles('heicconverter')

    expect(files.length).toBeGreaterThan(0)

    for (const filePath of files) {
      const article = buildArticleSource(filePath)
      const linkage = normalizeBlogLinkage(
        {
          _path: article.contentPath,
          ...article.frontmatter,
        },
        {
          locale: article.locale,
          publicPath: article.publicPath,
        },
      )

      expect(linkage, filePath).not.toBeNull()
      expect(linkage?.contentDomain, filePath).toBe('heicconverter')
      expect(linkage?.primaryTool, filePath).toBe('heic-converter')
      expect(linkage?.ctaVariant, filePath).toBe('convert-heic-now')
      expect(linkage?.faqCategory, filePath).toBe('heicconverter')
      expect(linkage?.relatedTools.length, filePath).toBeGreaterThanOrEqual(1)
      expect(linkage?.relatedTools.length, filePath).toBeLessThanOrEqual(3)
      expect(linkage?.relatedTools[0], filePath).toBe('heic-converter')
      expect(linkage?.canonicalPath, filePath).toBe(`https://www.tryutils.com${article.publicPath}`)

      if (article.frontmatter.canonical) {
        expect(linkage?.canonicalPath, filePath).toBe(article.frontmatter.canonical)
      }
    }
  })

  it('keeps CTA tool targets inside the three mainline tools', () => {
    for (const toolId of MAINLINE_TOOL_IDS) {
      const variant = toolId === 'heic-converter'
        ? 'convert-heic-now'
        : toolId === 'image-format-converter'
          ? 'convert-format-now'
          : 'compress-now'
      const cta = getBlogCtaDefinition(variant, 'en')
      const tool = getToolById(cta.toolId)

      expect(MAINLINE_TOOL_IDS).toContain(cta.toolId)
      expect(tool?.path).toBe(cta.toolPath)
    }
  })

  it('merges custom FAQ items before the default FAQ pool', () => {
    const linkage = normalizeBlogLinkage(
      {
        _path: '/blog/imagecompression/example-article',
        faqItems: [
          {
            question: 'Can I compress screenshots too?',
            answer: 'Yes. Screenshots often benefit from choosing the right format before compression.',
          },
        ],
      },
      {
        locale: 'en',
        publicPath: '/blog/imagecompression/example-article',
      },
    )

    expect(linkage).not.toBeNull()

    const faqItems = resolveBlogFaqItems(linkage!, 'en')

    expect(faqItems[0].question).toBe('Can I compress screenshots too?')
    expect(faqItems.length).toBeGreaterThan(1)
    expect(faqItems.some((item) => item.question === 'Does image compression always cause visible quality loss?')).toBe(true)
  })

  it('tracks whether an article already embeds an inline tool', () => {
    const withEmbed = buildArticleSource(path.join(repoRoot, 'content', 'blog', 'imagecompression', 'browser-image-compression-libraries.en.md'))
    const withoutEmbed = buildArticleSource(path.join(repoRoot, 'content', 'blog', 'heicconverter', 'heic-technical-guide.en.md'))

    const withEmbedLinkage = normalizeBlogLinkage(
      {
        _path: withEmbed.contentPath,
        ...withEmbed.frontmatter,
      },
      {
        locale: withEmbed.locale,
        publicPath: withEmbed.publicPath,
      },
    )

    const withoutEmbedLinkage = normalizeBlogLinkage(
      {
        _path: withoutEmbed.contentPath,
        ...withoutEmbed.frontmatter,
      },
      {
        locale: withoutEmbed.locale,
        publicPath: withoutEmbed.publicPath,
      },
    )

    expect(withEmbedLinkage?.hasInlineEmbed).toBe(true)
    expect(withoutEmbedLinkage?.hasInlineEmbed).toBe(false)
  })
})
