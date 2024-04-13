"use client";

import { useThemeContext } from "@radix-ui/themes";
import { ThemeFragment } from "./server";
import { useEffect } from "react";

export const LiveThemeSwitcher = ({ data }: { data: ThemeFragment }) => {
  const {
    onAccentColorChange,
    onRadiusChange,
    onGrayColorChange,
    onAppearanceChange,
    onPanelBackgroundChange,
    onScalingChange,
  } = useThemeContext();

  useEffect(() => {
    onAccentColorChange(data.accentColor as any);
    onRadiusChange(data.radius as any);
    onGrayColorChange(data.grayScale as any);
    onAppearanceChange(data.appearance as any);
    onPanelBackgroundChange(data.panelBackground as any);
    onScalingChange(data.scaling as any);
  }, [
    data,
    onAccentColorChange,
    onAppearanceChange,
    onGrayColorChange,
    onPanelBackgroundChange,
    onRadiusChange,
    onScalingChange,
  ]);

  return null;
};
