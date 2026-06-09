import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, typography } from '../../theme';

export function MatchListPlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Minhas peladas</Text>
        <EmptyState
          icon="football"
          title="Partidas chegam na Etapa 3"
          description="A autenticacao ja esta pronta. A listagem com dados reais sera implementada na proxima etapa."
        />
      </View>
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
    gap: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
});
