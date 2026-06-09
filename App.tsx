import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { MatchCard } from './src/components/match/MatchCard';
import { Avatar } from './src/components/ui/Avatar';
import { Button } from './src/components/ui/Button';
import { Card } from './src/components/ui/Card';
import { EmptyState } from './src/components/ui/EmptyState';
import { ErrorMessage } from './src/components/ui/ErrorMessage';
import { Input } from './src/components/ui/Input';
import { LoadingSpinner } from './src/components/ui/LoadingSpinner';
import { StatusBadge } from './src/components/ui/StatusBadge';
import { colors, radii, spacing, typography } from './src/theme';
import type { MatchResponse } from './src/types/api';

const previewMatch: MatchResponse = {
  id: 'preview-match',
  title: 'Raxa de Quinta',
  location: 'Arena Society Centro',
  scheduledAt: '2026-06-15T20:00:00',
  maxPlayers: 14,
  currentPlayers: 9,
  status: 'OPEN',
  creator: {
    id: 'preview-user',
    name: 'Rafa Organizador',
    email: 'rafa@raxa.app',
    phone: null,
  },
  inviteCode: 'a3f7c1b2',
  createdAt: '2026-06-08T12:00:00',
};

export default function App() {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="light" />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.hero}>
                <View style={styles.logoMark}>
                  <Text style={styles.logoMarkText}>R</Text>
                </View>
                <Text style={styles.logo}>Raxa</Text>
                <Text style={styles.subtitle}>
                  Base mobile pronta para organizar peladas sem bagunca no grupo.
                </Text>
              </View>

              <Card>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Design system</Text>
                  <StatusBadge status="OPEN" />
                </View>
                <Text style={styles.sectionText}>
                  Preview tecnico da Etapa 1 com tokens, componentes e estados base.
                </Text>
                <View style={styles.badgeRow}>
                  <StatusBadge status="FULL" />
                  <StatusBadge status="CANCELLED" />
                  <StatusBadge status="FINISHED" />
                </View>
              </Card>

              <MatchCard match={previewMatch} onPress={() => undefined} />

              <Card>
                <Text style={styles.sectionTitle}>Formulario</Text>
                <Input
                  label="Nome da partida"
                  placeholder="Ex: Raxa de Quinta"
                  value="Raxa de Quinta"
                  onChangeText={() => undefined}
                  hint="Campo base para React Hook Form na proxima etapa."
                />
                <Input
                  label="Local"
                  placeholder="Onde vai ser?"
                  value=""
                  onChangeText={() => undefined}
                  error="Informe o local da partida."
                />
                <View style={styles.buttonGroup}>
                  <Button label="Criar partida" onPress={() => undefined} fullWidth />
                  <Button
                    label="Carregando"
                    onPress={() => undefined}
                    loading
                    fullWidth
                  />
                  <Button
                    label="Indisponivel"
                    onPress={() => undefined}
                    disabled
                    fullWidth
                  />
                </View>
              </Card>

              <Card>
                <View style={styles.playerRow}>
                  <Avatar name="Rafa Organizador" />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>Rafa Organizador</Text>
                    <Text style={styles.playerMeta}>Confirmado no preview</Text>
                  </View>
                </View>
                <LoadingSpinner label="Preparando proximas telas" inline />
              </Card>

              <EmptyState
                icon="football"
                title="Nenhuma pelada ainda"
                description="Crie uma partida ou entre por convite quando a navegacao estiver pronta."
                actionLabel="Acao futura"
                onAction={() => undefined}
              />

              <ErrorMessage
                message="Exemplo de erro amigavel para feedback visual."
                onRetry={() => undefined}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  logoMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
  },
  logoMarkText: {
    color: colors.background,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.black,
  },
  logo: {
    color: colors.text,
    fontSize: typography.sizes.hero,
    fontWeight: typography.weights.black,
  },
  subtitle: {
    maxWidth: 320,
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  sectionText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  buttonGroup: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  playerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  playerMeta: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
});
