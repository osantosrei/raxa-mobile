export const colors = {
  primary: '#FF6B00',
  primaryDark: '#CC5500',
  background: '#121212',
  surface: '#1E1E1E',
  surfaceHigh: '#2A2A2A',
  text: '#F5F5F5',
  textMuted: '#9E9E9E',
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  border: '#333333',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const typography = {
  fontFamily: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    hero: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
} as const;

export const shadows = {
  card: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
} as const;
