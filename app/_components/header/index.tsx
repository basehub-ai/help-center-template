/* eslint-disable @next/next/no-img-element */
import { Pump } from '@/.basehub/react-pump'
import {
  Button,
  Container,
  Flex,
  Grid,
  Link,
  VisuallyHidden,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { ThemeSwitcher } from '../theme-switcher'
import { SlashIcon } from '@radix-ui/react-icons'
import { Search } from '../search'
import s from './header.module.scss'

export const Header = () => {
  return (
    <Pump
      queries={[
        {
          index: {
            greeting: true,
            subtitle: {
              json: {
                content: true,
              },
            },
          },
          settings: {
            icon: { url: true, alt: true },
            navLinks: {
              items: {
                _id: true,
                _title: true,
                href: true,
              },
            },
          },
        },
      ]}
    >
      {async ([{ settings }]) => {
        'use server'

        return (
          <Container
            mb={{ initial: '2', sm: '9' }}
            px={{ initial: '5', md: '7' }}
            flexGrow="0"
          >
            <Grid
              align="center"
              columns={{
                initial: '1fr auto',
                sm: '1fr minmax(165px, auto) 1fr',
              }}
              gapX="4"
              py="3"
            >
              <Flex align="center" gap="1">
                <Flex asChild align="center" flexShrink="0">
                  <NextLink href="/">
                    <img
                      src={settings.icon.url}
                      alt={settings.icon.alt ?? ''}
                      style={{ width: 28, height: 28 }}
                    />
                    {settings.icon.alt && (
                      <VisuallyHidden asChild>
                        <h2>{settings.icon.alt}</h2>
                      </VisuallyHidden>
                    )}
                  </NextLink>
                </Flex>
                <SlashIcon
                  color="var(--gray-11)"
                  height={21}
                  style={{ flexShrink: 0 }}
                />
                <Link color="gray" style={{ color: 'var(--gray-12)' }} asChild>
                  <NextLink href="/">Help Center</NextLink>
                </Link>
              </Flex>
              <Search className={s.search} hideOnHomepage />
              <Flex
                gap="4"
                align="center"
                justify="end"
                asChild
                gridColumnStart="-2"
                display={{ initial: 'none', sm: 'flex' }}
              >
                <nav>
                  <ThemeSwitcher />
                  {settings.navLinks.items.map((item, i, { length }) => {
                    const isLast = i === length - 1
                    if (isLast) {
                      return (
                        <Button key={item._id} asChild>
                          <NextLink href={item.href}>{item._title}</NextLink>
                        </Button>
                      )
                    }
                    return (
                      <Link key={item._id} color="gray" asChild>
                        <NextLink href={item.href}>{item._title}</NextLink>
                      </Link>
                    )
                  })}
                </nav>
              </Flex>
            </Grid>
          </Container>
        )
      }}
    </Pump>
  )
}
