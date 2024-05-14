'use client'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { TextField } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import { CSSProperties } from 'react'

export const Search = ({
  hideOnHomepage = false,
  ...props
}: {
  style?: CSSProperties
  hideOnHomepage?: boolean
  className?: string
}) => {
  const pathname = usePathname()

  if (pathname === '/' && hideOnHomepage) return null

  return (
    <TextField.Root {...props} placeholder="Search articles...">
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  )
}
