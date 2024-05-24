import type { InlineIcon as Fragment } from '../[category]/[article]/_fragments'
import { ReactNode } from 'react'
import { IconButton, Tooltip, VisuallyHidden } from '@radix-ui/themes'
import { Icon } from './icon'

export const InlineIcon = (props: Fragment & { children?: ReactNode }) => (
  <Tooltip content={props.tooltip ?? props.children}>
    <IconButton
      disabled
      asChild
      size="1"
      style={{ color: 'inherit', cursor: 'default' }}
    >
      <div>
        <VisuallyHidden>{props.tooltip ?? props.children}</VisuallyHidden>
        <Icon name={props.name} height={15} width={15} />
      </div>
    </IconButton>
  </Tooltip>
)
