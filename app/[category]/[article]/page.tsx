import { Pump } from '@/.basehub/react-pump'
import {
  Avatar,
  Blockquote,
  Box,
  Code,
  Container,
  Em,
  Grid,
  Heading,
  Link,
  Separator,
  Table,
  Text,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { basehub } from '@/.basehub'
import { RichText } from 'basehub/react-rich-text'
import { notFound } from 'next/navigation'
import { CategoryMeta } from '@/app/_components/category-card'
import { ArticleMeta } from '@/app/_components/article-link'
import Image from 'next/image'
import { Callout } from '@/app/_components/callout'
import { Fragment } from 'react'
import { ArticlesList } from '@/app/_components/articles-list'
import { TOCRenderer } from '@/app/_components/toc'
import { Breadcrumb } from '@/app/_components/breadcrumb'
import { format } from 'date-fns'
import s from './styles.module.scss'
import { Feedback } from '@/app/_components/feeback'

export const generateStaticParams = async () => {
  const data = await basehub({ next: { revalidate: 60 } }).query({
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

  return data.index.categoriesSection.categories.items
    .map((category) => {
      return category.articles.items.map((article) => {
        return { category: category._slug, article: article._slug }
      })
    })
    .flat()
}

export default function ArticlePage({
  params,
}: {
  params: { category: string; article: string }
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
                    __args: {
                      first: 1,
                      filter: { _sys_slug: { eq: params.article } },
                    },
                    items: {
                      ...ArticleMeta,
                      _sys: {
                        lastModifiedAt: true,
                      },
                      _analyticsKey: true,
                      author: {
                        avatar: {
                          url: true,
                        },
                        _title: true,
                      },
                      body: {
                        json: {
                          toc: true,
                          content: true,
                          blocks: {
                            _id: true,
                            __typename: true,
                            content: {
                              plainText: true,
                            },
                            type: true,
                          },
                        },
                      },
                      related: {
                        _title: true,
                        _id: true,
                        _slug: true,
                      },
                    },
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
        const article = category.articles.items[0]
        if (!article) notFound()

        const authorInitials =
          article.author?._title
            .split(/\s/)
            .reduce(
              (acc, name, idx) => (idx < 3 && name ? acc + name[0] : acc),
              ''
            ) ?? 'A'

        return (
          <Container
            className={s.container}
            pb="9"
            pt={{ initial: '6', sm: '0' }}
            mx="auto"
            size="3"
            px={{ initial: '5', md: '7' }}
            asChild
          >
            <main>
              <TOCRenderer>{article.body?.json.toc}</TOCRenderer>
              <Box flexGrow="1">
                <Breadcrumb category={category} article={article} />
                <Heading as="h1" size={{ initial: '7', md: '8' }}>
                  {article._title}
                </Heading>
                <Text
                  as="p"
                  mt="1"
                  size={{ initial: '3', md: '4' }}
                  color="gray"
                >
                  {article.excerpt}
                </Text>
                {article.author && (
                  <Grid columns="auto 1fr" rows="2" gapX="2" mt="5">
                    <Avatar
                      src={article.author?.avatar.url}
                      fallback={authorInitials}
                      style={{ gridRow: '-1 / 1' }}
                    />
                    <Text size="2" weight="medium">
                      {article.author?._title}
                    </Text>
                    <Text size="2" color="gray">
                      Last Updated{' '}
                      {format(
                        new Date(article._sys.lastModifiedAt),
                        'MMMM dd, yyyy'
                      )}
                    </Text>
                  </Grid>
                )}
                <Box mt="9">
                  <RichText
                    blocks={article.body?.json.blocks}
                    components={{
                      h2: (props) => (
                        <Heading
                          as="h2"
                          size={{ initial: '5', md: '6' }}
                          mt="6"
                          mb="2"
                          {...props}
                        />
                      ),
                      h3: (props) => (
                        <Heading
                          as="h3"
                          size={{ initial: '4', md: '5' }}
                          mt="6"
                          mb="2"
                          {...props}
                        />
                      ),
                      h4: (props) => (
                        <Heading as="h4" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h5: (props) => (
                        <Heading as="h5" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      h6: (props) => (
                        <Heading as="h6" id={props.id}>
                          {props.children}
                        </Heading>
                      ),
                      blockquote: ({ children }) => (
                        <Blockquote>{children}</Blockquote>
                      ),
                      table: (props) => (
                        <Table.Root {...props} size="2" layout="auto" />
                      ),
                      em: (props) => <Em {...props} />,
                      tbody: (props) => <Table.Body {...props} />,
                      tr: ({ children }) => <Table.Row>{children}</Table.Row>,
                      th: ({ children, rowspan, colspan }) => (
                        <Table.ColumnHeaderCell
                          colSpan={colspan}
                          rowSpan={rowspan}
                        >
                          {children}
                        </Table.ColumnHeaderCell>
                      ),
                      td: ({ children, rowspan, colspan }) => (
                        <Table.Cell colSpan={colspan} rowSpan={rowspan}>
                          {children}
                        </Table.Cell>
                      ),
                      hr: () => <Separator size="4" my="7" color="gray" />,
                      video: (props) => (
                        <Box asChild my="6" mx="0" width="100%">
                          <video
                            {...props}
                            controls
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: 'var(--radius-4)',
                            }}
                          />
                        </Box>
                      ),
                      p: (props) => (
                        <Text
                          as="p"
                          {...props}
                          size={{ initial: '2', md: '3' }}
                          mb="4"
                        />
                      ),
                      a: (props) => (
                        <Link asChild>
                          <NextLink {...props} />
                        </Link>
                      ),
                      img: (props) => (
                        <Box asChild my="6" mx="0" width="100%">
                          <figure>
                            <Image
                              {...props}
                              alt={props.alt ?? ''}
                              style={{
                                maxWidth: '100%',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-4)',
                              }}
                            />

                            {props.alt && (
                              <Text
                                color="gray"
                                size="1"
                                asChild
                                mx="auto"
                                style={{ width: 'fit-content' }}
                              >
                                <figcaption>{props.alt}</figcaption>
                              </Text>
                            )}
                          </figure>
                        </Box>
                      ),
                      code: ({ isInline, ...rest }) => {
                        if (isInline) {
                          return <Code {...rest} />
                        }
                        return (
                          <pre>
                            <code {...rest} />
                          </pre>
                        )
                      },
                      pre: ({ children }) => children,
                      CalloutComponent: Callout,
                    }}
                  >
                    {article.body?.json.content}
                  </RichText>
                  {!!article.related?.length && (
                    <Fragment>
                      <Heading as="h2" size="6" mt="6" mb="3">
                        Related Articles
                      </Heading>
                      <ArticlesList
                        categorySlug={category._slug}
                        articles={article.related}
                      />
                    </Fragment>
                  )}
                  <Separator size="4" my="6" />
                  <Feedback analyticsKey={article._analyticsKey} />
                </Box>
              </Box>
            </main>
          </Container>
        )
      }}
    </Pump>
  )
}
