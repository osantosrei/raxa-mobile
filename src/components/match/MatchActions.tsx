import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { getErrorMessage } from '../../api/errors';
import { useJoinMatch, useLeaveMatch } from '../../hooks/usePlayers';
import { useCancelMatch } from '../../hooks/useMatches';
import { spacing } from '../../theme';
import type { MatchResponse } from '../../types/api';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { InfoBanner } from '../ui/InfoBanner';

interface MatchActionsProps {
  match: MatchResponse;
  isCreator: boolean;
  isParticipant: boolean;
  onActionComplete?: () => void;
}

export function MatchActions({
  match,
  isCreator,
  isParticipant,
  onActionComplete,
}: MatchActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const joinMatch = useJoinMatch(match.id);
  const leaveMatch = useLeaveMatch(match.id);
  const cancelMatch = useCancelMatch();

  const isPast = new Date(match.scheduledAt) < new Date();
  const isCancelled = match.status === 'CANCELLED';
  const isFull = match.status === 'FULL';
  const isBusy = joinMatch.isPending || leaveMatch.isPending || cancelMatch.isPending;

  async function runAction(action: () => Promise<unknown>, fallback: string) {
    setError(null);

    try {
      await action();
      onActionComplete?.();
    } catch (actionError) {
      setError(getErrorMessage(actionError, fallback));
    }
  }

  function confirmLeave() {
    Alert.alert('Sair da partida', 'Voce deixara de aparecer na lista de confirmados.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          runAction(() => leaveMatch.mutateAsync(), 'Nao foi possivel sair da partida.');
        },
      },
    ]);
  }

  function confirmCancel() {
    Alert.alert('Cancelar partida', 'Esta acao cancela a partida para todos os jogadores.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar partida',
        style: 'destructive',
        onPress: () => {
          runAction(() => cancelMatch.mutateAsync(match.id), 'Nao foi possivel cancelar a partida.');
        },
      },
    ]);
  }

  if (isCancelled) {
    return <InfoBanner message="Esta partida foi cancelada." type="warning" />;
  }

  if (isPast) {
    return <InfoBanner message="Esta partida ja foi realizada." type="info" />;
  }

  return (
    <View style={styles.container}>
      {error ? <ErrorMessage message={error} /> : null}

      {isCreator ? (
        <Button
          label="Cancelar partida"
          loading={cancelMatch.isPending}
          onPress={confirmCancel}
          variant="danger"
          fullWidth
        />
      ) : null}

      {!isCreator && !isParticipant ? (
        <Button
          disabled={isFull || isBusy}
          label={isFull ? 'Partida cheia' : 'Entrar na partida'}
          loading={joinMatch.isPending}
          onPress={() => {
            runAction(() => joinMatch.mutateAsync(), 'Nao foi possivel entrar na partida.');
          }}
          fullWidth
        />
      ) : null}

      {!isCreator && isParticipant ? (
        <Button
          disabled={isBusy}
          label="Sair da partida"
          loading={leaveMatch.isPending}
          onPress={confirmLeave}
          variant="secondary"
          fullWidth
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
});
