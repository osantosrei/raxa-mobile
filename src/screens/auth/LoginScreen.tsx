import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { authApi } from '../../api/auth';
import { getErrorMessage } from '../../api/errors';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../store/authStore';
import { consumePendingInvite } from '../../store/pendingInvite';
import { colors, radii, spacing, typography } from '../../theme';
import type { AuthScreenProps, RootStackParamList } from '../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const loginSchema = z.object({
  email: z.string().trim().email('E-mail invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await authApi.login(values);
      await signIn(response);
      const pendingInvite = await consumePendingInvite();
      const rootNavigation = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      if (pendingInvite) {
        rootNavigation?.navigate('InvitePreview', { code: pendingInvite });
      }
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error, 'Erro ao fazer login. Tente novamente.'),
      });
    }
  });

  const rootError = errors.root?.message;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>R</Text>
            </View>
            <Text style={styles.logo}>Raxa</Text>
            <Text style={styles.subtitle}>Entre para confirmar sua proxima pelada.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Entrar</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  label="E-mail"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="voce@email.com"
                  textContentType="emailAddress"
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoComplete="password"
                  error={errors.password?.message}
                  label="Senha"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Sua senha"
                  secureTextEntry
                  textContentType="password"
                  value={value}
                />
              )}
            />

            {rootError ? <ErrorMessage message={rootError} /> : null}

            <View style={styles.actions}>
              <Button label="Entrar" loading={isSubmitting} onPress={onSubmit} fullWidth />
              <Button
                label="Criar conta"
                onPress={() => navigation.navigate('Register')}
                variant="ghost"
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  brand: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    height: 52,
    justifyContent: 'center',
    width: 52,
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
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  formTitle: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
