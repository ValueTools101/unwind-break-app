import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function SignUpScreen({ onBack }) {
  const { signUp, authError, setAuthError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setAuthError(null);
    if (!email.trim() || password.length < 6) {
      setAuthError('Enter an email and a password of at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      onBack();
    } catch (e) {
      setAuthError(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create Account" onBack={onBack} />
      <View style={styles.content}>
        {authError ? <Text style={styles.error}>{authError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Name (optional)"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (6+ characters)"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
        ) : (
          <PrimaryButton label="Create Account" onPress={handleSignUp} />
        )}

        <Text style={styles.fineprint}>
          Creating an account lets your journal, cart, and progress sync across devices. Your
          voice recordings stay on this device only either way.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function friendlyError(message) {
  if (!message) return 'Something went wrong. Please try again.';
  if (message.includes('auth/email-already-in-use')) return 'That email is already registered — try signing in instead.';
  if (message.includes('auth/invalid-email')) return 'That email address looks invalid.';
  if (message.includes('auth/weak-password')) return 'Please choose a stronger password (6+ characters).';
  if (message.includes('auth/api-key')) return "Sign-up isn't configured yet — see the app's README.";
  return message.replace('Firebase: ', '').replace(/\s*\(auth\/[a-z-]+\)\.?/, '');
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
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
  fineprint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.md, lineHeight: 18 },
});
