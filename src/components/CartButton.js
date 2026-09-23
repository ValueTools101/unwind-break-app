import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { getCart } from '../utils/storage';

export default function CartButton({ onPress }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    getCart().then((cart) => {
      if (mounted) setCount(cart.reduce((sum, c) => sum + c.qty, 0));
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Pressable onPress={onPress} style={styles.cartBtn}>
      <Text style={styles.cartIcon}>🛒</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartBtn: { position: 'relative' },
  cartIcon: { fontSize: 22 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
