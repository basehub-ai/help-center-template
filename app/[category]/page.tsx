import { Pump } from '@/.basehub/react-pump'
import { Container, Grid, Heading, Text } from '@radix-ui/themes'
import { basehub } from '@/.basehub'
import { CategoryMeta } from '../_components/category-card'
import { ArticleMeta } from '../_components/article-link'
import { notFound } from 'next/navigation'
import { ArticlesList } from '../_components/articles-list'
import { Breadcrumb } from '../_components/breadcrumb'
import { draftMode } from 'next/headers'

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
          <Container
            pb="9"
            mt={{ initial: 'var(--header-margin)', md: '0' }}
            pt={{ initial: '6', sm: '0' }}
            px={{ initial: '5', md: '7' }}
            style={{ flexGrow: '1' }}
            size="4"
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
        )
      }}
    </Pump>
  )
}
