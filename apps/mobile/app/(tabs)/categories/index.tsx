import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Category, Subcategory, getCategories, resolveImageUrl } from '@/lib/api';

const colors = {
  brand: '#00A9A5',
  brandSoft: '#E6F8F7',
  border: '#ECEFF3',
  page: '#F5F6F8',
  rail: '#FFFFFF',
  text: '#111827',
  muted: '#777D87',
  white: '#FFFFFF',
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedSubcategoryIds, setExpandedSubcategoryIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getCategories();
      setCategories(data);
      setSelectedCategoryId((currentId) => currentId ?? data[0]?.id ?? null);
      setExpandedSubcategoryIds(new Set());
    } catch {
      setErrorMessage('Unable to load categories. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? categories[0] ?? null,
    [categories, selectedCategoryId],
  );

  function selectCategory(category: Category) {
    setSelectedCategoryId(category.id);
    setExpandedSubcategoryIds(new Set());
  }

  function toggleSubcategory(subcategoryId: string) {
    setExpandedSubcategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(subcategoryId)) {
        nextIds.delete(subcategoryId);
      } else {
        nextIds.add(subcategoryId);
      }

      return nextIds;
    });
  }

  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.stateTitle}>Loading categories</Text>
        <Text style={styles.stateText}>Getting pharmacy departments.</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.errorTitle}>Could not connect</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Pressable style={styles.retryButton} onPress={loadCategories}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!selectedCategory) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.stateTitle}>No categories found</Text>
        <Text style={styles.stateText}>Check back soon for pharmacy departments.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.categoryRail}
        contentContainerStyle={styles.categoryRailContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategory.id;

          return (
            <Pressable
              key={category.id}
              style={[styles.railItem, isSelected ? styles.selectedRailItem : null]}
              onPress={() => selectCategory(category)}
            >
              <Text style={[styles.railText, isSelected ? styles.selectedRailText : null]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.detailPane}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        <Link
          href={{
            pathname: '/categories/products',
            params: {
              categoryId: selectedCategory.id,
              categoryName: selectedCategory.name,
            },
          }}
          asChild
        >
          <Pressable style={styles.allProductsButton}>
            <Text style={styles.allProductsText}>View all products</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.brand} />
          </Pressable>
        </Link>

        <View style={styles.subcategoryPanel}>
          <SubcategoryGroupList
            category={selectedCategory}
            expandedSubcategoryIds={expandedSubcategoryIds}
            subcategories={selectedCategory.subcategories}
            onToggle={toggleSubcategory}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SubcategoryGroupList({
  category,
  expandedSubcategoryIds,
  level = 0,
  subcategories,
  onToggle,
}: {
  category: Category;
  expandedSubcategoryIds: Set<string>;
  level?: number;
  subcategories: Subcategory[];
  onToggle: (subcategoryId: string) => void;
}) {
  const isNested = level > 0;
  const leafSubcategories = subcategories.filter(
    (subcategory) => (subcategory.children ?? []).length === 0,
  );
  const expandableSubcategories = subcategories.filter(
    (subcategory) => (subcategory.children ?? []).length > 0,
  );

  return (
    <View style={isNested ? styles.nestedList : styles.subcategoryList}>
      {leafSubcategories.map((subcategory) => (
        <View key={subcategory.id} style={isNested ? styles.nestedTileSlot : styles.tileSlot}>
          <SubcategoryTile category={category} subcategory={subcategory} />
        </View>
      ))}

      {expandableSubcategories.map((subcategory) => {
        const children = subcategory.children ?? [];
        const isExpanded = expandedSubcategoryIds.has(subcategory.id);

        return (
          <View key={subcategory.id} style={isNested ? styles.nestedSubcategoryBlock : styles.subcategoryBlock}>
            <Pressable
              style={isNested ? styles.nestedSubcategoryHeader : styles.subcategoryHeader}
              onPress={() => onToggle(subcategory.id)}
            >
              <Text style={isNested ? styles.nestedSubcategoryHeaderText : styles.subcategoryHeaderText}>
                {subcategory.name}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={isNested ? 18 : 20}
                color={colors.brand}
              />
            </Pressable>

            {isExpanded ? (
              <SubcategoryGroupList
                category={category}
                expandedSubcategoryIds={expandedSubcategoryIds}
                level={level + 1}
                subcategories={children}
                onToggle={onToggle}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function SubcategoryTile({
  category,
  subcategory,
}: {
  category: Category;
  subcategory: Subcategory;
}) {
  return (
    <Link
      href={{
        pathname: '/categories/products',
        params: {
          categoryId: category.id,
          categoryName: category.name,
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
        },
      }}
      asChild
    >
      <Pressable style={styles.childTile}>
        <View style={styles.childImageWrap}>
          {resolveImageUrl(subcategory.imageUrl) ? (
            <Image
              source={{ uri: resolveImageUrl(subcategory.imageUrl) ?? undefined }}
              resizeMode="cover"
              style={styles.childImage}
            />
          ) : (
            <Ionicons name="medical-outline" size={24} color={colors.brand} />
          )}
        </View>
        <Text style={styles.childName} numberOfLines={2}>
          {subcategory.name}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.page,
    flex: 1,
    flexDirection: 'row',
  },
  categoryRail: {
    backgroundColor: colors.rail,
    flexBasis: 96,
    flexGrow: 0,
    flexShrink: 0,
    maxWidth: 96,
    minWidth: 96,
    width: 96,
  },
  categoryRailContent: {
    paddingBottom: 28,
  },
  railItem: {
    alignItems: 'center',
    borderLeftColor: 'transparent',
    borderLeftWidth: 3,
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: 4,
  },
  selectedRailItem: {
    backgroundColor: colors.page,
    borderLeftColor: colors.brand,
  },
  railText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textAlign: 'center',
  },
  selectedRailText: {
    color: colors.text,
  },
  detailPane: {
    flexBasis: 0,
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },
  detailContent: {
    paddingBottom: 28,
    paddingHorizontal: 8,
    paddingTop: 14,
  },
  allProductsButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  allProductsText: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
  },
  subcategoryPanel: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  subcategoryBlock: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    width: '100%',
  },
  subcategoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
  },
  subcategoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 54,
    paddingHorizontal: 16,
    width: '100%',
  },
  subcategoryHeaderText: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
    textAlign: 'left',
  },
  nestedList: {
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 8,
    paddingTop: 8,
  },
  nestedSubcategoryBlock: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    width: '100%',
  },
  nestedSubcategoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: 12,
    width: '100%',
  },
  nestedSubcategoryHeaderText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
    textAlign: 'left',
  },
  tileSlot: {
    marginBottom: 14,
    width: '33.333%',
  },
  nestedTileSlot: {
    marginBottom: 14,
    width: '33.333%',
  },
  childTile: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  childImageWrap: {
    alignItems: 'center',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    width: 68,
  },
  childImage: {
    height: '100%',
    width: '100%',
  },
  childName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    minHeight: 32,
    textAlign: 'center',
  },
  centerState: {
    backgroundColor: colors.page,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  stateText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  errorTitle: {
    color: '#9F1D1D',
    fontSize: 16,
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
