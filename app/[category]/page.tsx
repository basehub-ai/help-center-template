import { Pump } from '@/.basehub/react-pump'
import { Container, Grid, Heading, Text } from '@radix-ui/themes'
import { basehub } from '@/.basehub'
import { CategoryMeta } from '../_components/category-card'
import { ArticleMeta } from '../_components/article-link'
import { notFound } from 'next/navigation'
import { ArticlesList } from '../_components/articles-list'
import { Breadcrumb } from '../_components/breadcrumb'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next/types'
import { MetadataFragment } from '../_fragments'
import { PageView } from '../_components/analytics/page-view'

export const generateStaticParams = async () => {
  const data = await basehub({ next: { revalidate: 120 } }).query({
    index: {
      categoriesSection: {
        title: true,
        categories: {
          items: CategoryMeta,
        },
      },
    },
  })
  return data.index.categoriesSection.categories.items.map((category) => ({
    params: { category: category._slug },
  }))
}

export const generateMetadata = async ({
  params,
}: {
  params: { category: string }
}): Promise<Metadata> => {
  const data = await basehub({
    next: { revalidate: 60 },
    draft: draftMode().isEnabled,
  }).query({
    settings: {
      metadata: MetadataFragment,
    },
    index: {
      categoriesSection: {
        title: true,
        categories: {
          __args: {
            first: 1,
            filter: { _sys_slug: { eq: params.category } },
          },
          items: {
            ...CategoryMeta,
            ogImage: {
              url: true,
            },
          },
        },
      },
    },
  })

  const category = data.index.categoriesSection.categories.items[0]
  if (!category) return {}
  const siteName = data.settings.metadata.title

  const title = {
    absolute: `${category._title} | ${siteName}`,
  }
  const description = !category.description
    ? undefined
    : category.description.length > 150
      ? category.description.slice(0, 147) + '...'
      : category.description

  const images = [
    {
      url: category.ogImage.url,
      width: 1200,
      height: 630,
    },
  ]

  return {
    title,
    description,
    icons: {
      icon: data.settings.metadata.icon.url,
      shortcut: data.settings.metadata.icon.url,
      apple: data.settings.metadata.icon.url,
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: 'en-US',
      type: 'website',
      url: `/${params.category}`,
      images,
    },
  }
}

export default function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  return (
    <Pump
      draft={draftMode().isEnabled}
      queries={[
        {
          index: {
            categoriesSection: {
              title: true,
              categories: {
                __args: {
                  first: 1,
                  filter: { _sys_slug: { eq: params.category } },
                },
                items: {
                  _analyticsKey: true,
                  ...CategoryMeta,
                  articles: {
                    items: ArticleMeta,
                  },
                },
              },
            },
          },
        },
      ]}
      next={{ revalidate: 60 }}
    >
      {async ([data]) => {
        'use server'

        const category = data.index.categoriesSection.categories.items[0]
        if (!category) notFound()

        return (
          <>
            <PageView _analyticsKey={category._analyticsKey} />
            <Container
              pb="9"
              mt={{ initial: 'var(--header-margin)', md: '0' }}
              pt={{ initial: '6', sm: '0' }}
              px={{ initial: '5', md: '7' }}
              style={{ flexGrow: '1' }}
              size="4"
              maxWidth="1024px"
              asChild
            >
              <main>
                <Breadcrumb category={category} />
                <Grid
                  gapX="7"
                  flow="column"
                  gapY="2"
                  columns={{ sm: 'minmax(auto, 308px) 1fr' }}
                  rows={{ initial: 'auto auto 1fr', sm: 'auto 1fr' }}
                >
                  <Heading size="8">{category._title}</Heading>
                  <Text color="gray">{category.description}</Text>
                  <ArticlesList
                    categorySlug={category._slug}
                    articles={category.articles.items}
                  />
                </Grid>
              </main>
            </Container>
          </>
        )
      }}
    </Pump>
  )
}
