import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { QuantityControl } from '@/components/quantity-control';
import { Product, getProduct, resolveImageUrl } from '@/lib/api';
import { useRequest } from '@/lib/request-context';

export default function ProductDetailScreen() {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const params = useLocalSearchParams<{ id?: string }>();
  const productId = typeof params.id === 'string' ? params.id : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!productId) {
      setErrorMessage('Product id is missing.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch {
      setErrorMessage('Unable to load this product. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading product</Text>
          <Text style={styles.stateText}>Getting product details.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadProduct}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {product ? (
        <>
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

          <Text style={styles.categoryText}>{product.category?.name ?? 'Product'}</Text>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.packageSize}>{product.packageSize}</Text>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Price</Text>
              <Text style={styles.price}>{product.price.formatted}</Text>
            </View>

            <Text style={product.inStock ? styles.stockBadge : styles.outOfStockBadge}>
              {product.inStock ? 'In stock' : 'Out of stock'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {getProductQuantity(product.id) > 0 ? (
            <View style={styles.detailQuantityRow}>
              <Text style={styles.detailQuantityLabel}>Quantity in request</Text>
              <QuantityControl
                quantity={getProductQuantity(product.id)}
                onIncrement={() => addProduct(product)}
                onDecrement={() => decrementProduct(product.id)}
              />
            </View>
          ) : (
            <Pressable style={styles.addButton} onPress={() => addProduct(product)}>
              <Text style={styles.addButtonText}>Add to request</Text>
            </Pressable>
          )}
        </>
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
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    height: 220,
    justifyContent: 'center',
    marginBottom: 24,
  },
  productImageText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700',
  },
  productPhoto: {
    borderRadius: 20,
    height: '100%',
    width: '100%',
  },
  categoryText: {
    color: '#087F5B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  packageSize: {
    color: '#6B7280',
    fontSize: 15,
    marginBottom: 22,
  },
  summaryRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    padding: 16,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    color: '#087F5B',
    fontSize: 22,
    fontWeight: '800',
  },
  stockBadge: {
    backgroundColor: '#E7F5EF',
    borderRadius: 999,
    color: '#087F5B',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  outOfStockBadge: {
    backgroundColor: '#FFF5F5',
    borderRadius: 999,
    color: '#9F1D1D',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 22,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#087F5B',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  detailQuantityRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  detailQuantityLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
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
});
