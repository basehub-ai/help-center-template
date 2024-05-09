import { Button, Card, Flex } from '@radix-ui/themes'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import { ArticlesItem } from '@/.basehub/schema'

export const ArticlesList = ({
  articles,
  categorySlug,
}: {
  articles: Pick<ArticlesItem, '_id' | '_title' | '_slug'>[]
  categorySlug: string
}) => {
  return (
    <Card variant="classic" style={{ gridRow: '-1 / 1' }} size="2">
      <Flex direction="column" gap="2">
        {articles.map((item) => {
          return (
            <Button
              color="gray"
              key={item._id}
              asChild
              variant="ghost"
              style={{ padding: '12px 16px' }}
            >
              <NextLink
                href={`/${categorySlug}/${item._slug}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {item._title}
                <ArrowRightIcon />
              </NextLink>
            </Button>
          )
        })}
      </Flex>
    </Card>
  )
}
