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
import {
  Callout as CalloutFragment,
  InlineIcon as InlineIconFragment,
} from './_fragments'
import { Callout } from '@/app/_components/callout'
import { Fragment } from 'react'
import { ArticlesList } from '@/app/_components/articles-list'
import { TOCRenderer } from '@/app/_components/toc'
import { Breadcrumb } from '@/app/_components/breadcrumb'
import { format } from 'date-fns'
import s from './styles.module.scss'
import { Feedback } from '@/app/_components/feedback'
import { InlineIcon } from '@/app/_components/inline-icon'
import { Video } from '@/app/_components/article/video'
import { ImageWithZoom } from '@/app/_components/article/image-with-zoom'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next/types'
import { MetadataFragment } from '@/app/_fragments'

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

export const generateMetadata = async ({
  params,
}: {
  params: { category: string; slug: string }
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
            articles: {
              __args: {
                first: 1,
                filter: { _sys_slug: { eq: params.slug } },
              },
              items: {
                ...ArticleMeta,
                ogImage: {
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const category = data.index.categoriesSection.categories.items[0]
  if (!category) return {}
  const siteName = data.settings.metadata.title

  const article = category.articles.items[0]
  if (!article) return notFound()
  const { _title, excerpt } = article

  const title = {
    absolute: `${_title} - ${category._title} | ${siteName}`,
  }
  const description = !excerpt
    ? undefined
    : excerpt.length > 150
    ? excerpt.slice(0, 147) + '...'
    : excerpt

  const images = [
    {
      url: article.ogImage.url,
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
      url: `/${params.category}/${params.slug}`,
      images,
    },
  }
}

export default function ArticlePage({
  params,
}: {
  params: { category: string; article: string }
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
                            __typename: true,
                            on_CalloutComponent: CalloutFragment,
                            on_InlineIconComponent: InlineIconFragment,
                          },
                        },
                      },
                      related: {
                        _title: true,
                        _id: true,
                        _slugPath: true,
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
            size="4"
            mt={{ initial: 'var(--header-margin)', md: '0' }}
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
                      video: Video,
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
                      img: (props) => <ImageWithZoom {...props} />,
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
                      InlineIconComponent_mark: InlineIcon,
                      InlineIconComponent: InlineIcon,
                    }}
                  >
                    {article.body?.json.content}
                  </RichText>
                  {!!article.related?.length && (
                    <Fragment>
                      <Heading as="h2" size="6" mt="6" mb="3">
                        Related Articles
                      </Heading>
                      <ArticlesList articles={article.related} />
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
