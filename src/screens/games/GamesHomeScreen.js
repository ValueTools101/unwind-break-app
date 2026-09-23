import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import ModeCard from '../../components/ModeCard';
import { colors, spacing } from '../../theme';

const GAMES = [
  { key: 'bubblePop', icon: '🫧', title: 'Bubble Pop', subtitle: 'Tap floating bubbles, no fail state', color: colors.accentSoft },
  { key: 'slidingPuzzle', icon: '🧩', title: 'Calm Slide', subtitle: 'A gentle sliding tile puzzle', color: colors.primarySoft },
  { key: 'memoryMatch', icon: '🍃', title: 'Memory Match', subtitle: 'Find the matching pairs', color: '#F0E3FF' },
];

export default function GamesHomeScreen({ onBack, onNavigate }) {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Games" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cards}>
          {GAMES.map((g) => (
            <ModeCard
              key={g.key}
              icon={g.icon}
              title={g.title}
              subtitle={g.subtitle}
              color={g.color}
              onPress={() => onNavigate(g.key)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  cards: { marginTop: spacing.sm },
});
