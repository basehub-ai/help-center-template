import { Pump } from '@/.basehub/react-pump'
import { Container, Flex, Grid, Heading, Link, Text } from '@radix-ui/themes'
import { basehub } from '@/.basehub'
import { CategoryMeta } from '../_components/category-card'
import { ArticleMeta } from '../_components/article-link'
import { notFound } from 'next/navigation'
import { SlashIcon } from '@radix-ui/react-icons'
import { ArticlesList } from '../_components/articles-list'

export const generateStaticParams = async () => {
  const data = await basehub().query({
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
    >
      {async ([data]) => {
        'use server'

        const category = data.index.categoriesSection.categories.items[0]
        if (!category) notFound()

        return (
          <Container py="9" maxWidth="840px">
            <Flex gap="1" mb="5" align="center">
              <Link href="/" color="gray">
                Index
              </Link>

              <Text color="gray" asChild>
                <SlashIcon height={21} />
              </Text>
              <Link href={`/${category._slug}`} color="gray" highContrast>
                {category._title}
              </Link>
            </Flex>

            <Grid
              gapX="7"
              flow="column"
              gapY="2"
              columns="minmax(auto, 278px) 1fr"
              rows="auto auto"
            >
              <Heading size="8">{category._title}</Heading>
              <Text color="gray">{category.description}</Text>
              <ArticlesList
                categorySlug={category._slug}
                articles={category.articles.items}
              />
            </Grid>
          </Container>
        )
      }}
    </Pump>
  )
}
