import { Stack } from 'expo-router';

import { HeaderCartButton } from '@/components/header-cart-button';
import { HeaderLogoTitle } from '@/components/header-logo-title';
import { InsuranceProvider } from '@/lib/insurance-context';
import { RequestProvider } from '@/lib/request-context';
import { SessionProvider } from '@/lib/session-context';

export default function RootLayout() {
  return (
    <SessionProvider>
      <InsuranceProvider>
        <RequestProvider>
          <Stack
            screenOptions={{
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: '#00b6bd',
              },
              headerShadowVisible: false,
              headerTintColor: '#FFFFFF',
              headerTitle: () => <HeaderLogoTitle />,
              headerTitleAlign: 'center',
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
              name="insurance"
              options={{
                title: 'Insurance profile',
              }}
            />
            <Stack.Screen
              name="insurance-providers"
              options={{
                title: 'Insurance providers',
              }}
            />
            <Stack.Screen
              name="branches"
              options={{
                title: 'Branches',
              }}
            />
            <Stack.Screen
              name="support"
              options={{
                title: 'Customer support',
              }}
            />
            <Stack.Screen
              name="privacy"
              options={{
                title: 'Privacy policy',
              }}
            />
            <Stack.Screen
              name="about"
              options={{
                title: 'About',
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
      </InsuranceProvider>
    </SessionProvider>
  );
}
