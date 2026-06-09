import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme';
import { Button } from '../ui/Button';

interface InviteShareButtonProps {
  inviteCode: string;
}

export function InviteShareButton({ inviteCode }: InviteShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const inviteLink = useMemo(() => `raxa://invite/${inviteCode}`, [inviteCode]);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    await Clipboard.setStringAsync(inviteLink);
    setCopied(true);
  }

  async function shareInvite() {
    await Share.share({
      message: `Bora jogar? Confirme sua presença no Raxa: ${inviteLink}`,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons color={colors.primary} name="link" size={20} />
        <Text style={styles.title}>Convite da partida</Text>
      </View>
      <View style={styles.codeBox}>
        <Text selectable style={styles.code}>
          {inviteCode}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          label={copied ? 'Link copiado' : 'Copiar link'}
          onPress={copyLink}
          variant="secondary"
          fullWidth
        />
        <Button label="Compartilhar convite" onPress={shareInvite} fullWidth />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
  },
  codeBox: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  code: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.black,
  },
  actions: {
    gap: spacing.sm,
  },
});
