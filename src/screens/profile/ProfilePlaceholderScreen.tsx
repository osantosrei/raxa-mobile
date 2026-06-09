import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';

export function ProfilePlaceholderScreen() {
  const { user, signOut } = useAuth();
  const displayName = user?.name ?? 'Jogador Raxa';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Card>
          <View style={styles.profileRow}>
            <Avatar name={displayName} size={48} />
            <View style={styles.profileText}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{user?.email ?? 'Sessao autenticada'}</Text>
            </View>
          </View>
          <Text style={styles.note}>
            Edicao de perfil completa sera implementada na Etapa 6.
          </Text>
          <Button label="Sair" onPress={signOut} variant="secondary" fullWidth />
        </Card>
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
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
  },
  email: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
});
