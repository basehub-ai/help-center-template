import { fragmentOn } from '@/.basehub'
import { Card, Flex, Text } from '@radix-ui/themes'
import { Icon } from './icon'
import Link from 'next/link'

export const CategoryMeta = fragmentOn('CategoriesItem', {
  _id: true,
  _title: true,
  _slug: true,
  description: true,
  icon: true,
  articles: {
    items: {
      _id: true,
    },
  },
})

export type CategoryMeta = fragmentOn.infer<typeof CategoryMeta>

export const CategoryCard = ({ data }: { data: CategoryMeta }) => {
  return (
    <Card variant="classic" size="2" asChild>
      <Link href={`/${data._slug}`}>
        <Flex direction="column">
          <Icon name={data.icon} style={{ width: 18, height: 18 }} />
          <Text size="3" weight="bold" mt="2">
            {data._title}
          </Text>
          <Text size="3" color="gray">
            {data.description}
          </Text>
        </Flex>
      </Link>
    </Card>
  )
}
