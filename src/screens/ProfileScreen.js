import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radii } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ onBack }) {
  const { user, signOut, deleteAccount, syncing } = useAuth();

  function handleSignOut() {
    Alert.alert('Sign out?', 'Your data stays backed up — signing back in will bring it back.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut().then(onBack) },
    ]);
  }

  function handleDelete() {
    Alert.alert(
      'Delete account?',
      "This deletes your sign-in account. Your journal/cart data stored in the cloud under this account won't be reachable anymore, though this device's local copy stays put.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => deleteAccount().then(onBack).catch((e) => Alert.alert('Could not delete account', e.message)),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Account" onBack={onBack} />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.email}>{user?.email || user?.displayName || 'Signed in'}</Text>
          <Text style={styles.status}>{syncing ? 'Syncing…' : 'Journal, cart, and progress are backed up.'}</Text>
        </View>
        <PrimaryButton label="Sign Out" variant="secondary" onPress={handleSignOut} />
        <PrimaryButton label="Delete Account" variant="danger" onPress={handleDelete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.lg },
  email: { fontSize: 17, fontWeight: '700', color: colors.textOnLight },
  status: { fontSize: 13, color: colors.textMuted, marginTop: spacing.xs },
});
