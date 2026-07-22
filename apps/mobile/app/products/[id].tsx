import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoadingState } from '@/components/loading-state';
import { QuantityControl } from '@/components/quantity-control';
import { Product, ProductUnit, getProduct, resolveImageUrl } from '@/lib/api';
import { useRequest } from '@/lib/request-context';

export default function ProductDetailScreen() {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const params = useLocalSearchParams<{ id?: string }>();
  const productId = typeof params.id === 'string' ? params.id : '';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const loadProduct = useCallback(async (refreshing = false) => {
    if (!productId) {
      setErrorMessage('Product id is missing.');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const data = await getProduct(productId);
      setProduct(data);
      setSelectedUnitId(getProductUnits(data)[0]?.id ?? null);
    } catch {
      setErrorMessage('Unable to load this product. Check that the API is running.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const unitOptions = product ? getProductUnits(product) : [];
  const selectedUnit = unitOptions.find((unit) => unit.id === selectedUnitId) ?? unitOptions[0];
  const quantity = product && selectedUnit ? getProductQuantity(product.id, selectedUnit.id) : 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={['#00b6bd']}
            refreshing={isRefreshing}
            tintColor="#00b6bd"
            onRefresh={() => {
              void loadProduct(true);
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !isRefreshing ? (
          <View style={styles.stateWrap}>
            <LoadingState />
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not connect</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => {
                void loadProduct();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {product ? (
          <>
            <View style={styles.mediaPanel}>
              {resolveImageUrl(product.imageUrl) ? (
                <Image
                  source={{ uri: resolveImageUrl(product.imageUrl) ?? undefined }}
                  resizeMode="contain"
                  style={styles.productPhoto}
                />
              ) : (
                <View style={styles.productImageFallback}>
                  <Ionicons name="medkit-outline" size={42} color="#00b6bd" />
                </View>
              )}
            </View>

            <View style={styles.productHeader}>
              <Text style={styles.title}>{product.name}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  {selectedUnit?.price.formatted ?? product.price.formatted}
                </Text>
                <View style={product.inStock ? styles.stockPill : styles.outOfStockPill}>
                  <Ionicons
                    name={product.inStock ? 'checkmark-circle' : 'close-circle'}
                    size={15}
                    color={product.inStock ? '#007F7B' : '#9F1D1D'}
                  />
                  <Text style={product.inStock ? styles.stockPillText : styles.outOfStockPillText}>
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </Text>
                </View>
              </View>

              {unitOptions.length > 1 ? (
                <View style={styles.unitSelector}>
                  <Text style={styles.unitSelectorLabel}>Choose unit</Text>
                  <View style={styles.unitOptionRow}>
                    {unitOptions.map((unit) => {
                      const active = selectedUnit?.id === unit.id;

                      return (
                        <Pressable
                          key={unit.id}
                          style={active ? styles.unitOptionActive : styles.unitOption}
                          onPress={() => setSelectedUnitId(unit.id)}
                        >
                          <Text style={active ? styles.unitOptionTextActive : styles.unitOptionText}>
                            {unit.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.specCard}>
              <Text style={styles.sectionTitle}>Description</Text>
              {product.brand?.name ? <SpecRow label="Brand" value={product.brand.name} /> : null}
              <SpecRow label="Unit" value={selectedUnit?.label ?? product.unitLabel ?? 'Product'} />
              <SpecRow label="Size/Volume" value={product.packageSize} />
              <View style={styles.productDetailsBlock}>
                <Text style={styles.productDetailsTitle}>Product Details</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {product.description}
                </Text>
              </View>
              <Pressable style={styles.moreDetailsButton} onPress={() => setShowDetails(true)}>
                <Text style={styles.moreDetailsText}>SEE MORE DETAILS</Text>
              </Pressable>
            </View>

            <Modal
              animationType="fade"
              transparent
              visible={showDetails}
              onRequestClose={() => setShowDetails(false)}
            >
              <Pressable style={styles.modalBackdrop} onPress={() => setShowDetails(false)}>
                <Pressable style={styles.detailsModal}>
                  <View style={styles.detailsModalHeader}>
                    <Text style={styles.detailsModalTitle}>Product Details</Text>
                    <Pressable onPress={() => setShowDetails(false)}>
                      <Ionicons name="close" size={22} color="#111827" />
                    </Pressable>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.detailsModalName}>{product.name}</Text>
                    {product.brand?.name ? (
                      <Text style={styles.detailsModalMeta}>{product.brand.name}</Text>
                    ) : null}
                    <Text style={styles.detailsModalDescription}>{product.description}</Text>
                    <View style={styles.detailsModalRows}>
                      {product.brand?.name ? <SpecRow label="Brand" value={product.brand.name} /> : null}
                      <SpecRow label="Unit" value={selectedUnit?.label ?? product.unitLabel ?? 'Product'} />
                      <SpecRow label="Size/Volume" value={product.packageSize} />
                      <SpecRow label="Category" value={product.category?.name ?? 'Product'} />
                      {product.subcategory?.name ? (
                        <SpecRow label="Department" value={product.subcategory.name} />
                      ) : null}
                    </View>
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
          </>
        ) : null}
      </ScrollView>

      {product ? (
        <View style={styles.actionBar}>
          <View>
            <Text style={styles.actionLabel}>Total item price</Text>
            <Text style={styles.actionPrice}>
              {selectedUnit?.price.formatted ?? product.price.formatted}
            </Text>
          </View>

          {quantity > 0 ? (
            <QuantityControl
              size="large"
              quantity={quantity}
              onIncrement={() => addProduct(product, selectedUnit)}
              onDecrement={() => decrementProduct(product.id, selectedUnit?.id)}
            />
          ) : (
            <Pressable
              style={product.inStock ? styles.addButton : styles.disabledButton}
              disabled={!product.inStock}
              onPress={() => addProduct(product, selectedUnit)}
            >
              <Ionicons name="cart-outline" size={19} color="#FFFFFF" />
              <Text style={styles.addButtonText}>
                {product.inStock ? 'Add to cart' : 'Unavailable'}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

function SpecRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

function getProductUnits(product: Product): ProductUnit[] {
  if (product.units.length > 0) {
    return product.units.slice().sort((left, right) => left.sortOrder - right.sortOrder);
  }

  return [
    {
      id: product.id,
      isDefault: true,
      label: product.unitLabel ?? 'Product',
      price: product.price,
      pricePiasters: product.pricePiasters,
      sortOrder: 1,
    },
  ];
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 22,
  },
  mediaPanel: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 318,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productPhoto: {
    height: '86%',
    width: '86%',
  },
  productImageFallback: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderRadius: 32,
    height: 112,
    justifyContent: 'center',
    width: 112,
  },
  productHeader: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    marginBottom: 12,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    marginBottom: 14,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  price: {
    color: '#00b6bd',
    fontSize: 24,
    fontWeight: '800',
  },
  stockPill: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderColor: '#BCEDEA',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  unitSelector: {
    backgroundColor: '#F7F8FA',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  unitSelectorLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 9,
    textTransform: 'uppercase',
  },
  unitOptionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitOption: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  unitOptionActive: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderColor: '#00b6bd',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  unitOptionText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '800',
  },
  unitOptionTextActive: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
  },
  outOfStockPill: {
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  stockPillText: {
    color: '#007F7B',
    fontSize: 12,
    fontWeight: '800',
  },
  outOfStockPillText: {
    color: '#9F1D1D',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 21,
  },
  specCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 20,
    padding: 16,
  },
  specRow: {
    alignItems: 'center',
    borderBottomColor: '#EEF0F2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  productDetailsBlock: {
    paddingTop: 14,
  },
  moreDetailsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  productDetailsTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 7,
  },
  moreDetailsText: {
    color: '#00b6bd',
    fontSize: 12,
    fontWeight: '800',
  },
  specLabel: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '800',
  },
  specValue: {
    color: '#111827',
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '76%',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  detailsModalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailsModalTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  detailsModalName: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 6,
  },
  detailsModalMeta: {
    color: '#00b6bd',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  detailsModalDescription: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16,
  },
  detailsModalRows: {
    borderTopColor: '#EEF0F2',
    borderTopWidth: 1,
  },
  actionBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionPrice: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#00b6bd',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  stateWrap: {
    marginBottom: 20,
    marginHorizontal: 20,
    marginTop: 20,
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
