import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View accessibilityRole="alert" style={styles.container}>
      <View style={styles.content}>
        <Ionicons color={colors.danger} name="alert-circle" size={20} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onRetry ? <Button label="Tentar novamente" onPress={onRetry} variant="ghost" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${colors.danger}14`,
    borderColor: `${colors.danger}66`,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  message: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
});
