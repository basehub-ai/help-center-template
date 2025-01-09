import { Pump } from '@/.basehub/react-pump'
import {
  Box,
  Container,
  Grid,
  Heading,
  Flex,
  Link,
  Text,
  ScrollArea,
} from '@radix-ui/themes'
import { CategoryCard, CategoryMeta } from './_components/category-card'
import { ArticleLink, ArticleMeta } from './_components/article-link'

import { RichText } from 'basehub/react-rich-text'
import { DialogTriggerDesktop as Search } from './_components/search'
import { draftMode } from 'next/headers'
import { PageView } from './_components/analytics/page-view'

export default async function HomePage() {
  return (
    <Pump
      queries={[
        {
          index: {
            analytics: {
              views: {
                ingestKey: true,
              },
            },
            greeting: true,
            subtitle: {
              json: {
                content: true,
              },
            },
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
      draft={(await draftMode()).isEnabled}
      next={{ revalidate: 60 }}
    >
      {async ([data]) => {
        'use server'

        return (
          <>
            <PageView ingestKey={data.index.analytics.views.ingestKey} />
            <Flex
              direction="column"
              align="center"
              maxWidth="540px"
              mx="auto"
              gap="4"
              pt="6"
              px="5"
              mt={{ initial: 'var(--header-margin)', md: '0' }}
            >
              <Heading align="center" size="8" wrap="pretty">
                {data.index.greeting}
              </Heading>
              <Search style={{ width: '100%' }} />
              {data.index.subtitle?.json && (
                <Text as="span" color="gray" size="2">
                  <RichText
                    components={{
                      a: (props) => <Link {...props} />,
                      p: (props) => <Text {...props} />,
                    }}
                  >
                    {data.index.subtitle.json.content}
                  </RichText>
                </Text>
              )}
            </Flex>

            <Container
              size="4"
              maxWidth="1024px"
              py="9"
              position="relative"
              overflow="clip"
              px={{ initial: '5', md: '7' }}
            >
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
                  <ScrollArea
                    type="hover"
                    scrollbars="horizontal"
                    style={{
                      width: 'calc(100% + var(--space-5) * 2)',
                    }}
                    mx="calc(-1 * var(--space-5))"
                  >
                    <Grid
                      gap="4"
                      px="5"
                      flow={{ initial: 'column', sm: 'row' }}
                      columns={{ sm: '2' }}
                      width={{ initial: 'max-content', sm: 'auto' }}
                      style={{ gridAutoColumns: 'minmax(260px, 1fr)' }}
                    >
                      {data.index.popularArticlesSection.articles.map(
                        (article) => {
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
                        }
                      )}
                    </Grid>
                  </ScrollArea>
                </Box>

                <Box>
                  <Heading size="4" mb="4">
                    {data.index.categoriesSection.title}
                  </Heading>
                  <Grid gap="4" columns={{ initial: '1', sm: '2', md: '3' }}>
                    {data.index.categoriesSection.categories.items.map(
                      (category) => {
                        return (
                          <CategoryCard data={category} key={category._id} />
                        )
                      }
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Container>
          </>
        )
      }}
    </Pump>
  )
}
