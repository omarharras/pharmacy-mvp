import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
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

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setCategories(await getCategories());
    } catch {
      setErrorMessage('Unable to load categories. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading categories</Text>
          <Text style={styles.stateText}>Getting pharmacy departments.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadCategories}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !errorMessage && categories.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>No categories found</Text>
          <Text style={styles.stateText}>Check back soon for pharmacy departments.</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={{
              pathname: '/categories/[id]',
              params: {
                categoryName: category.name,
                id: category.id,
              },
            }}
            asChild
          >
            <Pressable style={styles.categoryCard}>
              <View style={styles.imageBox}>
                {resolveImageUrl(category.imageUrl) ? (
                  <Image
                    source={{ uri: resolveImageUrl(category.imageUrl) ?? undefined }}
                    resizeMode="cover"
                    style={styles.categoryImage}
                  />
                ) : (
                  <View style={styles.fallbackIcon}>
                    <Ionicons name="medical-outline" size={28} color={colors.brand} />
                  </View>
                )}
              </View>

              <Text style={styles.categoryTitle} numberOfLines={2}>
                {category.name}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryCard: {
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
  categoryImage: {
    height: '100%',
    width: '100%',
  },
  fallbackIcon: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitle: {
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
