import { basehub, fragmentOn } from 'basehub'
import { Theme } from '@radix-ui/themes'
import { ThemeProvider as NextThemesThemeProvider } from 'next-themes'
import { Pump } from 'basehub/react-pump'
import { LiveThemeSwitcher } from './client'

import '@radix-ui/themes/styles.css'
import { draftMode } from 'next/headers'

export const ThemeFragment = fragmentOn('Theme', {
  accentColor: true,
  appearance: true,
  grayScale: true,
  panelBackground: true,
  radius: true,
  scaling: true,
})

export type ThemeFragment = fragmentOn.infer<typeof ThemeFragment>

export const ThemeProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const data = await basehub({
    next: { revalidate: 60 },
    draft: (await draftMode()).isEnabled,
  }).query({
    settings: {
      theme: ThemeFragment,
    },
  })

  return (
    <NextThemesThemeProvider
      attribute="class"
      forcedTheme={
        data.settings.theme.appearance === 'inherit'
          ? undefined
          : data.settings.theme.appearance
      }
    >
      <Theme
        id="theme-provider"
        accentColor={data.settings.theme.accentColor}
        grayColor={data.settings.theme.grayScale}
        radius={data.settings.theme.radius}
        scaling={data.settings.theme.scaling}
        appearance={data.settings.theme.appearance}
        panelBackground={data.settings.theme.panelBackground}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
        <Pump
          draft={(await draftMode()).isEnabled}
          queries={[{ settings: { theme: ThemeFragment } }]}
          next={{ revalidate: 60 }}
        >
          {async ([data]) => {
            'use server'
            return <LiveThemeSwitcher theme={data.settings.theme} />
          }}
        </Pump>
      </Theme>
    </NextThemesThemeProvider>
  )
}
