import { Ionicons } from '@expo/vector-icons';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderCartButton } from '@/components/header-cart-button';
import { HeaderLogoTitle } from '@/components/header-logo-title';
import { HeaderSearchLink } from '@/components/header-search-link';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerShadowVisible: false,
        headerTintColor: '#00b6bd',
        headerTitleStyle: {
          color: '#111827',
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          header: (props) => <CatalogHeader {...props} />,
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
    <View style={[styles.catalogHeader, { paddingTop: insets.top + 10 }]}>
      <View style={styles.catalogHeaderTop}>
        <View style={styles.catalogLeftSlot}>
          {back ? (
            <Pressable
              accessibilityLabel="Go back"
              hitSlop={8}
              style={styles.catalogBackButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.catalogLogoSlot}>
          <HeaderLogoTitle />
        </View>

        <View style={styles.catalogRightSlot}>
          <HeaderCartButton />
        </View>
      </View>

      <HeaderSearchLink />
    </View>
  );
}

const styles = StyleSheet.create({
  catalogHeader: {
    backgroundColor: '#00b6bd',
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  catalogHeaderTop: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 52,
  },
  catalogLeftSlot: {
    alignItems: 'flex-start',
    width: 52,
  },
  catalogRightSlot: {
    alignItems: 'flex-end',
    width: 52,
  },
  catalogLogoSlot: {
    alignItems: 'center',
    flex: 1,
  },
  catalogBackButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
