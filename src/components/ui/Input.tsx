import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, editable = true, style, ...rest }: InputProps) {
  const helperText = error ?? hint;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled: !editable }}
        editable={editable}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          !editable && styles.disabled,
          error && styles.inputError,
          style,
        ]}
        {...rest}
      />
      {helperText ? (
        <Text style={[styles.helper, error && styles.errorText]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  input: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.sizes.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.58,
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
  },
  errorText: {
    color: colors.danger,
  },
});
