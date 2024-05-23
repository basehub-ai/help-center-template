'use client'
import { useToggleState } from '@/hooks/use-toggle-state'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Box, Button, Flex, IconButton, Link, Portal } from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'
import { NavLinkFragment } from './index'
import NextLink from 'next/link'
import * as React from 'react'
import { DialogTriggerMobile as Search } from '../search'

export const MobileNavbar = ({ links }: { links: NavLinkFragment[] }) => {
  const toggleState = useToggleState()
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!document) return
    setContainer(document.getElementById('theme-provider'))
  }, [])

  return (
    <>
      <Flex
        gap="4"
        align="center"
        justify="end"
        asChild
        gridColumnStart="-2"
        display={{ initial: 'flex', sm: 'none' }}
      >
        <nav>
          <Search />
          <IconButton
            variant="ghost"
            color="gray"
            onClick={toggleState.handleToggle}
          >
            <HamburgerMenuIcon height={18} width={18} />
          </IconButton>
        </nav>
      </Flex>
      <Portal
        className="curtain"
        container={container}
        onClick={toggleState.handleOff}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 48,
        }}
        asChild
      >
        <Box
          display={{ initial: toggleState.isOn ? 'block' : 'none', sm: 'none' }}
        />
      </Portal>
      <Portal asChild container={container}>
        <Flex
          style={{
            position: 'fixed',
            backgroundColor: 'var(--color-background)',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            zIndex: 51,
          }}
          p="6"
          pb="9"
          direction="column"
          gap="4"
          align="start"
          display={{ initial: toggleState.isOn ? 'flex' : 'none', sm: 'none' }}
        >
          <ThemeSwitcher style={{ position: 'absolute', right: 24, top: 24 }} />
          {links.map((item, i, { length }) => {
            const isLast = i === length - 1
            if (isLast) {
              return (
                <Button key={item._id} asChild size="2">
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
        </Flex>
      </Portal>
    </>
  )
}
