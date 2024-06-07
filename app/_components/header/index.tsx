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
import Image from 'next/image'
import { clsx } from 'clsx'
import { draftMode } from 'next/headers'

const navLinkFragment = fragmentOn('NavLinksItem', {
  _id: true,
  _title: true,
  href: true,
})

export type NavLinkFragment = fragmentOn.infer<typeof navLinkFragment>

export const Header = () => {
  return (
    <Pump
      draft={draftMode().isEnabled}
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
            logoLightMode: { url: true, alt: true, width: true, height: true },
            navLinks: {
              items: navLinkFragment,
            },
          },
        },
      ]}
      next={{ revalidate: 60 }}
    >
      {async ([{ settings }]) => {
        'use server'

        return (
          <header className={s.header}>
            <Container
              size="4"
              px={{ initial: '5', md: '8' }}
              height="100%"
              className={s['header__head']}
              position="relative"
            >
              <Grid
                align="center"
                columns={{
                  initial: '1fr auto',
                  sm: 'auto fit-content(80%) minmax(auto, 1fr)',
                  md: '1fr minmax(300px, auto) 1fr',
                }}
                gapX="4"
                height="100%"
              >
                <Flex asChild align="center" flexShrink="0" width="fit-content">
                  <NextLink href="/">
                    <Image
                      // only hide on light-mode if there's a light-mode logo
                      className={clsx(
                        settings.logoLightMode?.url && 'dark-only'
                      )}
                      src={settings.logo.url}
                      alt={''}
                      width={settings.logo.width}
                      height={settings.logo.height}
                      style={{ maxHeight: 28 }}
                    />
                    {settings.logoLightMode?.url && (
                      <Image
                        className="light-only"
                        src={settings.logoLightMode.url}
                        alt={''}
                        width={settings.logoLightMode.width}
                        height={settings.logoLightMode.height}
                        style={{ maxHeight: 28 }}
                      />
                    )}
                    {(settings.logo.alt || settings.logoLightMode?.alt) && (
                      <VisuallyHidden asChild>
                        <h2>
                          {settings.logo.alt || settings.logoLightMode?.alt}
                        </h2>
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
                        <Link key={item._id} color="gray" asChild size="2">
                          <NextLink href={item.href}>{item._title}</NextLink>
                        </Link>
                      )
                    })}
                  </nav>
                </Flex>
                <MobileNavbar links={settings.navLinks.items} />
              </Grid>
            </Container>
          </header>
        )
      }}
    </Pump>
  )
}
