import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Product, getFilteredProducts } from '@/lib/api';

import { ProductCard } from './product-card';

export function ProductListScreen() {
  const params = useLocalSearchParams<{
    brandId?: string;
    brandName?: string;
    categoryId?: string;
    categoryName?: string;
    subcategoryId?: string;
    subcategoryName?: string;
  }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : undefined;
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : undefined;
  const subcategoryId =
    typeof params.subcategoryId === 'string' ? params.subcategoryId : undefined;
  const subcategoryName =
    typeof params.subcategoryName === 'string' ? params.subcategoryName : undefined;
  const brandId = typeof params.brandId === 'string' ? params.brandId : undefined;
  const brandName = typeof params.brandName === 'string' ? params.brandName : undefined;
  const catalogName = brandName ?? subcategoryName ?? categoryName;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getFilteredProducts({ brandId, categoryId, subcategoryId });
      setProducts(data);
    } catch {
      setErrorMessage('Unable to load products. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [brandId, categoryId, subcategoryId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return (
    <>
      <Stack.Screen options={{ title: catalogName ?? 'Products' }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading products</Text>
          <Text style={styles.stateText}>Getting pharmacy catalog items.</Text>
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

      {!isLoading && !errorMessage && products.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>Check another category or brand.</Text>
        </View>
      ) : null}

      <View style={styles.productGrid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 14,
    paddingBottom: 32,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stateBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFF2F1',
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
