import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import CartButton from '../../components/CartButton';
import ProductCard from '../../components/ProductCard';
import { colors, spacing, radii } from '../../theme';
import { SHOP_CATALOG } from '../../data/constants';
import { getCart, setCartItemQty } from '../../utils/storage';

export default function ShopCategoryScreen({ params, onBack, onNavigate }) {
  const category = params?.category;
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getCart().then(setCart);
  }, []);

  const filtered = useMemo(() => {
    return SHOP_CATALOG.filter((p) => {
      const matchesCategory = p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  function qtyFor(id) {
    return cart.find((c) => c.id === id)?.qty || 0;
  }

  async function changeQty(id, qty) {
    setCart(await setCartItemQty(id, qty));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={category} onBack={onBack} right={<CartButton onPress={() => onNavigate('cart')} />} />
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder={`Search ${category}...`}
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.empty}>No items match your search.</Text>}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            qty={qtyFor(item.id)}
            onAdd={() => changeQty(item.id, 1)}
            onIncrease={() => changeQty(item.id, qtyFor(item.id) + 1)}
            onDecrease={() => changeQty(item.id, qtyFor(item.id) - 1)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  search: { backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: colors.textOnLight },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
