import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Category, getCategories, resolveImageUrl } from '@/lib/api';

const colors = {
  brand: '#00A9A5',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  page: '#F7F8FA',
  text: '#111827',
  muted: '#6B7280',
  white: '#FFFFFF',
};

export default function SubcategoriesScreen() {
  const params = useLocalSearchParams<{
    categoryName?: string;
    id?: string;
  }>();
  const categoryId = typeof params.id === 'string' ? params.id : undefined;
  const fallbackCategoryName =
    typeof params.categoryName === 'string' ? params.categoryName : 'Category';
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const categories = await getCategories();
      setCategory(categories.find((item) => item.id === categoryId) ?? null);
    } catch {
      setErrorMessage('Unable to load subcategories. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    void loadCategory();
  }, [loadCategory]);

  const categoryName = category?.name ?? fallbackCategoryName;
  const subcategories = category?.subcategories ?? [];

  return (
    <>
      <Stack.Screen options={{ title: categoryName }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Link href="/search" asChild>
          <Pressable style={styles.searchBox}>
            <Ionicons name="search-outline" size={19} color={colors.brand} />
            <Text style={styles.searchPlaceholder}>Search medicines and products</Text>
          </Pressable>
        </Link>

        {isLoading ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>Loading subcategories</Text>
            <Text style={styles.stateText}>Getting departments under {categoryName}.</Text>
          </View>
        ) : null}

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Could not connect</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Pressable style={styles.retryButton} onPress={loadCategory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!isLoading && !errorMessage && subcategories.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateTitle}>No subcategories found</Text>
            <Text style={styles.stateText}>View all products in this category.</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          {categoryId ? (
            <Link
              href={{
                pathname: '/categories/products',
                params: {
                  categoryId,
                  categoryName,
                },
              }}
              asChild
            >
              <Pressable style={styles.subcategoryCard}>
                <View style={styles.imageBox}>
                  {resolveImageUrl(category?.imageUrl ?? null) ? (
                    <Image
                      source={{ uri: resolveImageUrl(category?.imageUrl ?? null) ?? undefined }}
                      resizeMode="cover"
                      style={styles.subcategoryImage}
                    />
                  ) : (
                    <View style={styles.fallbackIcon}>
                      <Ionicons name="medical-outline" size={28} color={colors.brand} />
                    </View>
                  )}
                </View>

                <Text style={styles.subcategoryTitle} numberOfLines={2}>
                  All {categoryName}
                </Text>
              </Pressable>
            </Link>
          ) : null}

          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={{
                pathname: '/categories/products',
                params: {
                  categoryId,
                  categoryName,
                  subcategoryId: subcategory.id,
                  subcategoryName: subcategory.name,
                },
              }}
              asChild
            >
              <Pressable style={styles.subcategoryCard}>
                <View style={styles.imageBox}>
                  {resolveImageUrl(subcategory.imageUrl) ? (
                    <Image
                      source={{ uri: resolveImageUrl(subcategory.imageUrl) ?? undefined }}
                      resizeMode="cover"
                      style={styles.subcategoryImage}
                    />
                  ) : (
                    <View style={styles.fallbackIcon}>
                      <Ionicons name="medical-outline" size={28} color={colors.brand} />
                    </View>
                  )}
                </View>

                <Text style={styles.subcategoryTitle} numberOfLines={2}>
                  {subcategory.name}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingTop: 18,
    paddingHorizontal: 8,
    paddingBottom: 32,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    marginBottom: 12,
    marginHorizontal: 12,
    paddingHorizontal: 14,
  },
  searchPlaceholder: {
    color: '#8A8A8A',
    flex: 1,
    fontSize: 15,
    marginLeft: 9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subcategoryCard: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
    width: '33.333%',
  },
  imageBox: {
    backgroundColor: colors.brandSoft,
    borderRadius: 9,
    height: 108,
    marginBottom: 8,
    overflow: 'hidden',
    width: '100%',
  },
  subcategoryImage: {
    height: '100%',
    width: '100%',
  },
  fallbackIcon: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subcategoryTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    minHeight: 32,
    textAlign: 'center',
  },
  stateBox: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    marginHorizontal: 12,
    padding: 16,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  stateText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    marginHorizontal: 12,
    padding: 16,
  },
  errorTitle: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '800',
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
    color: colors.white,
    fontWeight: '800',
  },
});
