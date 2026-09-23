import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../theme';

const { width: W, height: H } = Dimensions.get('window');

function loop(value, toValue, duration, delay = 0) {
  return Animated.loop(
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(value, { toValue, duration, useNativeDriver: true }),
      Animated.timing(value, { toValue: 0, duration: 0, useNativeDriver: true }),
    ])
  );
}

function RainLayer() {
  const drops = useRef(
    Array.from({ length: 10 }, () => ({
      x: Math.random() * W,
      delay: Math.random() * 1500,
      duration: 1400 + Math.random() * 900,
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const anims = drops.map((d) => loop(d.anim, 1, d.duration, d.delay));
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [drops]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drops.map((d, i) => (
        <Animated.View
          key={i}
          style={[
            styles.raindrop,
            {
              left: d.x,
              opacity: d.anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 0.5, 0.5, 0] }),
              transform: [{ translateY: d.anim.interpolate({ inputRange: [0, 1], outputRange: [-40, H] }) }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function WavesLayer() {
  const wave = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(wave, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(wave, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [wave]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[0, 1, 2].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.waveBand,
            {
              top: H * 0.3 + i * 90,
              opacity: 0.12 + i * 0.04,
              transform: [
                {
                  translateX: wave.interpolate({ inputRange: [0, 1], outputRange: [-60 - i * 20, 60 + i * 20] }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

function WindLayer() {
  const drift = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const anims = drift.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 900),
          Animated.timing(d, { toValue: 1, duration: 7000 + i * 1200, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [drift]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drift.map((d, i) => (
        <Animated.View
          key={i}
          style={[
            styles.windPuff,
            {
              top: 60 + i * 130,
              opacity: 0.35,
              transform: [{ translateX: d.interpolate({ inputRange: [0, 1], outputRange: [-120, W + 120] }) }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function GlowLayer() {
  const pulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.6, duration: 2200, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.glow, { opacity: pulse, transform: [{ scale: pulse }] }]} />
    </View>
  );
}

function SparkleLayer() {
  const sparkles = useRef(
    Array.from({ length: 8 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H * 0.7 + 40,
      delay: Math.random() * 2000,
      anim: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const anims = sparkles.map((s) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(s.delay),
          Animated.timing(s.anim, { toValue: 1, duration: 900, useNativeDriver: true }),
          Animated.timing(s.anim, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.delay(1200),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [sparkles]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {sparkles.map((s, i) => (
        <Animated.View
          key={i}
          style={[
            styles.sparkle,
            { left: s.x, top: s.y, opacity: s.anim, transform: [{ scale: s.anim }] },
          ]}
        />
      ))}
    </View>
  );
}

const LAYERS = {
  rain: RainLayer,
  waves: WavesLayer,
  wind: WindLayer,
  glow: GlowLayer,
  sparkle: SparkleLayer,
};

export default function AmbientBackground({ activeVisuals }) {
  const unique = Array.from(new Set(activeVisuals));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {unique.map((visual) => {
        const Layer = LAYERS[visual];
        return Layer ? <Layer key={visual} /> : null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  raindrop: {
    position: 'absolute',
    width: 2,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  waveBand: {
    position: 'absolute',
    left: -80,
    width: W + 160,
    height: 60,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  windPuff: {
    position: 'absolute',
    width: 90,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  glow: {
    position: 'absolute',
    top: H * 0.28,
    left: W / 2 - 140,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.warm,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
