'use client'

import * as React from 'react'
import { IntercomProvider as Provider, useIntercom } from 'react-use-intercom'

export const IntercomProvider = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  return (
    <Provider appId="d8v8a4l7" initializeDelay={500}>
      <IntercomBooter />
      {children}
    </Provider>
  )
}

function IntercomBooter() {
  const { boot } = useIntercom()

  React.useEffect(() => {
    boot()
  }, [boot])

  return null
}
