import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Product, resolveProductImageUrl } from '@/lib/api';
import { useRequest } from '@/lib/request-context';

import { QuantityControl } from './quantity-control';

type ProductCardProps = {
  product: Product;
  variant?: 'grid' | 'rail';
};

const colors = {
  brand: '#00b6bd',
  border: '#E5E7EB',
  muted: '#9CA3AF',
  text: '#111827',
  white: '#FFFFFF',
};

export function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const defaultUnit = product.units.find((unit) => unit.isDefault) ?? product.units[0];
  const quantity = defaultUnit ? getProductQuantity(product.id, defaultUnit.id) : 0;

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
            <Image
              source={{ uri: resolveProductImageUrl(product.imageUrl) ?? undefined }}
              resizeMode="contain"
              style={styles.productPhoto}
            />
          </View>

          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
        </Pressable>
      </Link>

      <View style={styles.priceActionRow}>
        <Text style={styles.productPrice}>
          {defaultUnit?.price.formatted ?? product.price.formatted}
        </Text>

        {quantity > 0 && defaultUnit ? (
          <QuantityControl
            quantity={quantity}
            onIncrement={() => addProduct(product, defaultUnit)}
            onDecrement={() => decrementProduct(product.id, defaultUnit.id)}
          />
        ) : (
          <Pressable
            style={styles.addButton}
            onPress={() => addProduct(product, defaultUnit)}
          >
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
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 96,
    justifyContent: 'center',
    marginBottom: 8,
    width: '100%',
  },
  productPhoto: {
    borderRadius: 12,
    height: '100%',
    width: '100%',
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
