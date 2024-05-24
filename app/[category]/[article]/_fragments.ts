import { fragmentOn } from '@/.basehub'

export const Callout = fragmentOn('CalloutComponent', {
  _id: true,
  content: {
    plainText: true,
  },
  type: true,
})

export type Callout = fragmentOn.infer<typeof Callout>

export const InlineIcon = fragmentOn('InlineIconComponent', {
  _id: true,
  name: true,
  tooltip: true,
})

export type InlineIcon = fragmentOn.infer<typeof InlineIcon>
