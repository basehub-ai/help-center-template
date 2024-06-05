import { InfoCircledIcon } from '@radix-ui/react-icons'
import { icons, LucideProps } from 'lucide-react'
import { pascalCase } from 'change-case'

export const Icon = ({ name, ...rest }: { name: string } & LucideProps) => {
  const Icon =
    icons[
      pascalCase(name, { mergeAmbiguousCharacters: true }) as keyof typeof icons
    ] ?? InfoCircledIcon

  return <Icon {...rest} />
}
