import { Flex, Link, Text } from '@radix-ui/themes'
import { SlashIcon } from '@radix-ui/react-icons'

export const Breadcrumb = ({
  category,
  article,
}: {
  category: { _slug: string; _title: string }
  article?: { _slug: string; _title: string }
}) => {
  return (
    <Flex gap="1" mb="5" align="center">
      <Link href="/" color="gray">
        Index
      </Link>

      <Text color="gray" asChild>
        <SlashIcon height={21} />
      </Text>
      <Link href={`/${category._slug}`} color="gray" highContrast={!article}>
        {category._title}
      </Link>

      {article && (
        <>
          <Text color="gray" asChild>
            <SlashIcon height={21} />
          </Text>
          <Link
            href={`/${category._slug}/${article._slug}`}
            color="gray"
            highContrast
          >
            {article._title}
          </Link>
        </>
      )}
    </Flex>
  )
}
