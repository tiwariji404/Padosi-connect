export const colors = {
  primary: '#16A34A',       // Vibrant community green
  primaryDark: '#15803D',
  primaryLight: '#DCFCE7',
  primaryMuted: '#86EFAC',
  
  secondary: '#0284C7',     // Sky blue
  secondaryLight: '#E0F2FE',
  
  danger: '#EF4444',        // SOS red
  dangerDark: '#DC2626',
  dangerLight: '#FEE2E2',
  
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  dark: '#0F172A',
  text: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  white: '#FFFFFF',
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700', color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', color: colors.text },
  h3: { fontSize: 16, fontWeight: '600', color: colors.text },
  body: { fontSize: 14, color: colors.text },
  bodySecondary: { fontSize: 13, color: colors.textSecondary },
  caption: { fontSize: 11, color: colors.textMuted },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
