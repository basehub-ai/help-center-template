import { Code, Text } from '@radix-ui/themes'
import { RichText, RichTextProps } from 'basehub/react-rich-text'
import s from './toc.module.scss'
import Link from 'next/link'

export const TOCRenderer = ({
  children,
}: {
  children: RichTextProps['children']
}) => {
  if (!children) return

  return (
    <div className={s.container}>
      <div>
        <div className={s.indicator} />
        <RichText
          components={{
            p: (props) => <Text size="2" as="p" {...props} />,
            a: (props) => (
              // {/* TODO: Remove target when bug in basehub api is fixed */}
              <Link {...props} target="_self" className={s.link} />
            ),
            // li: (props) => <li {...props} />,
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
