import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

interface LoadingSpinnerProps {
  label?: string;
  inline?: boolean;
}

export function LoadingSpinner({ label = 'Carregando', inline = false }: LoadingSpinnerProps) {
  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      style={[styles.container, inline && styles.inline]}
    >
      <ActivityIndicator color={colors.primary} size={inline ? 'small' : 'large'} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 160,
  },
  inline: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    minHeight: 0,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});
