import { InfoCircledIcon } from '@radix-ui/react-icons'

export const Icon = ({
  name,
  ...rest
}: { name: string } & React.ComponentProps<typeof InfoCircledIcon>) => {
  switch (name.toLowerCase()) {
    case 'info':
      return <InfoCircledIcon {...rest} />

    default:
      return `Icon not found: ${name}`
  }
}
