import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { addRelaxedSeconds } from '../../utils/storage';

const ICONS = ['🌿', '🌸', '🍃', '☁️', '🌊', '🌙', '⭐', '🐚'];
const COLUMNS = 4;
const { width: SCREEN_W } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_W - spacing.lg * 2, 360);
const GAP = 10;
const CARD_SIZE = (BOARD_SIZE - GAP * (COLUMNS - 1)) / COLUMNS;

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newDeck() {
  return shuffle([...ICONS, ...ICONS]).map((icon, index) => ({
    id: `${index}-${icon}-${Date.now()}`,
    icon,
    matched: false,
  }));
}

function Card({ card, isFlipped, onPress }) {
  const flip = useRef(new Animated.Value(isFlipped ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(flip, {
      toValue: isFlipped ? 0 : 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, flip]);

  return (
    <Pressable onPress={onPress} style={styles.cardSlot}>
      <Animated.View
        style={[styles.card, styles.cardBack, { transform: [{ scaleX: flip }] }, card.matched && styles.cardMatched]}
      >
        <Text style={styles.cardBackMark}>?</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.cardFront,
          { transform: [{ scaleX: flip.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }] },
          card.matched && styles.cardMatched,
        ]}
      >
        <Text style={styles.cardIcon}>{card.icon}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function MemoryMatchScreen({ onBack }) {
  const [deck, setDeck] = useState(newDeck);
  const [flippedIds, setFlippedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);
  const startedAtRef = useRef(Date.now());
  const busyRef = useRef(false);

  const matchedCount = deck.filter((c) => c.matched).length;
  const won = matchedCount === deck.length;

  useEffect(() => {
    return () => {
      const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
      addRelaxedSeconds(seconds);
    };
  }, []);

  function handleCardPress(card) {
    if (busyRef.current || card.matched || flippedIds.includes(card.id)) return;
    const nextFlipped = [...flippedIds, card.id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      busyRef.current = true;
      setMoves((m) => m + 1);
      const [firstId, secondId] = nextFlipped;
      const first = deck.find((c) => c.id === firstId);
      const second = deck.find((c) => c.id === secondId);
      const isMatch = first.icon === second.icon;

      setTimeout(() => {
        setDeck((prev) =>
          prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, matched: isMatch || c.matched } : c))
        );
        setFlippedIds([]);
        busyRef.current = false;
      }, isMatch ? 350 : 700);
    }
  }

  function handleReshuffle() {
    setDeck(newDeck());
    setFlippedIds([]);
    setMoves(0);
    setShuffleKey((k) => k + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.accentSoft]} style={StyleSheet.absoluteFill} />
      <Header title="Memory Match" onBack={onBack} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>Find every pair — take your time.</Text>
        <Text style={styles.moves}>{moves} moves · {matchedCount / 2}/{deck.length / 2} pairs</Text>

        <View key={shuffleKey} style={[styles.board, { width: BOARD_SIZE }]}>
          {deck.map((card) => (
            <Card
              key={card.id}
              card={card}
              isFlipped={flippedIds.includes(card.id) || card.matched}
              onPress={() => handleCardPress(card)}
            />
          ))}
        </View>

        {won && <Text style={styles.wonText}>All matched! 🎉</Text>}

        <PrimaryButton label="Shuffle Again" variant="secondary" onPress={handleReshuffle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  moves: { color: colors.textOnLight, fontWeight: '700', marginBottom: spacing.lg },
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: GAP, marginBottom: spacing.lg },
  cardSlot: { width: CARD_SIZE, height: CARD_SIZE },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  cardBack: { backgroundColor: colors.primarySoft },
  cardFront: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  cardMatched: { opacity: 0.55 },
  cardBackMark: { fontSize: 20, fontWeight: '800', color: colors.primary },
  cardIcon: { fontSize: 26 },
  wonText: { fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
});
