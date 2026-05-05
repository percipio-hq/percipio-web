export const colors = {
  bg: {
    page:     '#0A0E1A',
    surface:  '#111827',
    elevated: '#1A2235',
    border:   '#222D42',
  },
  brand: {
    dark:    '#0F6E56',
    primary: '#1D9E75',
    light:   '#5DCAA5',
    muted:   '#9FE1CB',
  },
  semantic: {
    info:    '#378ADD',
    success: '#1D9E75',
    danger:  '#E24B4A',
    warning: '#EF9F27',
  },
  text: {
    primary:   '#F8FAFC',
    secondary: '#94A3B8',
    muted:     '#475569',
  },
} as const;

export type Colors = typeof colors;
