import { Stack } from 'expo-router';

export default function CategoriesLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Categories' }} />
      <Stack.Screen name="products" options={{ title: 'Products' }} />
    </Stack>
  );
}
