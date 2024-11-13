'use client'
import { Test } from '@/.basehub/schema'
import { Card, Flex, Grid, IconButton, Text } from '@radix-ui/themes'
import { sendEvent, updateEvent } from 'basehub/events'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import * as React from 'react'

export function Feedback({
  eventKey,
  adminKey,
  articleId,
}: {
  eventKey: Test['ingestKey']
  adminKey: Test['adminKey']
  articleId: string
}) {
  const [feedbackId, setFeedbackId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [sentFeedback, setSentFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (sentFeedback === type) return

    // If the user has already given feedback, update the event.
    const message = prompt('Feedback message', 'Default message') ?? ''
    const response = feedbackId
      ? await updateEvent(adminKey, feedbackId, {
          message,
          positive: type === 'positive',
        })
      : await sendEvent(eventKey, {
          message,
          positive: type === 'positive',
          category: 'eng',
        })

    if (response.success) {
      setSentFeedback(type)
      setError(null)
      setFeedbackId(response.eventId)
      window.localStorage.setItem(
        `feedback:${eventKey}:${articleId}`,
        JSON.stringify({ type, id: response.eventId })
      )
    } else {
      setSentFeedback(null)
      setError(response.error)
    }
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const previousFeedback = window.localStorage.getItem(
      `feedback:${eventKey}:${articleId}`
    )

    if (!previousFeedback) return
    const { type, id } = JSON.parse(previousFeedback)
    setFeedbackId(id)
    setSentFeedback(type)
  }, [eventKey, articleId])

  return (
    <Card variant="classic" size="3">
      <Grid columns={{ initial: '1', xs: '1fr auto' }} gap="2" align="center">
        <Text style={{ flexGrow: 1 }}>Did this answer your question?</Text>
        <Flex gap="2">
          <IconButton
            variant="ghost"
            mx="0 !important"
            color="gray"
            onClick={() => handleFeedback('negative')}
            aria-label="No, it did not."
          >
            <ThumbsDown
              height={16}
              width={16}
              fill={sentFeedback === 'negative' ? 'var(--accent-12)' : 'none'}
            />
          </IconButton>
          <IconButton
            variant="ghost"
            mx="0 !important"
            color="gray"
            onClick={() => handleFeedback('positive')}
            aria-label="Yes, the problem is solved."
          >
            <ThumbsUp
              height={16}
              width={16}
              fill={sentFeedback === 'positive' ? 'var(--accent-12)' : 'none'}
            />
          </IconButton>
        </Flex>
        {sentFeedback === 'negative' && (
          <Text style={{ gridColumn: '1 / -1' }} size="2" color="gray">
            If you're still facing issues using BaseHub you can always contact
            our team through the chat bubble on the bottom right corner.
          </Text>
        )}
        {error && (
          <Text style={{ gridColumn: '1 / -1' }} size="2" color="red">
            {error}
          </Text>
        )}
      </Grid>
    </Card>
  )
}
