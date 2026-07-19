import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { QuantityControl } from '@/components/quantity-control';
import { resolveImageUrl } from '@/lib/api';
import { formatPiasters, useRequest } from '@/lib/request-context';

export default function RequestSummaryScreen() {
  const router = useRouter();
  const {
    clearRequest,
    decrementProduct,
    itemCount,
    items,
    addProduct,
    totalPiasters,
  } = useRequest();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Your request is empty</Text>
          <Text style={styles.emptyText}>Add products from the catalog to start a pharmacy request.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/products')}>
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{itemCount}</Text>
            <Text style={styles.summaryLabel}>Estimated total</Text>
            <Text style={styles.totalValue}>{formatPiasters(totalPiasters)}</Text>
          </View>

          {items.map((item) => (
            <View key={item.product.id} style={styles.itemCard}>
              <View style={styles.itemImage}>
                {resolveImageUrl(item.product.imageUrl) ? (
                  <Image
                    source={{ uri: resolveImageUrl(item.product.imageUrl) ?? undefined }}
                    style={styles.itemPhoto}
                  />
                ) : (
                  <Text style={styles.itemImageText}>Product</Text>
                )}
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemMeta}>{item.product.packageSize}</Text>
                <Text style={styles.itemPrice}>{item.product.price.formatted}</Text>

                <View style={styles.quantityRow}>
                  <QuantityControl
                    quantity={item.quantity}
                    onIncrement={() => addProduct(item.product)}
                    onDecrement={() => decrementProduct(item.product.id)}
                  />
                </View>
              </View>
            </View>
          ))}

          <Pressable style={styles.secondaryButton} onPress={clearRequest}>
            <Text style={styles.secondaryButtonText}>Clear request</Text>
          </Pressable>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        </>
      )}
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
  emptyBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#087F5B',
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
  },
  summaryLabel: {
    color: '#D8F3E8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  itemImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  itemImageText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  itemPhoto: {
    borderRadius: 12,
    height: '100%',
    width: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },
  itemName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },
  itemMeta: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 7,
  },
  itemPrice: {
    color: '#087F5B',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#087F5B',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '800',
  },
});
