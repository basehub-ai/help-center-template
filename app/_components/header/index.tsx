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
import s from './header.module.scss'
import { MobileNavbar } from './mobile-navbar'
import { fragmentOn } from '@/.basehub'
import { DialogTriggerDesktop as Search } from '../search'

const navLinkFragment = fragmentOn('NavLinksItem', {
  _id: true,
  _title: true,
  href: true,
})

export type NavLinkFragment = fragmentOn.infer<typeof navLinkFragment>

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
            logo: { url: true, alt: true, width: true, height: true },
            navLinks: {
              items: navLinkFragment,
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
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 49,
              backgroundColor: 'var(--gray-1)',
            }}
          >
            <Grid
              align="center"
              columns={{
                initial: '1fr auto',
                sm: '1fr minmax(165px, auto) 1fr',
              }}
              gapX="4"
              height="var(--header-height)"
            >
              <Flex asChild align="center" flexShrink="0">
                <NextLink href="/">
                  <img
                    src={settings.logo.url}
                    alt={settings.logo.alt ?? ''}
                    style={{
                      width: settings.logo.width,
                      height: settings.logo.height,
                      maxHeight: 28,
                    }}
                  />
                  {settings.logo.alt && (
                    <VisuallyHidden asChild>
                      <h2>{settings.logo.alt}</h2>
                    </VisuallyHidden>
                  )}
                </NextLink>
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
              <MobileNavbar links={settings.navLinks.items} />
            </Grid>
          </Container>
        )
      }}
    </Pump>
  )
}
