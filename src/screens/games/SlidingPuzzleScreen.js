import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { addRelaxedSeconds } from '../../utils/storage';

const SIZE = 3;
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const TILE_ICONS = ['🌿', '🌸', '🍃', '☁️', '🌊', '🌙', '⭐', '🐚'];
const { width: SCREEN_W } = Dimensions.get('window');
const BOARD_SIZE = Math.min(SCREEN_W - spacing.lg * 2, 360);
const TILE_GAP = 8;
const TILE_SIZE = (BOARD_SIZE - TILE_GAP * (SIZE - 1)) / SIZE;

function shuffledBoard() {
  let board = [...SOLVED];
  let blank = board.indexOf(0);
  let lastMoved = -1;
  for (let i = 0; i < 150; i++) {
    const neighbors = neighborIndexes(blank).filter((n) => n !== lastMoved);
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    [board[blank], board[next]] = [board[next], board[blank]];
    lastMoved = blank;
    blank = next;
  }
  return board;
}

function neighborIndexes(i) {
  const row = Math.floor(i / SIZE);
  const col = i % SIZE;
  const out = [];
  if (row > 0) out.push(i - SIZE);
  if (row < SIZE - 1) out.push(i + SIZE);
  if (col > 0) out.push(i - 1);
  if (col < SIZE - 1) out.push(i + 1);
  return out;
}

function isSolved(board) {
  return board.every((v, i) => v === SOLVED[i]);
}

export default function SlidingPuzzleScreen({ onBack }) {
  const [board, setBoard] = useState(shuffledBoard);
  const [moves, setMoves] = useState(0);
  const startedAtRef = useRef(Date.now());
  const solved = isSolved(board);

  useEffect(() => {
    return () => {
      const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
      addRelaxedSeconds(seconds);
    };
  }, []);

  function handleTilePress(index) {
    if (solved) return;
    const blank = board.indexOf(0);
    if (neighborIndexes(blank).includes(index)) {
      const next = [...board];
      [next[blank], next[index]] = [next[index], next[blank]];
      setBoard(next);
      setMoves((m) => m + 1);
    }
  }

  function handleShuffle() {
    setBoard(shuffledBoard());
    setMoves(0);
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.primarySoft]} style={StyleSheet.absoluteFill} />
      <Header title="Calm Slide" onBack={onBack} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>Slide the tiles back into order — no timer, no rush.</Text>
        <Text style={styles.moves}>{moves} move{moves === 1 ? '' : 's'}</Text>

        <View style={[styles.board, { width: BOARD_SIZE, height: BOARD_SIZE }]}>
          {board.map((value, index) => {
            const row = Math.floor(index / SIZE);
            const col = index % SIZE;
            if (value === 0) return null;
            return (
              <Pressable
                key={value}
                onPress={() => handleTilePress(index)}
                style={[
                  styles.tile,
                  {
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    left: col * (TILE_SIZE + TILE_GAP),
                    top: row * (TILE_SIZE + TILE_GAP),
                  },
                ]}
              >
                <Text style={styles.tileIcon}>{TILE_ICONS[value - 1]}</Text>
                <Text style={styles.tileNumber}>{value}</Text>
              </Pressable>
            );
          })}
        </View>

        {solved && <Text style={styles.solvedText}>Solved! Nicely done. 🎉</Text>}

        <PrimaryButton label="Shuffle Again" variant="secondary" onPress={handleShuffle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, alignItems: 'center', padding: spacing.lg },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: spacing.sm },
  moves: { color: colors.textOnLight, fontWeight: '700', marginBottom: spacing.lg },
  board: { position: 'relative', marginBottom: spacing.lg },
  tile: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  tileIcon: { fontSize: 26 },
  tileNumber: { fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: '700' },
  solvedText: { fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
});
