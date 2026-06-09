import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';
import type { MatchStatus } from '../../types/api';

const statusConfig: Record<MatchStatus, { label: string; color: string }> = {
  OPEN: { label: 'Aberta', color: colors.success },
  FULL: { label: 'Cheia', color: colors.warning },
  CANCELLED: { label: 'Cancelada', color: colors.danger },
  FINISHED: { label: 'Encerrada', color: colors.textMuted },
};

interface StatusBadgeProps {
  status: MatchStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View
      accessibilityLabel={`Status da partida: ${config.label}`}
      style={[styles.badge, { backgroundColor: `${config.color}22` }]}
    >
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.black,
    textTransform: 'uppercase',
  },
});
