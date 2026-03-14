import { StyleSheet } from 'react-native';

// Core palette pulled from the provided design reference
export const colors = {
  primary: {
    main: '#F76B10',
  },
  secondary: {
    yellow: '#FBBE47',
    blue: '#3B82F7',
    green: '#2BD697',
    darkOrange: '#8C3700',
  },
  neutral: {
    white: '#FFFFFF',
    grey: '#F0F0EE',
    grey2: '#E7E1E1',
    softDarkish: '#444D55',
  },
  gradient: {
    orangeLinear: ['#F76B10', '#F98F4A'],
    blackLinear: ['#171924', '#171924'],
    buttonLinear: ['#20222C', '#20222C'],
    dividerLinear: ['#20222C', '#20222C00'],
  },
  text: {
    primary: '#20222C',
    secondary: '#6B6B6B',
    inverse: '#FDFDFD',
  },
  state: {
    info: '#2F80ED',
    success: '#27AE60',
    warning: '#E2B33B',
    error: '#EB5757',
  },
  background: {
    base: '#F5F5F5',
    surface: '#FFFFFF',
    muted: '#E7E1E1',
  },
  brand: {
    maroon: '#7A0F12',
    maroonLight: '#7A0F12',
    link: '#0D63C7',
  },
  placeholder: '#A8A8A8',
  disabledButton: '#DADADA',
  disabledButtonText: '#9EA3A9',
};

// Font families loaded via @expo-google-fonts/inter in app/_layout.tsx
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Typography scale based on the supplied spec sheet
export const typography = {
  heading1: { fontSize: 32, lineHeight: 48, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  heading2: { fontSize: 20, lineHeight: 30, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  heading3: { fontSize: 18, lineHeight: 28, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  heading4: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  heading5: { fontSize: 14, lineHeight: 21, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  heading6: { fontSize: 12, lineHeight: 18, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  loginHeading: { fontSize: 35, lineHeight: 42, letterSpacing: 0, fontFamily: fontFamilies.bold },
  loginHeadingCompact: { fontSize: 28, lineHeight: 32, letterSpacing: 0, fontFamily: fontFamilies.bold },

  body1: { fontSize: 14, lineHeight: 24, letterSpacing: 0, fontFamily: fontFamilies.regular },
  body2: { fontSize: 12, lineHeight: 22, letterSpacing: 0, fontFamily: fontFamilies.regular },
  body3: { fontSize: 12, lineHeight: 20, letterSpacing: 0, fontFamily: fontFamilies.medium },
  body4: { fontSize: 12, lineHeight: 16, letterSpacing: 0, fontFamily: fontFamilies.regular },
  body5: { fontSize: 10, lineHeight: 14, letterSpacing: 0, fontFamily: fontFamilies.regular },
  body6: { fontSize: 6, lineHeight: 10, letterSpacing: 0, fontFamily: fontFamilies.medium },

  button1: { fontSize: 14, lineHeight: 18, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  button2: { fontSize: 12, lineHeight: 20, letterSpacing: 0, fontFamily: fontFamilies.medium },
  button3: { fontSize: 10, lineHeight: 14, letterSpacing: 0, fontFamily: fontFamilies.semiBold },

  caption1: { fontSize: 16, lineHeight: 24, letterSpacing: 0, fontFamily: fontFamilies.regular },
  caption2: { fontSize: 14, lineHeight: 21, letterSpacing: 0, fontFamily: fontFamilies.regular },
  caption3: { fontSize: 12, lineHeight: 24, letterSpacing: 0, fontFamily: fontFamilies.semiBold },
  caption4: { fontSize: 12, lineHeight: 16, letterSpacing: 0, fontFamily: fontFamilies.medium },
  caption5: { fontSize: 12, lineHeight: 12, letterSpacing: 0, fontFamily: fontFamilies.regular },
  caption6: { fontSize: 10, lineHeight: 14, letterSpacing: 0, fontFamily: fontFamilies.medium },
  caption7: { fontSize: 6, lineHeight: 10, letterSpacing: 0, fontFamily: fontFamilies.regular },
};

export const textVariants = StyleSheet.create(
  Object.entries(typography).reduce((acc, [key, value]) => {
    acc[key] = {
      fontSize: value.fontSize,
      fontFamily: value.fontFamily,
      ...(value.lineHeight ? { lineHeight: value.lineHeight } : {}),
      ...(value.letterSpacing ? { letterSpacing: value.letterSpacing } : {}),
    };
    return acc;
  }, {}),
);

export const theme = {
  colors,
  typography,
  textVariants,
  fontFamilies,
};
