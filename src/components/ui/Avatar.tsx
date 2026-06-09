import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, typography } from '../../theme';

interface AvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';

  return `${first}${last}`.toUpperCase();
}

export function Avatar({ name, size = 40 }: AvatarProps) {
  return (
    <View
      accessibilityLabel={`Avatar de ${name}`}
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.max(12, size * 0.36) }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  initials: {
    color: colors.background,
    fontWeight: typography.weights.black,
  },
});
