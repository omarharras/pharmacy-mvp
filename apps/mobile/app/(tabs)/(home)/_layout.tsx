import { Ionicons } from '@expo/vector-icons';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Stack, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderCartButton } from '@/components/header-cart-button';
import { HeaderSearchLink } from '@/components/header-search-link';

const logoImage = require('../../../assets/images/elkhabiry-logo.png');

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerShadowVisible: false,
        headerTintColor: '#00A9A5',
        headerTitleStyle: {
          color: '#111827',
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: () => <HomeHeader />,
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

function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.homeHeader, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerTop}>
        <Image source={logoImage} resizeMode="contain" style={styles.logo} />
        <View style={styles.cartSlot}>
          <HeaderCartButton />
        </View>
      </View>

      <View style={styles.locationBlock}>
        <Text style={styles.greeting}>Good morning</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={15} color="#CFF2F1" />
          <Text style={styles.locationText} numberOfLines={1}>
            Deliver to 1 Al Moatamed
          </Text>
        </View>
      </View>
      <HeaderSearchLink />
    </View>
  );
}

function CatalogHeader({ back, options, route }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const title = options.title ?? route.name;

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

        <Text style={styles.catalogTitle} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.catalogRightSlot}>
          <HeaderCartButton />
        </View>
      </View>

      <HeaderSearchLink />
    </View>
  );
}

const styles = StyleSheet.create({
  homeHeader: {
    backgroundColor: '#00A9A5',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  headerTop: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 58,
  },
  cartSlot: {
    position: 'absolute',
    right: 0,
  },
  logo: {
    height: 58,
    width: 178,
  },
  locationBlock: {
    marginBottom: 16,
    paddingRight: 52,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  locationText: {
    color: '#CFF2F1',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  catalogHeader: {
    backgroundColor: '#00A9A5',
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
  catalogBackButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  catalogTitle: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
});
