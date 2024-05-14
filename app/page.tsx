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
import { Search } from './_components/search'

export default function HomePage() {
  return (
    <Pump
      queries={[
        {
          index: {
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
    >
      {async ([data]) => {
        'use server'

        return (
          <>
            <Flex
              direction="column"
              align="center"
              maxWidth="540px"
              mx="auto"
              gap="4"
              pt="6"
              px="5"
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

            <Container py="9" position="relative" overflow="clip" px="5">
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
