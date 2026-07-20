import { Stack } from 'expo-router';

import { HeaderCartButton } from '@/components/header-cart-button';

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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Categories',
          headerRight: () => <HeaderCartButton />,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Category',
          headerRight: () => <HeaderCartButton />,
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          title: 'Products',
          headerRight: () => <HeaderCartButton />,
        }}
      />
    </Stack>
  );
}
