import { Pump } from '@/.basehub/react-pump'
import { Box, Container, Grid, Heading } from '@radix-ui/themes'
import { CategoryCard, CategoryMeta } from './_components/category-card'
import { ArticleLink, ArticleMeta } from './_components/article-link'

export default function HomePage() {
  return (
    <Pump
      queries={[
        {
          index: {
            greeting: true,
            popularArticlesSection: {
              title: true,
              articles: ArticleMeta,
            },
            categoriesSection: {
              title: true,
              categories: {
                items: CategoryMeta,
              },
            },
          },
        },
      ]}
    >
      {async ([data]) => {
        'use server'

        return (
          <Container py="9" position="relative" overflow="clip">
            {/* radial-gradient(farthest-side, var(--purple-3), transparent) */}
            <Box
              style={{
                zIndex: -1,
                position: 'absolute',
                top: 0,
                left: -400,
                background:
                  'radial-gradient(farthest-side, var(--accent-3), transparent)',
                width: '700px',
                height: '700px',
              }}
            />
            <Box
              style={{
                zIndex: -1,
                position: 'absolute',
                top: 200,
                left: -500,
                background:
                  'radial-gradient(farthest-side, var(--purple-3), transparent)',
                width: '700px',
                height: '700px',
              }}
            />

            <Grid gap="9">
              <Box>
                <Heading size="4" mb="4">
                  {data.index.popularArticlesSection.title}
                </Heading>
                <Grid gap="4" columns="2">
                  {data.index.popularArticlesSection.articles.map((article) => {
                    const category =
                      data.index.categoriesSection.categories.items.find(
                        (category) => {
                          return category.articles.items.some(
                            (item) => item._id === article._id
                          )
                        }
                      )
                    if (!category) return null
                    return (
                      <ArticleLink
                        data={article}
                        key={article._id}
                        categorySlug={category?._slug}
                      />
                    )
                  })}
                </Grid>
              </Box>

              <Box>
                <Heading size="4" mb="4">
                  {data.index.categoriesSection.title}
                </Heading>
                <Grid gap="4" columns="3">
                  {data.index.categoriesSection.categories.items.map(
                    (category) => {
                      return <CategoryCard data={category} key={category._id} />
                    }
                  )}
                </Grid>
              </Box>
            </Grid>
          </Container>
        )
      }}
    </Pump>
  )
}
