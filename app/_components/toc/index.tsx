import { Box, Code, Heading, Link, Text } from '@radix-ui/themes'
import { RichText, RichTextProps } from 'basehub/react-rich-text'
import s from './toc.module.scss'
import NextLink from 'next/link'

export const TOCRenderer = ({
  children,
}: {
  children: RichTextProps['children']
}) => {
  if (!children) return null

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
            a: (props) => (
              <Link color="gray" className={s.link} asChild>
                {/* TODO: Remove target when bug in basehub api is fixed */}
                <NextLink {...props} target="_self" />
              </Link>
            ),
            // li: (props) => (
            //   <Box asChild py="1">
            //     <li {...props} />
            //   </Box>
            // ),
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
