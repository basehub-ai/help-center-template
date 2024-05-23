import { Flex, Link, Text } from '@radix-ui/themes'
import { SlashIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'

export const Breadcrumb = ({
  category,
  article,
}: {
  category: { _slug: string; _title: string }
  article?: { _slug: string; _title: string }
}) => {
  return (
    <Flex gap="1" mb={{ initial: '4', md: '5' }} align="center">
      <Link asChild color="gray" size={{ initial: '2', md: '3' }}>
        <NextLink href="/">Categories</NextLink>
      </Link>

      <Text color="gray" asChild>
        <SlashIcon height={21} />
      </Text>
      <Link
        asChild
        color="gray"
        highContrast={!article}
        size={{ initial: '2', md: '3' }}
        truncate
      >
        <NextLink href={`/${category._slug}`}>{category._title}</NextLink>
      </Link>

      {article && (
        <>
          <Text color="gray" asChild>
            <SlashIcon height={21} />
          </Text>
          <Link
            asChild
            color="gray"
            highContrast
            size={{ initial: '2', md: '3' }}
            truncate
          >
            <NextLink href={`/${category._slug}/${article._slug}`}>
              {article._title}
            </NextLink>
          </Link>
        </>
      )}
    </Flex>
  )
}
