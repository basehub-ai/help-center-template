'use client'
import * as React from 'react'
import { sendEvent } from 'basehub/events'
import { GeneralEvents } from '@/.basehub/schema'

export const PageView = ({
  _analyticsKey,
}: {
  _analyticsKey: GeneralEvents['ingestKey']
}) => {
  // On mount, send the event
  React.useEffect(() => {
    sendEvent(_analyticsKey, { Name: 'view' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
