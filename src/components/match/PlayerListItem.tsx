import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../theme';
import type { PlayerResponse } from '../../types/api';
import { Avatar } from '../ui/Avatar';

interface PlayerListItemProps {
  player: PlayerResponse;
}

function formatJoinedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Confirmado';
  }

  return `Confirmou em ${format(date, "dd/MM 'às' HH:mm", { locale: ptBR })}`;
}

export function PlayerListItem({ player }: PlayerListItemProps) {
  return (
    <View style={styles.row}>
      <Avatar name={player.name} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.date}>{formatJoinedAt(player.joinedAt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
});
