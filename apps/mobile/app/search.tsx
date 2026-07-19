import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Product, getProducts, resolveImageUrl } from '@/lib/api';

export default function SearchScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setErrorMessage('Unable to load products. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return [];
    }

    return products.filter((product) =>
      `${product.name} ${product.description} ${product.packageSize}`.toLowerCase().includes(
        normalizedSearch,
      ),
    );
  }, [products, searchText]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <TextInput
        autoFocus
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="What are you looking for?"
        placeholderTextColor="#8A8A8A"
        returnKeyType="search"
      />

      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading products</Text>
          <Text style={styles.stateText}>Getting searchable catalog items.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !errorMessage && searchText.trim() ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search results</Text>

          {visibleProducts.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>Try another medicine or product name.</Text>
            </View>
          ) : null}

          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={{
                pathname: '/products/[id]',
                params: {
                  id: product.id,
                },
              }}
              asChild
            >
              <Pressable style={styles.productRow}>
                <View style={styles.productImage}>
                  {resolveImageUrl(product.imageUrl) ? (
                    <Image
                      source={{ uri: resolveImageUrl(product.imageUrl) ?? undefined }}
                      style={styles.productPhoto}
                    />
                  ) : (
                    <Text style={styles.productImageText}>Product</Text>
                  )}
                </View>

                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  searchInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  productImageText: {
    color: '#9CA3AF',
    fontSize: 9,
  },
  productPhoto: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  productName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    lineHeight: 20,
  },
  stateBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D8F3E8',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
  },
  stateTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  stateText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
  },
  errorTitle: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#9F1D1D',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
});
