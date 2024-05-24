'use client'
import { Card, Flex, IconButton, Text } from '@radix-ui/themes'
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
      <Flex gap="2" align="center" wrap="wrap">
        <Text style={{ flexGrow: 1 }}>Did this answer your question?</Text>
        <Flex gap="2">
          <IconButton
            variant="ghost"
            mx="0 !important"
            color="gray"
            onClick={() => handleFeedback('negative')}
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
      </Flex>
    </Card>
  )
}
