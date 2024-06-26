'use client'

import * as React from 'react'
import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export const ImageWithZoom = ({
  caption,
  alt,
  ...rest
}: {
  caption?: string | undefined
  src: string
  alt?: string | null
  width?: number
  height?: number
}) => {
  return (
    <Zoom>
      <picture>
        <Image
          {...rest}
          alt={alt ?? ''}
          sizes="(min-width: 1024px) 1024px, 100vw"
        />
      </picture>
      {caption && <figcaption>{caption}</figcaption>}
    </Zoom>
  )
}
