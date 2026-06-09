import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface InfoRowProps {
  icon: IconName;
  text: string;
}

export function InfoRow({ icon, text }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons color={colors.primary} name={icon} size={18} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  text: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
});
