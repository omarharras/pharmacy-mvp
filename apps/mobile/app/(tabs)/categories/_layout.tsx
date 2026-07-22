import { Ionicons } from '@expo/vector-icons';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderCartButton } from '@/components/header-cart-button';
import { HeaderLogoTitle } from '@/components/header-logo-title';
import { HeaderSearchLink } from '@/components/header-search-link';

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: {
          backgroundColor: '#00b6bd',
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

function CatalogHeader({ back }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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

        <View style={styles.logoSlot}>
          <HeaderLogoTitle />
        </View>

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
    backgroundColor: '#00b6bd',
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
  logoSlot: {
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
