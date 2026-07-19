import { Link, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { RequestProvider, useRequest } from '@/lib/request-context';

export default function RootLayout() {
  return (
    <RequestProvider>
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerTintColor: '#087F5B',
          headerTitleStyle: {
            color: '#111827',
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
            title: 'Request summary',
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            title: 'Search',
            headerRight: () => <HeaderCartButton />,
          }}
        />
      </Stack>
    </RequestProvider>
  );
}

function HeaderCartButton() {
  const { itemCount } = useRequest();

  return (
    <Link href="/request" asChild>
      <Pressable
        style={{
          backgroundColor: '#E7F5EF',
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 9,
        }}
      >
        <Text
          style={{
            color: '#087F5B',
            fontWeight: '700',
          }}
        >
          {itemCount > 0 ? `Cart ${itemCount}` : 'Cart'}
        </Text>
      </Pressable>
    </Link>
  );
}
