import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Category, getCategories, resolveImageUrl } from '@/lib/api';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const placeholderCount = (3 - (categories.length % 3)) % 3;

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getCategories();
      setCategories(data);
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
      <Text style={styles.title}>Categories</Text>

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

      <View style={styles.grid}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={{
              pathname: '/categories/products',
              params: {
                categoryId: category.id,
                categoryName: category.name,
              },
            }}
            asChild
          >
            <Pressable style={styles.card}>
              {resolveImageUrl(category.imageUrl) ? (
                <Image
                  source={{ uri: resolveImageUrl(category.imageUrl) ?? undefined }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.icon} />
              )}
              <Text style={styles.cardTitle}>{category.name}</Text>
            </Pressable>
          </Link>
        ))}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <View
            key={`category-placeholder-${index}`}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.card}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    alignItems: 'center',
    marginBottom: 14,
    minHeight: 156,
    width: '32.5%',
  },
  icon: {
    backgroundColor: '#E7F5EF',
    borderRadius: 18,
    height: 92,
    marginBottom: 11,
    width: 92,
  },
  image: {
    borderRadius: 14,
    height: 92,
    marginBottom: 11,
    width: 92,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textAlign: 'center',
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
});
