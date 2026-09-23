import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ModeCard from '../components/ModeCard';
import { colors, spacing, radii, shadow } from '../theme';
import { getStats } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

const MODES = [
  { key: 'breathe', icon: '🌬️', title: 'Breathe & Sounds', subtitle: 'Guided breathing with calming ambient sound', color: colors.primarySoft },
  { key: 'games', icon: '🎲', title: 'Games', subtitle: 'Bubble Pop, Calm Slide & Memory Match', color: colors.accentSoft },
  { key: 'vent', icon: '📝', title: 'Journal & Vent', subtitle: 'Write it out, or say it out loud', color: colors.warm },
  { key: 'shop', icon: '🛍️', title: 'Window Shop', subtitle: 'Browse, add to cart, no checkout needed', color: '#F0E3FF' },
  { key: 'laugh', icon: '😄', title: 'Laugh It Out', subtitle: 'A quick joke to lighten the mood', color: '#FFE3D6' },
];

export default function HomeScreen({ onNavigate }) {
  const [minutes, setMinutes] = useState(0);
  const { isSignedIn, user } = useAuth();

  const loadStats = useCallback(() => {
    getStats().then((s) => setMinutes(Math.floor(s.totalRelaxedSeconds / 60)));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const initial = (user?.displayName || user?.email || '?').trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <LinearGradient colors={[colors.primarySoft, colors.accentSoft]} style={styles.brandMark}>
              <View style={styles.brandDot} />
            </LinearGradient>
            <Text style={styles.brandName}>Unwind</Text>
          </View>
          <Pressable onPress={() => onNavigate(isSignedIn ? 'profile' : 'login')} style={styles.accountBtn}>
            {isSignedIn ? <Text style={styles.accountInitial}>{initial}</Text> : <Text style={styles.accountIcon}>👤</Text>}
          </Pressable>
        </View>

        <Text style={styles.greeting}>Take 10 minutes for you</Text>
        <Text style={styles.subGreeting}>Pick whatever your mood needs right now.</Text>

        {minutes > 0 && (
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌿</Text>
            <View>
              <Text style={styles.statNumber}>{minutes} min</Text>
              <Text style={styles.statLabel}>unwound so far{isSignedIn ? ' · synced' : ''}</Text>
            </View>
          </View>
        )}

        <View style={styles.cards}>
          {MODES.map((m) => (
            <ModeCard
              key={m.key}
              icon={m.icon}
              title={m.title}
              subtitle={m.subtitle}
              color={m.color}
              onPress={() => onNavigate(m.key)}
            />
          ))}
        </View>
        <Pressable onPress={() => onNavigate('about')}>
          <Text style={styles.about}>About & Privacy</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  brandDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary },
  brandName: { fontSize: 16, fontWeight: '800', color: colors.textOnLight, letterSpacing: 0.3 },
  accountBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  accountIcon: { fontSize: 16 },
  accountInitial: { fontSize: 16, fontWeight: '800', color: colors.primary },
  greeting: { fontSize: 28, fontWeight: '800', color: colors.textOnLight },
  subGreeting: { fontSize: 15, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  statEmoji: { fontSize: 28, marginRight: spacing.md },
  statNumber: { fontSize: 18, fontWeight: '800', color: colors.textOnLight },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  cards: { marginBottom: spacing.lg },
  about: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.md, textDecorationLine: 'underline' },
});
