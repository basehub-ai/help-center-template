'use client'
import Cookie from 'js-cookie'
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
    const userFromCookie = Cookie.get('intercom-user')
    if (userFromCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userFromCookie))

        boot({
          name: user.name,
          email: user.email,
          avatar: {
            type: 'avatar',
            imageUrl: user.imageUrl,
          },
          userId: user.id,
          company: user.company,
          companies: user.companies,
        })
      } catch {
        console.error("Couldn't parse intercom user cookie")
        boot()
      }
    } else {
      boot()
    }
  }, [boot])

  React.useEffect(() => {
    const isChatEnabled = new URLSearchParams(window.location.search).get(
      'chat'
    )
    if (isChatEnabled !== null) {
      show()
    }
  }, [show])

  return null
}
