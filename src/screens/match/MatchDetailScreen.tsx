import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InviteShareButton } from '../../components/match/InviteShareButton';
import { MatchActions } from '../../components/match/MatchActions';
import { PlayerListItem } from '../../components/match/PlayerListItem';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { InfoRow } from '../../components/ui/InfoRow';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useMatchDetail } from '../../hooks/useMatches';
import { usePlayers } from '../../hooks/usePlayers';
import type { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import { formatMatchDate } from '../../utils/date';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'MatchDetail'>;

export function MatchDetailScreen({ route }: Props) {
  const { matchId } = route.params;
  const { user } = useAuth();
  const {
    data: match,
    isError,
    isLoading,
    isRefetching: isRefetchingMatch,
    refetch: refetchMatch,
  } = useMatchDetail(matchId);
  const {
    data: players = [],
    isError: isPlayersError,
    isLoading: isLoadingPlayers,
    isRefetching: isRefetchingPlayers,
    refetch: refetchPlayers,
  } = usePlayers(matchId);

  if (isLoading) {
    return <LoadingSpinner label="Carregando detalhes" />;
  }

  if (isError || !match) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ErrorMessage
            message="Nao foi possivel carregar esta partida."
            onRetry={() => {
              refetchMatch();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const spotsLeft = Math.max(match.maxPlayers - match.currentPlayers, 0);
  const isCreator = match.creator.id === user?.id;
  const isParticipant = players.some((player) => player.userId === user?.id);
  const isRefreshing = isRefetchingMatch || isRefetchingPlayers;

  function refetchScreen() {
    refetchMatch();
    refetchPlayers();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={refetchScreen}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{match.title}</Text>
            <Text style={styles.creator}>Criada por {match.creator.name}</Text>
          </View>
          <StatusBadge status={match.status} />
        </View>

        <Card>
          <View style={styles.infoStack}>
            <InfoRow icon="location" text={match.location} />
            <InfoRow icon="calendar" text={formatMatchDate(match.scheduledAt)} />
            <InfoRow
              icon="people"
              text={`${match.currentPlayers} de ${match.maxPlayers} confirmados`}
            />
          </View>
          {match.status === 'OPEN' && spotsLeft > 0 ? (
            <Text style={styles.spots}>{spotsLeft} vagas disponiveis</Text>
          ) : null}
        </Card>

        {isCreator && match.inviteCode ? (
          <Card>
            <InviteShareButton inviteCode={match.inviteCode} />
          </Card>
        ) : null}

        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Confirmados</Text>
            <Text style={styles.counter}>
              {match.currentPlayers}/{match.maxPlayers}
            </Text>
          </View>

          {isLoadingPlayers ? <LoadingSpinner label="Carregando jogadores" inline /> : null}

          {isPlayersError ? (
            <ErrorMessage
              message="Nao foi possivel carregar os participantes."
              onRetry={() => {
                refetchPlayers();
              }}
            />
          ) : null}

          {!isLoadingPlayers && !isPlayersError && players.length === 0 ? (
            <EmptyState
              icon="people"
              title="Sem confirmados"
              description="Quando alguem entrar na partida, aparecera aqui."
            />
          ) : null}

          {!isPlayersError && players.length > 0 ? (
            <View style={styles.playersList}>
              {players.map((player) => (
                <PlayerListItem key={player.userId} player={player} />
              ))}
            </View>
          ) : null}
        </Card>

        <MatchActions
          isCreator={isCreator}
          isParticipant={isParticipant}
          match={match}
          onActionComplete={refetchScreen}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
  creator: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  infoStack: {
    gap: spacing.md,
  },
  spots: {
    color: colors.success,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.black,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  counter: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.black,
  },
  playersList: {
    gap: spacing.xs,
  },
});
