import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radii } from '../theme';
import { JOKES } from '../data/jokes';

function randomIndex(excludeIndex, length) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === excludeIndex) next = Math.floor(Math.random() * length);
  return next;
}

export default function LaughScreen({ onBack }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * JOKES.length));
  const [revealed, setRevealed] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const joke = JOKES[index];

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setIndex((i) => randomIndex(i, JOKES.length));
      setRevealed(false);
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.warm]} style={StyleSheet.absoluteFill} />
      <Header title="Laugh It Out" onBack={onBack} />
      <View style={styles.content}>
        <Animated.View style={[styles.card, { opacity: fade }]}>
          <Text style={styles.emoji}>😄</Text>
          <Text style={styles.setup}>{joke.setup}</Text>
          {revealed ? (
            <Text style={styles.punchline}>{joke.punchline}</Text>
          ) : (
            <Pressable onPress={handleReveal} style={styles.revealBtn}>
              <Text style={styles.revealText}>Tap to reveal</Text>
            </Pressable>
          )}
        </Animated.View>

        <PrimaryButton label="Next Joke" onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emoji: { fontSize: 40, marginBottom: spacing.md },
  setup: { fontSize: 19, fontWeight: '700', color: colors.textOnLight, textAlign: 'center', marginBottom: spacing.lg },
  revealBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radii.pill },
  revealText: { color: colors.textOnLight, fontWeight: '600' },
  punchline: { fontSize: 17, color: colors.primary, fontWeight: '700', textAlign: 'center' },
});
