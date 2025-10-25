import { siteUrl } from '@/lib/constants'
import { basehub } from 'basehub'
import type { MetadataRoute } from 'next'
import { CategoryMeta } from './_components/category-card'
import { ArticleMeta } from './_components/article-link'

export const revalidate = 1800 // 30 minutes - adjust as needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await basehub().query({
    index: {
      categoriesSection: {
        title: true,
        categories: {
          items: {
            ...CategoryMeta,
            articles: {
              items: ArticleMeta,
            },
          },
        },
      },
    },
  })

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add the home page
  sitemapEntries.push({
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  })

  // Add category and article pages
  data.index.categoriesSection.categories.items.forEach((category) => {
    // Add the category index page
    sitemapEntries.push({
      url: `${siteUrl}/${category._slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })

    // Add all articles in this category
    category.articles.items.forEach((article) => {
      sitemapEntries.push({
        url: `${siteUrl}/${category._slug}/${article._slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  })

  return sitemapEntries
}
