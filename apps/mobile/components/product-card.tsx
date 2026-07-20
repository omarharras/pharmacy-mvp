import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Product, resolveImageUrl } from '@/lib/api';
import { useRequest } from '@/lib/request-context';

import { QuantityControl } from './quantity-control';

type ProductCardProps = {
  product: Product;
  variant?: 'grid' | 'rail';
};

const colors = {
  brand: '#00A9A5',
  border: '#E5E7EB',
  image: '#F0F2F5',
  muted: '#9CA3AF',
  text: '#111827',
  white: '#FFFFFF',
};

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const quantity = getProductQuantity(product.id);

  return (
    <View style={variant === 'rail' ? styles.railCard : styles.gridCard}>
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
                resizeMode="contain"
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

      <View style={styles.priceActionRow}>
        <Text style={styles.productPrice}>{product.price.formatted}</Text>

        {quantity > 0 ? (
          <QuantityControl
            quantity={quantity}
            onIncrement={() => addProduct(product)}
            onDecrement={() => decrementProduct(product.id)}
          />
        ) : (
          <Pressable style={styles.addButton} onPress={() => addProduct(product)}>
            <Ionicons name="add" size={17} color={colors.white} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 204,
    padding: 10,
    width: '49%',
  },
  railCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 204,
    padding: 10,
    width: 158,
  },
  productLink: {
    flex: 1,
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: colors.image,
    borderRadius: 12,
    height: 96,
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  productImageText: {
    color: colors.muted,
    fontSize: 12,
  },
  productPhoto: {
    borderRadius: 12,
    height: '88%',
    width: '88%',
  },
  productName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
    minHeight: 36,
  },
  productPrice: {
    color: colors.brand,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  priceActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
});
