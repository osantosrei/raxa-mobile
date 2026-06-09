import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';

type BannerType = 'info' | 'success' | 'warning' | 'danger';

interface InfoBannerProps {
  message: string;
  type?: BannerType;
}

const config: Record<BannerType, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  info: { color: colors.primary, icon: 'information-circle' },
  success: { color: colors.success, icon: 'checkmark-circle' },
  warning: { color: colors.warning, icon: 'alert-circle' },
  danger: { color: colors.danger, icon: 'close-circle' },
};

export function InfoBanner({ message, type = 'info' }: InfoBannerProps) {
  const item = config[type];

  return (
    <View style={[styles.container, { backgroundColor: `${item.color}14`, borderColor: `${item.color}66` }]}>
      <Ionicons color={item.color} name={item.icon} size={20} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  message: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
});
