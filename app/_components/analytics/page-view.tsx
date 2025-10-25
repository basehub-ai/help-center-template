'use client'
import type { Views } from '@/.basehub/basehub-types'
import * as React from 'react'
import { sendEvent } from 'basehub/events'

export const PageView = ({ ingestKey }: { ingestKey: Views['ingestKey'] }) => {
  // On mount, send the event
  React.useEffect(() => {
    sendEvent(ingestKey)
  }, [ingestKey])

  return null
}
