import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MatchCard } from '../../components/match/MatchCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useMatches } from '../../hooks/useMatches';
import type { AppTabScreenProps } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

export function MatchListScreen({ navigation }: AppTabScreenProps<'Home'>) {
  const { data: matches = [], isError, isLoading, isRefetching, refetch } = useMatches();

  if (isLoading) {
    return <LoadingSpinner label="Carregando partidas" />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ErrorMessage
            message="Não foi possível carregar as partidas."
            onRetry={() => {
              refetch();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Raxa</Text>
              <Text style={styles.title}>Minhas peladas</Text>
            </View>
            <Button
              label="Criar"
              onPress={() => navigation.navigate('Create')}
              variant="secondary"
            />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="football"
            title="Nenhuma pelada ainda"
            description="Crie uma partida ou entre via convite quando receber um link."
            actionLabel="Criar partida"
            onAction={() => navigation.navigate('Create')}
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            onRefresh={refetch}
            refreshing={isRefetching}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  list: {
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.black,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
});
