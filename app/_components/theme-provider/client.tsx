'use client'

import { useThemeContext } from '@radix-ui/themes'
import { ThemeFragment } from './server'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { useHasRendered } from '@/hooks/use-has-rendered'

export const LiveThemeSwitcher = ({ theme }: { theme: ThemeFragment }) => {
  const {
    onAccentColorChange,
    onRadiusChange,
    onGrayColorChange,
    onScalingChange,
    onAppearanceChange,
    onPanelBackgroundChange,
  } = useThemeContext()
  const { setTheme, theme: activeTheme } = useTheme()
  const activeThemeRef = React.useRef(activeTheme)
  activeThemeRef.current = activeTheme
  const hasRendered = useHasRendered()

  React.useEffect(() => {
    // wait for first render to happen before re-syncing theme
    if (!hasRendered) return
    onAccentColorChange(theme.accentColor)
    onRadiusChange(theme.radius)
    onGrayColorChange(theme.grayScale)
    onAppearanceChange(theme.appearance)
    onScalingChange(theme.scaling)
    onPanelBackgroundChange(theme.panelBackground)

    const themeChanged =
      activeThemeRef.current !== theme.appearance &&
      theme.appearance !== 'inherit'
    if (themeChanged && theme.appearance) {
      if (!theme.appearance || theme.appearance === 'inherit') {
        setTheme('system')
      }
      return setTheme(theme.appearance)
    }
  }, [
    theme.accentColor,
    theme.radius,
    theme.grayScale,
    theme.appearance,
    theme.scaling,
    theme.panelBackground,
    onAccentColorChange,
    onGrayColorChange,
    onAppearanceChange,
    onRadiusChange,
    onScalingChange,
    onPanelBackgroundChange,
    setTheme,
    hasRendered,
  ])

  return null
}
