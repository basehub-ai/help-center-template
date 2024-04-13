import { fragmentOn } from "@/.basehub";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

export const ArticleMeta = fragmentOn("ArticlesItem", {
  _id: true,
  _slug: true,
  _title: true,
  excerpt: true,
});

export type ArticleMeta = fragmentOn.infer<typeof ArticleMeta>;

export const ArticleLink = ({
  data,
  categorySlug,
}: {
  data: ArticleMeta;
  categorySlug: string;
}) => {
  return (
    <Card variant="classic" asChild>
      <Link href={`/${categorySlug}/${data._slug}`}>
        <Flex justify="between" align="center">
          <Text size="2" weight="medium">
            {data._title}
          </Text>
          <ArrowRightIcon />
        </Flex>
      </Link>
    </Card>
  );
};
