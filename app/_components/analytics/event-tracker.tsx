'use client'

import { GeneralEvents } from '@/.basehub/schema'
import { Slot } from '@radix-ui/react-slot'

import { sendEvent } from 'basehub/events'

export const EventTracker = ({
  children,
  eventName = 'click',
  _analyticsKey,
  metadata,
}: {
  children: React.ReactNode
  eventName?: string
  _analyticsKey: GeneralEvents['ingestKey']
  metadata?: Record<string, any>
}) => {
  return (
    <Slot
      onClick={() =>
        sendEvent(_analyticsKey, {
          Name: eventName,
          ...metadata,
        })
      }
    >
      {children}
    </Slot>
  )
}
