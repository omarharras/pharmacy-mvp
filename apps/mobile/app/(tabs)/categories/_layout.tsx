import { Ionicons } from '@expo/vector-icons';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderCartButton } from '@/components/header-cart-button';
import { HeaderSearchLink } from '@/components/header-search-link';

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#00A9A5',
        },
        headerShadowVisible: false,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          color: '#FFFFFF',
          fontWeight: '700',
        },
        header: (props) => <CatalogHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Categories',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Category',
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: 'Products',
        }}
      />
    </Stack>
  );
}

function CatalogHeader({ back, options, route }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const title = options.title ?? route.name;

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerTop}>
        <View style={styles.leftSlot}>
          {back ? (
            <Pressable
              accessibilityLabel="Go back"
              hitSlop={8}
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.rightSlot}>
          <HeaderCartButton />
        </View>
      </View>

      <HeaderSearchLink />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#00A9A5',
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 52,
    marginBottom: 12,
  },
  leftSlot: {
    alignItems: 'flex-start',
    width: 52,
  },
  rightSlot: {
    alignItems: 'flex-end',
    width: 52,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
});
