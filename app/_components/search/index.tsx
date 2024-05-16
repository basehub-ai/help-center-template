'use client'
import * as React from 'react'
import { useSearch, SearchBox, Hit } from 'basehub/react-search'
import { Cross1Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
  Box,
  Dialog,
  Flex,
  IconButton,
  Kbd,
  ScrollArea,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes'
import NextLink from 'next/link'
import { getArticleSlugFromSlugPath } from '@/lib/basehub-helpers/util'
import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import { CSSProperties } from 'react'
import s from './search.module.scss'

export const SearchProvider = ({
  _searchKey,
  children,
  disableHotkey = false,
}: {
  _searchKey: string | null
  children: React.ReactNode
  disableHotkey?: boolean
}) => {
  const [open, setOpen] = React.useState(false)

  const search = useSearch({
    _searchKey,
    queryBy: ['_title', 'body', 'excerpt'],
    saveRecentSearches: {
      key: 'docs-recent-searches',
      getStorage: () => localStorage,
    },
  })

  React.useEffect(() => {
    if (disableHotkey) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault()
        setOpen((p) => !p)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [disableHotkey])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children}
      <SearchBox.Root
        search={search}
        onHitSelect={() => {
          setOpen(false)
        }}
        key={open ? 'open' : 'closed'}
      >
        <DialogContent />
      </SearchBox.Root>
    </Dialog.Root>
  )
}

const DialogContent = () => {
  const search = SearchBox.useContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <Dialog.Content maxWidth="550px" className={s['search-dialog__content']}>
      <Flex direction="column" height="100%">
        <SearchBox.Input asChild>
          <TextField.Root
            ref={inputRef}
            placeholder="Search"
            mx="2"
            mt="2"
            size="3"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon color="currentColor" />
            </TextField.Slot>
            <TextField.Slot>
              <Kbd style={{ marginBlock: 'auto' }}>Esc</Kbd>
            </TextField.Slot>
          </TextField.Root>
        </SearchBox.Input>
        <Separator size="4" mt="2" />
        <ScrollArea scrollbars="vertical" asChild>
          <Box
            className={s['search-dialog__results']}
            flexGrow="1"
            flexShrink="1"
            flexBasis="0%"
            px="2"
          >
            <SearchBox.Empty asChild>
              <Flex align="center" px="2" py="1">
                <Text
                  size="2"
                  color="gray"
                  className={s['search-dialog__empty-state']}
                >
                  No results for{' '}
                  <Text as="span" weight="bold">
                    &ldquo;{search.query}&rdquo;
                  </Text>
                </Text>
              </Flex>
            </SearchBox.Empty>
            <SearchBox.Placeholder asChild>
              {search.recentSearches?.hits?.length ? (
                <HitList hits={search.recentSearches?.hits ?? []} isRecent />
              ) : (
                <Flex align="center" px="2" py="1">
                  <Text
                    size="2"
                    color="gray"
                    className={s['search-dialog__empty-state']}
                  >
                    No recent searches.
                  </Text>
                </Flex>
              )}
            </SearchBox.Placeholder>

            <HitList hits={search.result?.hits ?? []} />
          </Box>
        </ScrollArea>
      </Flex>
    </Dialog.Content>
  )
}

const HitList = ({ hits, isRecent }: { hits: Hit[]; isRecent?: boolean }) => {
  const search = SearchBox.useContext()
  return (
    <SearchBox.HitList>
      {isRecent && (
        <Text weight="medium" color="gray" size="1" ml="3" mb="1" as="p">
          Recent searches
        </Text>
      )}
      {hits.map((hit) => {
        let pathname = getArticleSlugFromSlugPath(hit.document._slugPath ?? '')

        // TODO is there an opportunity to build a helper function in our SDK here? looks like a common usecase
        const bodyHighlight = hit.highlights
          .map((h) => {
            if (h.fieldPath.startsWith('body') === false) return
            const splitted = h.fieldPath.split('.').slice(0, 2)
            const fullField = hit._getField(splitted.join('.'))
            return fullField
          })
          .filter(Boolean)[0] as { _id: string | undefined } | undefined

        if (bodyHighlight?._id) {
          pathname += `#${bodyHighlight._id}`
        }

        return (
          <Box
            key={hit._key}
            className={clsx(
              s['search-dialog-content__result'],
              isRecent && s['search-dialog-content__result-recent']
            )}
          >
            <SearchBox.HitItem hit={hit} href={pathname} asChild>
              <NextLink
                href={pathname}
                className={s['search-dialog-content__result-link']}
              >
                <SearchBox.HitSnippet
                  fieldPath="_title"
                  components={{
                    container: ({ children }) => (
                      <Text size="2" weight="medium" as="p">
                        {children}
                      </Text>
                    ),
                    ...(isRecent ? { mark: ({ children }) => children } : {}),
                  }}
                />
                <SearchBox.HitSnippet
                  fieldPath="body"
                  components={{
                    container: ({ children }) => (
                      <Text size="1" mt="1" as="p">
                        {children}
                      </Text>
                    ),
                    ...(isRecent ? { mark: ({ children }) => children } : {}),
                  }}
                />
              </NextLink>
            </SearchBox.HitItem>
            {isRecent && (
              <IconButton
                variant="soft"
                color="gray"
                onClick={() => {
                  search.recentSearches?.remove(hit._key)
                }}
                className={s['search-dialog-content__remove']}
                aria-label="Remove recent search"
              >
                <Cross1Icon />
              </IconButton>
            )}
          </Box>
        )
      })}
    </SearchBox.HitList>
  )
}

export const DialogTriggerMobile = () => {
  return (
    <Dialog.Trigger>
      <IconButton variant="ghost" color="gray">
        <MagnifyingGlassIcon />
      </IconButton>
    </Dialog.Trigger>
  )
}

export const DialogTriggerDesktop = ({
  hideOnHomepage = false,
  className,
  ...props
}: {
  style?: CSSProperties
  hideOnHomepage?: boolean
  className?: string
}) => {
  const pathname = usePathname()

  if (pathname === '/' && hideOnHomepage) return null

  return (
    <Dialog.Trigger style={{ width: '100%' }} className={className}>
      <button
        style={{
          padding: 0,
          background: 'none',
          border: 'none',
        }}
        tabIndex={-1}
        onFocus={(e) => {
          e.preventDefault()
          e.currentTarget.querySelector('input')?.focus()
        }}
      >
        <TextField.Root
          {...props}
          readOnly
          placeholder="Search articles..."
          size="2"
          className={s['search-trigger']}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.closest('button')?.click()
            }
          }}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon color="currentColor" height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot>
            <Flex align="center" justify="between" gap="1">
              <Kbd>⌘</Kbd>
              <Kbd>k</Kbd>
            </Flex>
          </TextField.Slot>
        </TextField.Root>
      </button>
    </Dialog.Trigger>
  )
}
