import { ThemeConfig } from 'antd';

export const colors = {
  primary: '#ff5c35',       // Naranja Boxful
  secondary: '#111827',     // Azul Marino Oscuro
  background: '#EDEDED',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  textBase: '#050817',
  textSecondary: '#4E4C4C',
  bgLayout: '#f9fafb',
  border: '#e5e7eb',
  backgroundPattern: '#2E49CE',
};

export const theme: ThemeConfig = {
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
