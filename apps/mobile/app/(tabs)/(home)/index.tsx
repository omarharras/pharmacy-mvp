import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Brand,
  Category,
  Offer,
  Product,
  getBrands,
  getCategories,
  getOffers,
  getProducts,
  resolveImageUrl,
} from '@/lib/api';
import { QuantityControl } from '@/components/quantity-control';
import { useRequest } from '@/lib/request-context';

type HomeData = {
  brands: Brand[];
  categories: Category[];
  offers: Offer[];
  products: Product[];
};

export default function HomeScreen() {
  const { addProduct, decrementProduct, getProductQuantity } = useRequest();
  const [homeData, setHomeData] = useState<HomeData>({
    brands: [],
    categories: [],
    offers: [],
    products: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHomeData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [brands, categories, offers, products] = await Promise.all([
        getBrands(),
        getCategories(),
        getOffers(),
        getProducts(),
      ]);

      setHomeData({ brands, categories, offers, products });
    } catch {
      setErrorMessage('Unable to load pharmacy data. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHomeData();
  }, [loadHomeData]);

  const featuredOffer = homeData.offers[0];
  const popularProducts = useMemo(
    () => homeData.products.filter((product) => product.isPopular).slice(0, 2),
    [homeData.products],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Link href="/search" asChild>
        <Pressable style={styles.searchInput}>
          <Text style={styles.searchPlaceholder}>Search medicines and products</Text>
        </Pressable>
      </Link>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>{featuredOffer?.title ?? 'Upload your prescription'}</Text>

        <Text style={styles.bannerDescription}>
          {featuredOffer?.description ??
            'Send your prescription and our pharmacist will review it.'}
        </Text>

        <Pressable style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>{featuredOffer?.badge ?? 'Upload now'}</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading pharmacy data</Text>
          <Text style={styles.stateText}>Getting categories, offers, and products.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadHomeData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>

        <Link href="/categories" asChild>
          <Pressable>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </Link>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRail}
      >
        {homeData.categories.map((category) => (
          <Link
            key={category.id}
            href={{
              pathname: '/products',
              params: {
                categoryId: category.id,
                categoryName: category.name,
              },
            }}
            asChild
          >
            <Pressable style={styles.categoryRailItem}>
              <View style={styles.categoryImageWrap}>
                {resolveImageUrl(category.imageUrl) ? (
                  <Image
                    source={{ uri: resolveImageUrl(category.imageUrl) ?? undefined }}
                    style={styles.categoryImage}
                  />
                ) : (
                  <View style={styles.categoryIcon} />
                )}
              </View>

              <Text style={styles.categoryText} numberOfLines={2}>
                {category.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Brands</Text>

        <Link
          href={{
            pathname: '/products',
          }}
          asChild
        >
          <Pressable>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </Link>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandRail}
      >
        {homeData.brands
          .filter((brand) => brand.isFeatured)
          .slice(0, 8)
          .map((brand) => (
            <Link
              key={brand.id}
              href={{
                pathname: '/products',
                params: {
                  brandId: brand.id,
                  brandName: brand.name,
                },
              }}
              asChild
            >
              <Pressable style={styles.brandRailItem}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandInitial}>{brand.name.slice(0, 1)}</Text>
                </View>
                <Text style={styles.brandText} numberOfLines={2}>
                  {brand.name}
                </Text>
              </Pressable>
            </Link>
          ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular products</Text>

        <Pressable>
          <Link href="/products" asChild>
            <Text style={styles.seeAllText}>See all</Text>
          </Link>
        </Pressable>
      </View>

      {popularProducts.map((product) => (
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

              <View style={styles.productDetails}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.packageSize}</Text>
                <Text style={styles.productPrice}>{product.price.formatted}</Text>
              </View>
            </Pressable>
          </Link>

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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  searchInput: {
    justifyContent: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchPlaceholder: {
    color: '#8A8A8A',
    fontSize: 15,
  },
  banner: {
    backgroundColor: '#087F5B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  bannerDescription: {
    color: '#D8F3E8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  bannerButtonText: {
    color: '#087F5B',
    fontWeight: '700',
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
  sectionTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '700',
  },
  categoryRail: {
    gap: 14,
    paddingBottom: 26,
    paddingRight: 8,
  },
  categoryRailItem: {
    alignItems: 'center',
    width: 78,
  },
  categoryImageWrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    height: 74,
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    width: 74,
  },
  categoryIcon: {
    backgroundColor: '#E7F5EF',
    borderRadius: 18,
    height: 52,
    width: 52,
  },
  categoryImage: {
    height: '100%',
    width: '100%',
  },
  categoryText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
  },
  brandRail: {
    gap: 12,
    paddingBottom: 26,
    paddingRight: 8,
  },
  brandRailItem: {
    alignItems: 'center',
    width: 94,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    marginBottom: 8,
    width: 94,
  },
  brandInitial: {
    color: '#087F5B',
    fontSize: 20,
    fontWeight: '800',
  },
  brandText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#087F5B',
    fontWeight: '600',
  },
  productCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  productLink: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 76,
    justifyContent: 'center',
    width: 76,
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
  productDetails: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  productDescription: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 8,
  },
  productPrice: {
    color: '#087F5B',
    fontSize: 15,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#087F5B',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 26,
  },
});
