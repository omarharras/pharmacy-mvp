import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
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
});
