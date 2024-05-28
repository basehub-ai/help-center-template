'use client'
import { Card, Flex, Grid, IconButton, Text } from '@radix-ui/themes'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { sendEvent } from 'basehub/analytics'
import * as React from 'react'

export const Feedback = ({
  analyticsKey: _analyticsKey,
}: {
  analyticsKey: string
}) => {
  const [bothFeedbackSent, setBothFeedbackSent] = React.useState(false)
  const [previousFeedback, setPreviousFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)

  const handleFeedback = (type: 'positive' | 'negative') => {
    if (previousFeedback === type) return
    // If the user has already given feedback twice, stop sending the event.
    !bothFeedbackSent && sendEvent({ _analyticsKey, name: `feedback:${type}` })
    if (previousFeedback) setBothFeedbackSent(true)
    setPreviousFeedback(type)
    window.localStorage.setItem(`feedback:${_analyticsKey}`, type)
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const previousFeedback = window.localStorage.getItem(
      `feedback:${_analyticsKey}`
    ) as 'positive' | 'negative' | null

    setPreviousFeedback(previousFeedback)
  }, [_analyticsKey])

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
              fill={
                previousFeedback === 'negative' ? 'var(--accent-12)' : 'none'
              }
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
              fill={
                previousFeedback === 'positive' ? 'var(--accent-12)' : 'none'
              }
            />
          </IconButton>
        </Flex>
        {previousFeedback === 'negative' && (
          <Text style={{ gridColumn: '1 / -1' }} size="2" color="gray">
            If you're still facing issues using BaseHub you can always contact
            our team through the chat bubble on the bottom right corner.
          </Text>
        )}
      </Grid>
    </Card>
  )
}
