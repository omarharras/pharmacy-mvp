import { Stack } from 'expo-router';

import { HeaderCartButton } from '@/components/header-cart-button';
import { RequestProvider } from '@/lib/request-context';

export default function RootLayout() {
  return (
    <RequestProvider>
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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="products/[id]"
          options={{
            title: 'Product details',
            headerRight: () => <HeaderCartButton />,
          }}
        />
        <Stack.Screen
          name="request"
          options={{
            title: 'Prescription checkout',
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: 'Cart',
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: 'Checkout',
          }}
        />
        <Stack.Screen
          name="address"
          options={{
            title: 'Add address',
          }}
        />
        <Stack.Screen
          name="addresses"
          options={{
            title: 'Saved addresses',
          }}
        />
        <Stack.Screen
          name="branches"
          options={{
            title: 'Branches',
          }}
        />
        <Stack.Screen
          name="signin"
          options={{
            title: 'Sign in',
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Create account',
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: 'Search',
            headerRight: () => <HeaderCartButton />,
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            title: 'Order details',
          }}
        />
      </Stack>
    </RequestProvider>
  );
}
