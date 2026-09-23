import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ onBack, onNavigate }) {
  const { signIn, signInWithGoogle, authError, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setAuthError(null);
    if (!email.trim() || !password) {
      setAuthError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      onBack();
    } catch (e) {
      setAuthError(friendlyError(e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sign In" onBack={onBack} />
      <View style={styles.content}>
        <Text style={styles.blurb}>
          Sign in to back up your journal, cart, and progress so they follow you to a new
          device. Everything still works fine without an account, too.
        </Text>

        {authError ? <Text style={styles.error}>{authError}</Text> : null}

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
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
        ) : (
          <PrimaryButton label="Sign In" onPress={handleLogin} />
        )}

        <PrimaryButton label="Continue with Google" variant="secondary" onPress={signInWithGoogle} />

        <Pressable onPress={() => onNavigate('forgotPassword')}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
        <Pressable onPress={() => onNavigate('signup')}>
          <Text style={styles.link}>New here? Create an account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function friendlyError(message) {
  if (!message) return 'Something went wrong. Please try again.';
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
    return 'Incorrect email or password.';
  }
  if (message.includes('auth/user-not-found')) return 'No account found with that email.';
  if (message.includes('auth/invalid-email')) return 'That email address looks invalid.';
  if (message.includes('auth/api-key')) return "Sign-in isn't configured yet — see the app's README.";
  return message.replace('Firebase: ', '').replace(/\s*\(auth\/[a-z-]+\)\.?/, '');
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
  link: { color: colors.primary, fontWeight: '600', textAlign: 'center', marginTop: spacing.md },
});
