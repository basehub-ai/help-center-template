'use client'
import { Test } from '@/.basehub/schema'
import { Card, Flex, Grid, IconButton, Text } from '@radix-ui/themes'
import { sendEventV2 } from 'basehub/analytics'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import * as React from 'react'

export function Feedback({ eventKey }: { eventKey: Test['ingestKey'] }) {
  const [bothFeedbackSent, setBothFeedbackSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sentFeedback, setSentFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (sentFeedback === type) return
    // If the user has already given feedback twice, stop sending the event.
    if (!bothFeedbackSent) {
      const message = prompt('Feedback message', 'Default message') ?? ''
      const response = await sendEventV2(eventKey, {
        message,
        category: 'eng',
        positive: type === 'positive',
      })

      if (response.success) {
        setSentFeedback(type)
        setError(null)
      } else {
        setSentFeedback(null)
        setError(response.error)
      }
    }
    if (sentFeedback) setBothFeedbackSent(true)
    // window.localStorage.setItem(`feedback:${_analyticsKey}`, type)
  }

  // React.useEffect(() => {
  //   if (typeof window === 'undefined') return
  //   const previousFeedback = window.localStorage.getItem(
  //     `feedback:${_analyticsKey}`
  //   ) as 'positive' | 'negative' | null

  //   setSentFeedback(previousFeedback)
  // }, [_analyticsKey])

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
