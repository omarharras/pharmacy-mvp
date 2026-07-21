import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  useWindowDimensions,
  View,
} from 'react-native';

import { ProductCard } from '@/components/product-card';
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

type HomeData = {
  brands: Brand[];
  categories: Category[];
  offers: Offer[];
  products: Product[];
};

const colors = {
  brand: '#00A9A5',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  page: '#F7F8FA',
  text: '#111827',
  muted: '#6B7280',
  white: '#FFFFFF',
};

const bannerImageUrls = [
  '/images/banners/prescription-upload-banner.png?v=5',
  '/images/banners/monthly-wellness-banner.png?v=5',
  '/images/banners/skin-care-banner.png?v=5',
  '/images/banners/baby-care-delivered-banner.png?v=5',
  '/images/banners/weekly-pharmacy-offers-banner.png?v=5',
  '/images/banners/chronic-care-refills-banner.png?v=5',
];

const promoGap = 12;
const promoPeek = 18;
const promoSideInset = promoPeek + promoGap;

type PromoSlide = {
  href: '/categories' | '/request';
  imageUrl: string | null;
  params?: {
    type: 'prescription';
  };
  title: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const promoScrollRef = useRef<ScrollView>(null);
  const activePromoIndexRef = useRef(0);
  const { width: screenWidth } = useWindowDimensions();
  const [homeData, setHomeData] = useState<HomeData>({
    brands: [],
    categories: [],
    offers: [],
    products: [],
  });
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const promoWidth = Math.max(screenWidth - promoSideInset * 2, 1);
  const promoHeight = Math.round(promoWidth / 2.05);

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

  const popularProducts = useMemo(
    () => homeData.products.filter((product) => product.isPopular).slice(0, 6),
    [homeData.products],
  );
  const promoSlides = useMemo<PromoSlide[]>(() => {
    return bannerImageUrls.map((imageUrl) => {
      const isPrescriptionBanner = imageUrl.includes('prescription');

      return {
        href: isPrescriptionBanner ? '/request' : '/categories',
        imageUrl,
        params: isPrescriptionBanner ? { type: 'prescription' as const } : undefined,
        title: imageUrl,
      };
    });
  }, []);
  const loopedPromoSlides = useMemo(() => {
    if (promoSlides.length <= 1) {
      return promoSlides.map((slide, index) => ({ ...slide, loopKey: `single-${index}` }));
    }

    return [
      { ...promoSlides[promoSlides.length - 1], loopKey: 'buffer-start' },
      ...promoSlides.map((slide, index) => ({ ...slide, loopKey: `real-${index}` })),
      { ...promoSlides[0], loopKey: 'buffer-end' },
    ];
  }, [promoSlides]);
  const promoStep = promoWidth + promoGap;

  const setPromoIndex = useCallback((nextIndex: number) => {
    activePromoIndexRef.current = nextIndex;
    setActivePromoIndex(nextIndex);
  }, []);

  useEffect(() => {
    if (promoSlides.length <= 1) {
      return;
    }

    requestAnimationFrame(() => {
      promoScrollRef.current?.scrollTo({ animated: false, x: promoStep });
    });
  }, [promoSlides.length, promoStep]);

  useEffect(() => {
    if (promoSlides.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      const nextLoopIndex = activePromoIndexRef.current + 2;
      promoScrollRef.current?.scrollTo({
        animated: true,
        x: nextLoopIndex * promoStep,
      });
    }, 4200);

    return () => {
      clearInterval(intervalId);
    };
  }, [promoSlides.length, promoStep]);

  const handlePromoScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.x / promoStep);

    if (promoSlides.length <= 1) {
      setPromoIndex(0);
      return;
    }

    if (rawIndex === 0) {
      setPromoIndex(promoSlides.length - 1);
      requestAnimationFrame(() => {
        promoScrollRef.current?.scrollTo({
          animated: false,
          x: promoSlides.length * promoStep,
        });
      });
      return;
    }

    if (rawIndex === promoSlides.length + 1) {
      setPromoIndex(0);
      requestAnimationFrame(() => {
        promoScrollRef.current?.scrollTo({ animated: false, x: promoStep });
      });
      return;
    }

    setPromoIndex(Math.min(Math.max(rawIndex - 1, 0), promoSlides.length - 1));
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.promoSection}>
          <ScrollView
            ref={promoScrollRef}
            horizontal
            decelerationRate="fast"
            snapToInterval={promoStep}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoRail}
            onMomentumScrollEnd={handlePromoScroll}
          >
            {loopedPromoSlides.map((slide) => {
              const resolvedImageUrl = resolveImageUrl(slide.imageUrl);

              return (
                <Pressable
                  key={slide.loopKey}
                  style={[styles.promoCard, { height: promoHeight, width: promoWidth }]}
                  onPress={() => {
                    if (slide.href === '/request') {
                      router.push({
                        pathname: '/request',
                        params: slide.params,
                      });
                      return;
                    }

                    router.push('/categories');
                  }}
                >
                  {resolvedImageUrl ? (
                    <Image
                      source={{ uri: resolvedImageUrl }}
                      resizeMode="contain"
                      style={styles.promoImage}
                    />
                  ) : (
                    <View style={styles.promoFallback}>
                      <Ionicons name="medical-outline" size={48} color={colors.brand} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.promoDots}>
            {promoSlides.map((slide, index) => (
              <View
                key={`${slide.title}-dot`}
                style={index === activePromoIndex ? styles.promoDotActive : styles.promoDot}
              />
            ))}
          </View>
        </View>

        <View style={styles.actionBand}>
          <Text style={styles.actionBandTitle}>How can we help?</Text>

          <View style={styles.primaryActionRow}>
            <Link href="/categories" asChild>
              <Pressable style={styles.shopAction}>
                <View style={styles.primaryActionIcon}>
                  <Ionicons name="bag-outline" size={24} color={colors.white} />
                </View>
                <Text style={styles.shopActionTitle}>Shop products</Text>
              </Pressable>
            </Link>

            <Link
              href={{
                pathname: '/request',
                params: {
                  type: 'prescription',
                },
              }}
              asChild
            >
              <Pressable style={styles.prescriptionAction}>
                <View style={styles.secondaryActionIcon}>
                  <Ionicons name="document-text-outline" size={24} color={colors.brand} />
                </View>
                <Text style={styles.prescriptionActionTitle}>Upload prescription</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.utilityRow}>
            <Pressable
              style={styles.utilityChip}
              onPress={() => Alert.alert('Customer support', 'The support phone number will be added before release.')}
            >
              <Ionicons name="call-outline" size={17} color={colors.brand} />
              <Text style={styles.utilityChipText}>Call support</Text>
            </Pressable>

            <Link href="/branches" asChild>
              <Pressable style={styles.utilityChip}>
                <Ionicons name="business-outline" size={17} color={colors.brand} />
                <Text style={styles.utilityChipText}>Find branch</Text>
              </Pressable>
            </Link>
          </View>
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

        <SectionHeader title="Categories" href="/categories" />

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
                      resizeMode="cover"
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

        <SectionHeader title="Brands" href="/products" />

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

        <SectionHeader title="Popular products" href="/products" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productRail}
        >
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="rail" />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

type SectionHeaderProps = {
  href: '/categories' | '/products';
  title: string;
};

function SectionHeader({ href, title }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <Link href={href} asChild>
        <Pressable>
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingTop: 18,
    paddingBottom: 32,
  },
  promoSection: {
    marginBottom: 20,
  },
  promoRail: {
    gap: promoGap,
    paddingHorizontal: promoSideInset,
  },
  promoCard: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  promoImage: {
    height: '100%',
    width: '100%',
  },
  promoFallback: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  promoDots: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(17,24,39,0.18)',
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -20,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  promoDot: {
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: 4,
    height: 5,
    marginHorizontal: 2.5,
    width: 5,
  },
  promoDotActive: {
    backgroundColor: colors.white,
    borderRadius: 4,
    height: 5,
    marginHorizontal: 2.5,
    width: 18,
  },
  actionBand: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 22,
    padding: 14,
  },
  actionBandTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  primaryActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  shopAction: {
    backgroundColor: colors.brand,
    borderRadius: 14,
    flex: 1,
    minHeight: 96,
    padding: 14,
  },
  prescriptionAction: {
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 96,
    padding: 14,
  },
  primaryActionIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
    width: 38,
  },
  secondaryActionIcon: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    marginBottom: 12,
    width: 38,
  },
  shopActionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  prescriptionActionTitle: {
    color: colors.brandDark,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  utilityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  utilityChip: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
  },
  utilityChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  stateBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 20,
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
    marginHorizontal: 20,
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
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  seeAllText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '800',
  },
  categoryRail: {
    gap: 14,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 8,
  },
  categoryRailItem: {
    alignItems: 'center',
    width: 78,
  },
  categoryImageWrap: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 74,
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    width: 74,
  },
  categoryIcon: {
    backgroundColor: colors.brandSoft,
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
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
  },
  brandRail: {
    gap: 12,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 8,
  },
  brandRailItem: {
    alignItems: 'center',
    width: 94,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    marginBottom: 8,
    width: 94,
  },
  brandInitial: {
    color: colors.brand,
    fontSize: 20,
    fontWeight: '800',
  },
  brandText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
  },
  productRail: {
    gap: 12,
    paddingBottom: 4,
    paddingLeft: 20,
    paddingRight: 8,
  },
});
