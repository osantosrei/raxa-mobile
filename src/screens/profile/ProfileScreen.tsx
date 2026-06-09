import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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

import { getErrorMessage } from '../../api/errors';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { InfoBanner } from '../../components/ui/InfoBanner';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useProfile, useUpdateProfile } from '../../hooks/useProfile';
import { useAuth } from '../../store/authStore';
import { colors, spacing, typography } from '../../theme';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres'),
  phone: z.string().trim().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileScreen() {
  const { signOut, updateUser, user: authUser } = useAuth();
  const { data: profile, isError, isLoading, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: authUser?.name ?? '',
      phone: authUser?.phone ?? '',
    },
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone ?? '',
      });
    }
  }, [profile, reset]);

  const displayUser = profile ?? authUser;

  const onSubmit = handleSubmit(async (values) => {
    setSuccessMessage(null);

    try {
      const updated = await updateProfile.mutateAsync({
        name: values.name.trim(),
        phone: values.phone?.trim() || undefined,
      });
      await updateUser(updated);
      reset({
        name: updated.name,
        phone: updated.phone ?? '',
      });
      setSuccessMessage('Perfil atualizado.');
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error, 'Nao foi possivel atualizar o perfil.'),
      });
    }
  });

  if (isLoading && !displayUser) {
    return <LoadingSpinner label="Carregando perfil" />;
  }

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
          <Text style={styles.title}>Perfil</Text>

          {isError ? (
            <ErrorMessage
              message="Nao foi possivel sincronizar seu perfil."
              onRetry={() => {
                refetch();
              }}
            />
          ) : null}

          <Card>
            <View style={styles.profileHeader}>
              <Avatar name={displayUser?.name ?? 'Jogador Raxa'} size={56} />
              <View style={styles.profileText}>
                <Text style={styles.name}>{displayUser?.name ?? 'Jogador Raxa'}</Text>
                <Text style={styles.email}>{displayUser?.email ?? 'E-mail indisponivel'}</Text>
              </View>
            </View>

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
                  textContentType="name"
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
                  textContentType="telephoneNumber"
                  value={value}
                />
              )}
            />

            {errors.root?.message ? <ErrorMessage message={errors.root.message} /> : null}
            {successMessage ? <InfoBanner message={successMessage} type="success" /> : null}

            <View style={styles.actions}>
              <Button
                disabled={!isDirty}
                label="Salvar perfil"
                loading={updateProfile.isPending}
                onPress={onSubmit}
                fullWidth
              />
              <Button label="Sair" onPress={signOut} variant="secondary" fullWidth />
            </View>
          </Card>
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
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
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
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
