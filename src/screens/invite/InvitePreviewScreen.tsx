import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getErrorMessage } from '../../api/errors';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { InfoRow } from '../../components/ui/InfoRow';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useInvitePreview, useJoinViaInvite } from '../../hooks/useInvite';
import type { RootStackParamList } from '../../navigation/types';
import { savePendingInvite } from '../../store/pendingInvite';
import { useAuth } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';
import { formatMatchDate } from '../../utils/date';
import { useState } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'InvitePreview'>;

export function InvitePreviewScreen({ navigation, route }: Props) {
  const { code } = route.params;
  const { token } = useAuth();
  const { data: preview, isError, isLoading, refetch } = useInvitePreview(code);
  const joinViaInvite = useJoinViaInvite();
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    if (!token) {
      await savePendingInvite(code);
      navigation.navigate('Auth', { screen: 'Login' });
      return;
    }

    setError(null);

    try {
      const match = await joinViaInvite.mutateAsync(code);
      navigation.replace('MatchDetail', { matchId: match.id });
    } catch (joinError) {
      setError(getErrorMessage(joinError, 'Nao foi possivel entrar na partida.'));
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Carregando convite" />;
  }

  if (isError || !preview) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <EmptyState
            icon="link"
            title="Convite invalido"
            description="Este convite nao existe, expirou ou foi desativado."
            actionLabel="Tentar novamente"
            onAction={() => {
              refetch();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const spotsLeft = Math.max(preview.maxPlayers - preview.currentPlayers, 0);
  const isFull = preview.status === 'FULL';
  const isUnavailable = isFull || preview.status === 'CANCELLED' || preview.status === 'FINISHED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Voce foi convidado para</Text>
          <Text style={styles.title}>{preview.title}</Text>
          <StatusBadge status={preview.status} />
        </View>

        <Card>
          <View style={styles.infoStack}>
            <InfoRow icon="location" text={preview.location} />
            <InfoRow icon="calendar" text={formatMatchDate(preview.scheduledAt)} />
            <InfoRow
              icon="people"
              text={`${preview.currentPlayers}/${preview.maxPlayers} confirmados`}
            />
          </View>
          {!isUnavailable ? (
            <Text style={styles.spots}>
              {spotsLeft} {spotsLeft === 1 ? 'vaga restante' : 'vagas restantes'}
            </Text>
          ) : null}
        </Card>

        {error ? <ErrorMessage message={error} /> : null}

        <Button
          disabled={isUnavailable}
          label={isFull ? 'Partida cheia' : 'Confirmar presenca'}
          loading={joinViaInvite.isPending}
          onPress={handleJoin}
          fullWidth
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
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.black,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.black,
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
});
