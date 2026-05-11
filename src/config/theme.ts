import { ThemeConfig } from 'antd';

export const colors = {
  primary: 'var(--color-primary)',       // Naranja Boxful
  secondary: 'var(--color-secondary)',   // Azul Marino Oscuro
  background: 'var(--color-background)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  textBase: 'var(--color-text-base)',
  textSecondary: 'var(--color-text-secondary)',
  bgLayout: 'var(--color-bg-layout)',
  border: 'var(--color-border)',
  backgroundPattern: 'var(--color-bg-pattern)',
  black: 'var(--color-black)',
  white: 'var(--color-white)',
};


export const theme: ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: colors.primary,
    colorInfo: colors.primary,
    borderRadius: 8,
    fontSize: 16,
    lineHeight: 1.5,
    fontFamily: '"Mona Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    colorTextBase: colors.textBase,
    colorBgLayout: colors.bgLayout,
  },
  components: {
    Button: {
      colorPrimary: colors.primary,
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      colorBorder: colors.border,
    },
    Typography: {
      colorTextHeading: colors.textBase,
    },
  },
};
