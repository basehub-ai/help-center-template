import { Box, Code, Heading, Link, Text } from '@radix-ui/themes'
import { RichText, RichTextProps } from 'basehub/react-rich-text'
import s from './toc.module.scss'
import NextLink from 'next/link'

export const TOCRenderer = ({
  children,
}: {
  children: RichTextProps['children']
}) => {
  if (!children || (Array.isArray(children) && !children.length)) return null

  return (
    <div className={s.container}>
      <div>
        <Heading size="3" weight="medium" as="h4" mb="2">
          On this page
        </Heading>
        <RichText
          components={{
            p: (props) => (
              <Box asChild py="1">
                <Text size="2" as="p" {...props} />
              </Box>
            ),
            a: ({ children, href }) => (
              <Link color="gray" className={s.link} asChild>
                <NextLink href={href}>{children}</NextLink>
              </Link>
            ),
            ol: (props) => (
              <ol
                style={{ paddingInlineStart: 0, listStyle: 'none' }}
                {...props}
              />
            ),
            code: (props) => <Code {...props} />,
          }}
        >
          {children}
        </RichText>
      </div>
    </div>
  )
}
