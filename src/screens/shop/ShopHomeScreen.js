import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/Header';
import CartButton from '../../components/CartButton';
import ProductCard from '../../components/ProductCard';
import { colors, spacing, radii } from '../../theme';
import { SHOP_CATEGORIES, SHOP_CATEGORY_ICONS, SHOP_BANNERS, SHOP_CATALOG } from '../../data/constants';
import { getCart, setCartItemQty } from '../../utils/storage';

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShopHomeScreen({ onBack, onNavigate }) {
  const [cart, setCart] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const bestsellers = useMemo(() => shuffle(SHOP_CATALOG).slice(0, 8), []);
  const trending = useMemo(() => shuffle(SHOP_CATALOG).slice(0, 8), []);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setBannerIndex((i) => (i + 1) % SHOP_BANNERS.length);
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fade]);

  function qtyFor(id) {
    return cart.find((c) => c.id === id)?.qty || 0;
  }

  async function changeQty(id, qty) {
    setCart(await setCartItemQty(id, qty));
  }

  const banner = SHOP_BANNERS[bannerIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Window Shop" onBack={onBack} right={<CartButton onPress={() => onNavigate('cart')} />} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <LinearGradient colors={banner.colors} style={styles.banner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
            <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
          </LinearGradient>
        </Animated.View>
        <View style={styles.dotsRow}>
          {SHOP_BANNERS.map((b, i) => (
            <Pressable key={b.id} onPress={() => setBannerIndex(i)} style={[styles.dot, i === bannerIndex && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoryGrid}>
          {SHOP_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={styles.categoryCard}
              onPress={() => onNavigate('shopCategory', { category: cat })}
            >
              <Text style={styles.categoryIcon}>{SHOP_CATEGORY_ICONS[cat]}</Text>
              <Text style={styles.categoryLabel} numberOfLines={2}>{cat}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Bestsellers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
          {bestsellers.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={qtyFor(p.id)}
              onAdd={() => changeQty(p.id, 1)}
              onIncrease={() => changeQty(p.id, qtyFor(p.id) + 1)}
              onDecrease={() => changeQty(p.id, qtyFor(p.id) - 1)}
              style={styles.hCard}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Trending Now</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
          {trending.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={qtyFor(p.id)}
              onAdd={() => changeQty(p.id, 1)}
              onIncrease={() => changeQty(p.id, qtyFor(p.id) + 1)}
              onDecrease={() => changeQty(p.id, qtyFor(p.id) - 1)}
              style={styles.hCard}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  banner: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
  },
  bannerTitle: { fontSize: 19, fontWeight: '800', color: colors.textOnLight },
  bannerSubtitle: { fontSize: 13, color: colors.textOnLight, opacity: 0.75, marginTop: 4 },
  bannerEmoji: { fontSize: 44 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.border, marginHorizontal: 3 },
  dotActive: { backgroundColor: colors.primary, width: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textOnLight, marginBottom: spacing.sm, marginTop: spacing.md },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    padding: spacing.xs,
  },
  categoryIcon: { fontSize: 26, marginBottom: 4 },
  categoryLabel: { fontSize: 11, fontWeight: '600', color: colors.textOnLight, textAlign: 'center' },
  hRow: { paddingRight: spacing.lg, paddingBottom: spacing.sm },
  hCard: { width: 140 },
});
