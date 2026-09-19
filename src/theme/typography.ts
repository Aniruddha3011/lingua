import type { TextStyle } from "react-native";

import { colors } from "./colors";
import { fontFamilies } from "./fonts";

export const typography = {
  h1: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    lineHeight: 38.4,
  },
  h2: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.semibold,
    fontSize: 24,
    lineHeight: 31.2,
  },
  h3: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
    lineHeight: 26,
  },
  h4: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 22.4,
  },
  bodyLarge: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 25.6,
  },
  bodyMedium: {
    color: colors.neutral.textPrimary,
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 22.4,
  },
  bodySmall: {
    color: colors.neutral.textSecondary,
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20.8,
  },
  caption: {
    color: colors.neutral.textSecondary,
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15.4,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
