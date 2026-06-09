import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, isAfter, isValid } from 'date-fns';
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
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { useCreateMatch } from '../../hooks/useMatches';
import type { AppTabScreenProps } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';
import { parseLocalDateTime, toApiDateTime, toDateInputValue, toTimeInputValue } from '../../utils/date';

const createMatchSchema = z
  .object({
    title: z.string().trim().min(3, 'Título deve ter ao menos 3 caracteres').max(100),
    location: z.string().trim().min(3, 'Local obrigatório').max(255),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Use o formato HH:mm'),
    maxPlayers: z.coerce
      .number({ message: 'Número inválido' })
      .int('Informe um número inteiro')
      .min(2, 'Mínimo 2 jogadores')
      .max(100, 'Máximo 100 jogadores'),
  })
  .superRefine((values, context) => {
    const scheduledAt = parseLocalDateTime(values.date, values.time);

    if (!isValid(scheduledAt) || !isAfter(scheduledAt, new Date())) {
      context.addIssue({
        code: 'custom',
        message: 'A data deve ser futura',
        path: ['date'],
      });
    }
  });

type CreateMatchFormInput = z.input<typeof createMatchSchema>;
type CreateMatchFormOutput = z.output<typeof createMatchSchema>;

const initialDate = addDays(new Date(), 1);

export function CreateMatchScreen({ navigation }: AppTabScreenProps<'Create'>) {
  const createMatch = useCreateMatch();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateMatchFormInput, unknown, CreateMatchFormOutput>({
    defaultValues: {
      title: '',
      location: '',
      date: toDateInputValue(initialDate),
      time: toTimeInputValue(initialDate),
      maxPlayers: '14',
    },
    resolver: zodResolver(createMatchSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const scheduledAt = parseLocalDateTime(values.date, values.time);
      const match = await createMatch.mutateAsync({
        title: values.title.trim(),
        location: values.location.trim(),
        scheduledAt: toApiDateTime(scheduledAt),
        maxPlayers: values.maxPlayers,
      });
      navigation.navigate('MatchDetail', { matchId: match.id });
    } catch (error) {
      setError('root', {
        message: getErrorMessage(error, 'Erro ao criar partida. Tente novamente.'),
      });
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Criar partida</Text>
            <Text style={styles.subtitle}>
              Defina local, horário e limite de jogadores para organizar o próximo raxa.
            </Text>
          </View>

          <Card>
            <Controller
              control={control}
              name="title"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  error={errors.title?.message}
                  label="Título"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Ex: Raxa de quinta"
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name="location"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  error={errors.location?.message}
                  label="Local"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Ex: Arena Society Centro"
                  value={value}
                />
              )}
            />
            <View style={styles.inlineFields}>
              <Controller
                control={control}
                name="date"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    error={errors.date?.message}
                    keyboardType="numbers-and-punctuation"
                    label="Data"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="AAAA-MM-DD"
                    style={styles.inlineInput}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="time"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    error={errors.time?.message}
                    keyboardType="numbers-and-punctuation"
                    label="Horário"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="HH:mm"
                    style={styles.inlineInput}
                    value={value}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="maxPlayers"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  error={errors.maxPlayers?.message}
                  keyboardType="number-pad"
                  label="Limite de jogadores"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="14"
                  value={String(value)}
                />
              )}
            />

            {errors.root?.message ? <ErrorMessage message={errors.root.message} /> : null}

            <View style={styles.actions}>
              <Button
                label="Criar partida"
                loading={createMatch.isPending}
                onPress={onSubmit}
                fullWidth
              />
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.black,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  inlineFields: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inlineInput: {
    minWidth: 0,
  },
  actions: {
    marginTop: spacing.lg,
  },
});
