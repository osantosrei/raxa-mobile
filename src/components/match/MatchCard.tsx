import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '../../theme';
import type { MatchResponse } from '../../types/api';
import { StatusBadge } from '../ui/StatusBadge';

interface MatchCardProps {
  match: MatchResponse;
  onPress: () => void;
}

function formatMatchDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data a confirmar';
  }

  return format(date, "dd 'de' MMM, HH:mm", { locale: ptBR });
}

export function MatchCard({ match, onPress }: MatchCardProps) {
  const spotsLeft = Math.max(match.maxPlayers - match.currentPlayers, 0);
  const hasSpots = match.status === 'OPEN' && spotsLeft > 0;

  return (
    <Pressable
      accessibilityHint="Abre os detalhes da partida"
      accessibilityLabel={`${match.title}, ${match.currentPlayers} de ${match.maxPlayers} jogadores confirmados`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text numberOfLines={2} style={styles.title}>
            {match.title}
          </Text>
          <Text style={styles.creator}>por {match.creator.name}</Text>
        </View>
        <StatusBadge status={match.status} />
      </View>

      <View style={styles.infoRow}>
        <Ionicons color={colors.primary} name="location" size={18} />
        <Text numberOfLines={1} style={styles.infoText}>
          {match.location}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons color={colors.primary} name="calendar" size={18} />
        <Text style={styles.infoText}>{formatMatchDate(match.scheduledAt)}</Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.playersLabel}>Confirmados</Text>
          <Text style={styles.playersValue}>
            {match.currentPlayers}/{match.maxPlayers} jogadores
          </Text>
        </View>
        {hasSpots ? (
          <View style={styles.spotsPill}>
            <Text style={styles.spotsText}>
              {spotsLeft} {spotsLeft === 1 ? 'vaga' : 'vagas'}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.86,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
  },
  creator: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.md,
  },
  footer: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  playersLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
  },
  playersValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  spotsPill: {
    backgroundColor: `${colors.success}22`,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  spotsText: {
    color: colors.success,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.black,
  },
});
