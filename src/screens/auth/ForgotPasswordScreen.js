import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordScreen({ onBack }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleReset() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email first.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e) {
      setError(e.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Reset Password" onBack={onBack} />
      <View style={styles.content}>
        {sent ? (
          <Text style={styles.blurb}>
            If an account exists for {email.trim()}, a reset link is on its way — check your
            inbox.
          </Text>
        ) : (
          <>
            <Text style={styles.blurb}>Enter your account email and we'll send a reset link.</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
            ) : (
              <PrimaryButton label="Send Reset Link" onPress={handleReset} />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  blurb: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.sm, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textOnLight,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
