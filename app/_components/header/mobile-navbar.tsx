'use client'
import { useToggleState } from '@/hooks/use-toggle-state'
import { HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Box, Button, Flex, IconButton, Link, Portal } from '@radix-ui/themes'
import { ThemeSwitcher } from '../theme-switcher'
import { NavLinkFragment } from './index'
import NextLink from 'next/link'

export const MobileNavbar = ({ links }: { links: NavLinkFragment[] }) => {
  const toggleState = useToggleState()

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
          <IconButton variant="ghost" color="gray">
            <MagnifyingGlassIcon />
          </IconButton>
          <IconButton
            variant="ghost"
            color="gray"
            onClick={toggleState.handleToggle}
          >
            <HamburgerMenuIcon />
          </IconButton>
        </nav>
      </Flex>
      <Portal
        className="curtain"
        container={
          document.querySelector('#theme-provider') as HTMLElement | null
        }
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
      <Portal
        asChild
        container={
          document.querySelector('#theme-provider') as HTMLElement | null
        }
      >
        <Flex
          style={{
            position: 'fixed',
            backgroundColor: 'var(--gray-1)',
            top: 52,
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
