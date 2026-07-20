import { Link, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { QuantityControl } from '@/components/quantity-control';
import { resolveImageUrl } from '@/lib/api';
import { formatPiasters, useRequest } from '@/lib/request-context';

export default function CartScreen() {
  const router = useRouter();
  const {
    addProduct,
    decrementProduct,
    itemCount,
    items,
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
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse categories and add products before checkout.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/categories')}>
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {items.map((item) => (
            <View key={item.product.id} style={styles.itemCard}>
              <View style={styles.itemImage}>
                {resolveImageUrl(item.product.imageUrl) ? (
                  <Image
                    source={{ uri: resolveImageUrl(item.product.imageUrl) ?? undefined }}
                    resizeMode="contain"
                    style={styles.itemPhoto}
                  />
                ) : (
                  <Text style={styles.itemImageText}>Product</Text>
                )}
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemMeta}>{item.product.packageSize}</Text>
                <Text style={styles.itemPrice}>{item.product.price.formatted}</Text>
              </View>

              <QuantityControl
                quantity={item.quantity}
                onIncrement={() => addProduct(item.product)}
                onDecrement={() => decrementProduct(item.product.id)}
              />
            </View>
          ))}

          <View style={styles.totalBar}>
            <View>
              <Text style={styles.totalLabel}>{itemCount} items</Text>
              <Text style={styles.totalValue}>{formatPiasters(totalPiasters)}</Text>
            </View>

            <Link href="/checkout" asChild>
              <Pressable style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </Pressable>
            </Link>
          </View>
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
  itemCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 12,
  },
  itemImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  itemImageText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  itemPhoto: {
    borderRadius: 12,
    height: '88%',
    width: '88%',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemMeta: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 6,
  },
  itemPrice: {
    color: '#00A9A5',
    fontSize: 14,
    fontWeight: '800',
  },
  totalBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#BCEDEA',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    padding: 14,
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  totalValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: '#00A9A5',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#00A9A5',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
