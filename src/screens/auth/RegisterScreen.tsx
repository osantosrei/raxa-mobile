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
import type { AuthScreenProps } from '../../navigation/types';
import { useAuth } from '../../store/authStore';
import { colors, radii, spacing, typography } from '../../theme';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().trim().email('E-mail invalido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
  phone: z.string().trim().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: { name: '', email: '', password: '', phone: '' },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone?.trim() || undefined,
      });
      await signIn(response);
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error, 'Erro ao criar conta. Tente novamente.'),
      });
    }
  });

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
          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Cadastre-se para criar partidas e confirmar presenca nos convites.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoCapitalize="words"
                  autoComplete="name"
                  error={errors.name?.message}
                  label="Nome"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Seu nome"
                  textContentType="name"
                  value={value}
                />
              )}
            />
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
              name="phone"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoComplete="tel"
                  error={errors.phone?.message}
                  hint="Opcional"
                  keyboardType="phone-pad"
                  label="Telefone"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="(11) 99999-9999"
                  textContentType="telephoneNumber"
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  autoComplete="new-password"
                  error={errors.password?.message}
                  label="Senha"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Minimo 8 caracteres"
                  secureTextEntry
                  textContentType="newPassword"
                  value={value}
                />
              )}
            />

            {errors.root?.message ? <ErrorMessage message={errors.root.message} /> : null}

            <View style={styles.actions}>
              <Button label="Criar conta" loading={isSubmitting} onPress={onSubmit} fullWidth />
              <Button
                label="Ja tenho conta"
                onPress={() => navigation.navigate('Login')}
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
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
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
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
