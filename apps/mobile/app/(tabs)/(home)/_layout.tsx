import { Link, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useRequest } from '@/lib/request-context';

export default function HomeLayout() {
  return (
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
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => <HeaderCartButton />,
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

function HeaderCartButton() {
  const { itemCount } = useRequest();

  return (
    <Link href="/request" asChild>
      <Pressable
        style={{
          backgroundColor: '#E7F5EF',
          borderRadius: 12,
          marginRight: 16,
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
