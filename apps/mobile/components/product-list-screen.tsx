import { Link, useLocalSearchParams } from 'expo-router';
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

import { Product, getFilteredProducts, resolveImageUrl } from '@/lib/api';
import { QuantityControl } from '@/components/quantity-control';
import { useRequest } from '@/lib/request-context';

export function ProductListScreen() {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const params = useLocalSearchParams<{
    brandId?: string;
    brandName?: string;
    categoryId?: string;
    categoryName?: string;
    search?: string;
  }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState(
    typeof params.search === 'string' ? params.search : '',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : undefined;
  const categoryName = typeof params.categoryName === 'string' ? params.categoryName : undefined;
  const brandId = typeof params.brandId === 'string' ? params.brandId : undefined;
  const brandName = typeof params.brandName === 'string' ? params.brandName : undefined;
  const catalogName = brandName ?? categoryName;

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getFilteredProducts({ brandId, categoryId });
      setProducts(data);
    } catch {
      setErrorMessage('Unable to load products. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [brandId, categoryId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setSearchText(typeof params.search === 'string' ? params.search : '');
  }, [params.search]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.description}`.toLowerCase().includes(normalizedSearch),
    );
  }, [products, searchText]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>{catalogName ?? 'Catalog'}</Text>
      <Text style={styles.title}>{catalogName ? `${catalogName} products` : 'All products'}</Text>

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search in products"
        placeholderTextColor="#8A8A8A"
      />

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

      {!isLoading && !errorMessage && visibleProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>Try another search term.</Text>
        </View>
      ) : null}

      <View style={styles.productGrid}>
        {visibleProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Link
              href={{
                pathname: '/products/[id]',
                params: {
                  id: product.id,
                },
              }}
              asChild
            >
              <Pressable style={styles.productLink}>
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

                <View style={styles.priceActionRow}>
                  <Text style={styles.productPrice}>{product.price.formatted}</Text>

                  {getProductQuantity(product.id) > 0 ? (
                    <QuantityControl
                      quantity={getProductQuantity(product.id)}
                      onIncrement={() => addProduct(product)}
                      onDecrement={() => decrementProduct(product.id)}
                    />
                  ) : (
                    <Pressable style={styles.addButton} onPress={() => addProduct(product)}>
                      <Text style={styles.addButtonText}>+</Text>
                    </Pressable>
                  )}
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </ScrollView>
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
  eyebrow: {
    color: '#087F5B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  searchInput: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 204,
    padding: 10,
    width: '49%',
  },
  productLink: {
    flex: 1,
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 96,
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  productImageText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  productPhoto: {
    borderRadius: 12,
    height: '100%',
    width: '100%',
  },
  productName: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
    minHeight: 36,
  },
  productPrice: {
    color: '#087F5B',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  priceActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#087F5B',
    borderRadius: 10,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 21,
    lineHeight: 23,
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
