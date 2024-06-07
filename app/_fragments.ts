import { fragmentOn } from 'basehub'

export const MetadataFragment = fragmentOn('MetadataComponent', {
  title: true,
  description: true,
  icon: { url: true },
})
