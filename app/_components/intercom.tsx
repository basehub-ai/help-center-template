'use client'

import * as React from 'react'
import { IntercomProvider as Provider, useIntercom } from 'react-use-intercom'

export const IntercomProvider = ({
  children,
  ...rest
}: {
  children?: React.ReactNode
  appId: string
}) => {
  return (
    <Provider {...rest} initializeDelay={500}>
      <IntercomBooter />
      {children}
    </Provider>
  )
}

function IntercomBooter() {
  const { boot, show } = useIntercom()

  React.useEffect(() => {
    boot()
  }, [boot])

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const isChatEnabled = new URLSearchParams(window.location.search).get(
      'chat'
    )
    if (isChatEnabled !== null) {
      show()
    }
  }, [show])

  return null
}
