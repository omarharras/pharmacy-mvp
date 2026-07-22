import { Ionicons } from '@expo/vector-icons';
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
    items,
    removeProduct,
    totalPiasters,
  } = useRequest();

  return (
    <View style={styles.screen}>
      {items.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyIcon}>
            <Ionicons name="cart-outline" size={42} color="#00b6bd" />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add medicines and pharmacy products to continue.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/categories')}>
            <Ionicons name="bag-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pageTitle}>Cart</Text>

            <View style={styles.itemsHeader}>
              <Text style={styles.itemsTitle}>Items</Text>
              <Pressable onPress={() => router.push('/categories')}>
                <Text style={styles.addMoreText}>Add more</Text>
              </Pressable>
            </View>

            {items.map((item) => {
              return (
                <View key={`${item.product.id}-${item.unit.id}`} style={styles.itemCard}>
                  <View style={styles.itemTopRow}>
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
                      <View style={styles.itemNameRow}>
                        <Text style={styles.itemName} numberOfLines={2}>
                          {item.product.name}
                        </Text>
                        <Pressable
                          accessibilityLabel={`Remove ${item.product.name}`}
                          hitSlop={8}
                          style={styles.removeButton}
                          onPress={() => removeProduct(item.product.id, item.unit.id)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#9F1D1D" />
                        </Pressable>
                      </View>
                      <Text style={styles.itemMeta}>
                        {[item.unit.label, item.product.packageSize].filter(Boolean).join(' / ')}
                      </Text>
                      <View style={styles.itemActionRow}>
                        <Text style={styles.itemUnitPrice}>{item.unit.price.formatted}</Text>
                        <QuantityControl
                          quantity={item.quantity}
                          onIncrement={() => addProduct(item.product, item.unit)}
                          onDecrement={() => decrementProduct(item.product.id, item.unit.id)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.checkoutBar}>
            <View>
              <Text style={styles.checkoutLabel}>Total</Text>
              <Text style={styles.checkoutValue}>{formatPiasters(totalPiasters)}</Text>
            </View>
            <Link href="/checkout" asChild>
              <Pressable style={styles.checkoutButton}>
                <Ionicons name="card-outline" size={19} color="#FFFFFF" />
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </Pressable>
            </Link>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  pageTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  emptyContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    marginBottom: 18,
    width: 76,
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
    marginBottom: 22,
    textAlign: 'center',
  },
  itemsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemsTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  addMoreText: {
    color: '#00b6bd',
    fontSize: 13,
    fontWeight: '800',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  itemTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
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
    marginLeft: 12,
  },
  itemNameRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  itemName: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  removeButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: -4,
    width: 30,
  },
  itemMeta: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 6,
  },
  itemUnitPrice: {
    color: '#00b6bd',
    fontSize: 14,
    fontWeight: '800',
  },
  itemActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkoutBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  checkoutLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  checkoutValue: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  checkoutButton: {
    alignItems: 'center',
    backgroundColor: '#00b6bd',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 7,
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
    backgroundColor: '#00b6bd',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
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
