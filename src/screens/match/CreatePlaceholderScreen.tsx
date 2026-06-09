import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, typography } from '../../theme';

export function CreatePlaceholderScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Criar partida</Text>
        <EmptyState
          icon="add-circle"
          title="Formulario na Etapa 3"
          description="Esta aba ja faz parte do fluxo autenticado e recebera o cadastro de partidas com validacao Zod."
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
