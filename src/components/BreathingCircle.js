import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

const MIN_SCALE = 0.55;
const MAX_SCALE = 1;

export default function BreathingCircle({ pattern, running, onCycleComplete }) {
  const scale = useRef(new Animated.Value(MIN_SCALE)).current;
  const blink = useRef(new Animated.Value(1)).current;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(pattern.phases[0].seconds);
  const timeoutRef = useRef(null);
  const tickRef = useRef(null);
  const blinkTimeoutRef = useRef(null);

  useEffect(() => {
    setPhaseIndex(0);
    setSecondsLeft(pattern.phases[0].seconds);
    scale.setValue(MIN_SCALE);
  }, [pattern]);

  useEffect(() => {
    if (!running) {
      clearTimeout(timeoutRef.current);
      clearInterval(tickRef.current);
      return;
    }
    runPhase(phaseIndex);
    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phaseIndex, pattern]);

  useEffect(() => {
    function scheduleBlink() {
      blinkTimeoutRef.current = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.1, duration: 90, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start(scheduleBlink);
      }, 2500 + Math.random() * 3000);
    }
    scheduleBlink();
    return () => clearTimeout(blinkTimeoutRef.current);
  }, [blink]);

  function runPhase(idx) {
    const phase = pattern.phases[idx];
    setSecondsLeft(phase.seconds);
    const target = phase.type === 'inhale' ? MAX_SCALE : phase.type === 'exhale' ? MIN_SCALE : undefined;
    if (target !== undefined) {
      Animated.timing(scale, {
        toValue: target,
        duration: phase.seconds * 1000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start();
    }
    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 0));
    }, 1000);
    timeoutRef.current = setTimeout(() => {
      const nextIdx = (idx + 1) % pattern.phases.length;
      if (nextIdx === 0 && onCycleComplete) onCycleComplete();
      setPhaseIndex(nextIdx);
    }, phase.seconds * 1000);
  }

  const phase = pattern.phases[phaseIndex];
  const mouthHeight = scale.interpolate({ inputRange: [MIN_SCALE, MAX_SCALE], outputRange: [5, 20] });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.character, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[colors.primarySoft, colors.accentSoft]}
          style={styles.body}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />
        <View style={styles.face}>
          <View style={styles.eyesRow}>
            <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
            <Animated.View style={[styles.eye, { transform: [{ scaleY: blink }] }]} />
          </View>
          <Animated.View style={[styles.mouth, { height: mouthHeight }]} />
          <View style={styles.cheekLeft} />
          <View style={styles.cheekRight} />
        </View>
      </Animated.View>
      <View style={styles.labelWrap}>
        <Text style={styles.phaseLabel}>{running ? phase.label : 'Ready'}</Text>
        {running && <Text style={styles.seconds}>{secondsLeft}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', height: 280 },
  character: {
    position: 'absolute',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  face: { alignItems: 'center', justifyContent: 'center' },
  eyesRow: { flexDirection: 'row', marginBottom: 14 },
  eye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textOnLight,
    marginHorizontal: 12,
  },
  mouth: {
    width: 20,
    borderRadius: 999,
    backgroundColor: colors.textOnLight,
  },
  cheekLeft: {
    position: 'absolute',
    left: 22,
    top: 8,
    width: 20,
    height: 12,
    borderRadius: 10,
    backgroundColor: colors.warm,
    opacity: 0.5,
  },
  cheekRight: {
    position: 'absolute',
    right: 22,
    top: 8,
    width: 20,
    height: 12,
    borderRadius: 10,
    backgroundColor: colors.warm,
    opacity: 0.5,
  },
  labelWrap: { alignItems: 'center', marginTop: 18 },
  phaseLabel: { fontSize: 20, fontWeight: '600', color: colors.textOnLight },
  seconds: { fontSize: 32, fontWeight: '700', color: colors.textOnLight, marginTop: 4 },
});
