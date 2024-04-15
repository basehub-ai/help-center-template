import { Pump } from "@/.basehub/react-pump";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { basehub } from "@/.basehub";
import { CategoryMeta } from "../_components/category-card";
import { ArticleLink, ArticleMeta } from "../_components/article-link";
import { notFound } from "next/navigation";

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
  });
  return data.index.categoriesSection.categories.items.map((category) => ({
    params: { category: category._slug },
  }));
};

export default function CategoryPage({
  params,
}: {
  params: { category: string };
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
        "use server";

        const category = data.index.categoriesSection.categories.items[0];
        if (!category) notFound();

        return (
          <Container py="9">
            <Heading size="8">{category._title}</Heading>
            <Text>{category.description}</Text>
            <Flex gap="4">
              {category.articles.items.map((item) => {
                return (
                  <ArticleLink
                    key={item._id}
                    data={item}
                    categorySlug={params.category}
                  />
                );
              })}
            </Flex>
          </Container>
        );
      }}
    </Pump>
  );
}
