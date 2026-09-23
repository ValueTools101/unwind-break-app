import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing, radii } from '../../theme';
import { SHOP_CATALOG } from '../../data/constants';
import { getCart, clearCart } from '../../utils/storage';
import { formatPrice } from '../../utils/currency';

export default function CartScreen({ onBack }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  function handleCheckout() {
    Alert.alert(
      "There's no checkout here 🛍️",
      "This cart is just for pretend, so there's nothing to buy. Want to clear it and start fresh?",
      [
        { text: 'Keep Browsing', style: 'cancel' },
        {
          text: 'Clear Cart',
          style: 'destructive',
          onPress: async () => setCart(await clearCart()),
        },
      ]
    );
  }

  const total = cart.reduce((sum, c) => {
    const product = SHOP_CATALOG.find((p) => p.id === c.id);
    return sum + (product ? product.price * c.qty : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Cart" onBack={onBack} />
      <View style={styles.content}>
        {cart.length === 0 ? (
          <Text style={styles.empty}>Your cart is empty. Go find something fun!</Text>
        ) : (
          <ScrollView style={{ flex: 1 }}>
            {cart.map((c) => {
              const product = SHOP_CATALOG.find((p) => p.id === c.id);
              if (!product) return null;
              return (
                <View key={c.id} style={styles.row}>
                  <Text style={styles.emoji}>{product.emoji}</Text>
                  <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.qty}>x{c.qty}</Text>
                  <Text style={styles.price}>{formatPrice(product.price * c.qty)}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        <Text style={styles.total}>Total: {formatPrice(total)}</Text>
        <PrimaryButton label="Checkout" onPress={handleCheckout} />
        <PrimaryButton label="Back to Shop" variant="ghost" onPress={onBack} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  emoji: { fontSize: 22, marginRight: spacing.sm },
  name: { flex: 1, fontSize: 14, color: colors.textOnLight, fontWeight: '600' },
  qty: { color: colors.textMuted, marginRight: spacing.sm },
  price: { color: colors.textOnLight, fontWeight: '700' },
  total: { fontSize: 16, fontWeight: '700', color: colors.textOnLight, marginVertical: spacing.md, textAlign: 'right' },
});
