'use client'
import * as React from 'react'
import type { Test } from '@/.basehub/schema'
import { getEvents } from 'basehub/events'
import { Flex, Heading, Separator, Text } from '@radix-ui/themes'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'

export const CommentsComp = ({ eventKey }: { eventKey: Test['adminKey'] }) => {
  const { data } = useQuery(['messages', 'ref'], async () => {
    const res = await getEvents(eventKey, {
      type: 'table',
      first: 10,
      skip: 0,
      select: {
        category: true,
        positive: true,
        message: true,
      },
      filter: {
        message: { regex: 'y\\s' },
      },
      orderBy: 'category__ASC',
    })
    if (res.success) {
      return res.data
    } else {
      throw new Error(res.error)
    }
  })

  return (
    <>
      <Separator />
      <Heading mb="2" mt="6">
        What people are saying
      </Heading>
      <Flex direction="column" gap="4">
        {data?.map((message) => (
          <Text key={message.date}>
            {message.date}: {message.message} {message.category}{' '}
            {message.positive ? '✅' : '❌'}
          </Text>
        ))}
      </Flex>
    </>
  )
}

export const Comments = ({ eventKey }: { eventKey: Test['adminKey'] }) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <CommentsComp eventKey={eventKey} />
    </QueryClientProvider>
  )
}
