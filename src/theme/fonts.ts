export const fontFamilies = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontAssets = {
  [fontFamilies.regular]: require("../../assets/fonts/Poppins-Regular.ttf"),
  [fontFamilies.medium]: require("../../assets/fonts/Poppins-Medium.ttf"),
  [fontFamilies.semibold]: require("../../assets/fonts/Poppins-SemiBold.ttf"),
  [fontFamilies.bold]: require("../../assets/fonts/Poppins-Bold.ttf"),
} as const;
