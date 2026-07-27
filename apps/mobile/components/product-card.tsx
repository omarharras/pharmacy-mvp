import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthRequiredModal } from '@/components/auth-required-modal';
import { Product, resolveProductImageUrl } from '@/lib/api';
import { useFavorites } from '@/lib/favorites-context';
import { useRequest } from '@/lib/request-context';
import { useSession } from '@/lib/session-context';

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const { isLoggedIn } = useSession();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const defaultUnit = product.units.find((unit) => unit.isDefault) ?? product.units[0];
  const quantity = defaultUnit ? getProductQuantity(product.id, defaultUnit.id) : 0;
  const favorited = isFavorite(product.id);

  const onToggleFavorite = async () => {
    if (!isLoggedIn) {
      setShowAuthPrompt(true);
      return;
    }

    try {
      await toggleFavorite(product);
    } catch {
      Alert.alert('Could not update favorite', 'Check that the API is running.');
    }
  };

  return (
    <>
      <View style={variant === 'rail' ? styles.railCard : styles.gridCard}>
      <Pressable
        accessibilityLabel={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
        hitSlop={8}
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={19}
          color={favorited ? '#E11D48' : colors.muted}
        />
      </Pressable>

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
      <AuthRequiredModal
        returnTo="/favorites"
        visible={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </>
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
    position: 'relative',
  },
  railCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 204,
    padding: 10,
    position: 'relative',
    width: 158,
  },
  favoriteButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 9,
    top: 9,
    width: 30,
    zIndex: 2,
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
