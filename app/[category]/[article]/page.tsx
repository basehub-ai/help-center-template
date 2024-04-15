import { Pump } from "@/.basehub/react-pump";
import { RichText } from "@/.basehub/react-rich-text";
import {
  Box,
  Code,
  Container,
  Flex,
  Heading,
  Link,
  Text,
} from "@radix-ui/themes";
import NextLink from "next/link";
import { basehub } from "@/.basehub";
import { notFound } from "next/navigation";
import { CategoryMeta } from "@/app/_components/category-card";
import { ArticleMeta } from "@/app/_components/article-link";
import Image from "next/image";

export const generateStaticParams = async () => {
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
  });

  return data.index.categoriesSection.categories.items
    .map((category) => {
      return category.articles.items.map((article) => {
        return { category: category._slug, article: article._slug };
      });
    })
    .flat();
};

export default function ArticlePage({
  params,
}: {
  params: { category: string; article: string };
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
                      body: { json: { content: true } },
                    },
                  },
                },
              },
            },
          },
        },
      ]}
    >
      {async ([data]) => {
        "use server";

        const category = data.index.categoriesSection.categories.items[0];
        if (!category) notFound();
        const article = category.articles.items[0];
        if (!article) notFound();

        return (
          <Container py="9" width="750px" mx="auto">
            <Heading size="8">{article._title}</Heading>
            <Text>{article.excerpt}</Text>
            <Box>
              <RichText
                components={{
                  p: (props) => <Text {...props} />,
                  a: (props) => (
                    <Link asChild>
                      <NextLink {...props} />
                    </Link>
                  ),
                  h2: (props) => <Heading size="6" {...props} />,
                  h3: (props) => <Heading size="5" {...props} />,
                  img: (props) => (
                    <Image
                      {...props}
                      alt={props.alt ?? ""}
                      style={{ maxWidth: "100%" }}
                    />
                  ),
                  code: ({ isInline, ...rest }) => {
                    if (isInline) {
                      return <Code {...rest} />;
                    }
                    return (
                      <pre>
                        <code {...rest} />
                      </pre>
                    );
                  },
                  pre: ({ children }) => children,
                }}
              >
                {article.body?.json.content}
              </RichText>
            </Box>
          </Container>
        );
      }}
    </Pump>
  );
}
