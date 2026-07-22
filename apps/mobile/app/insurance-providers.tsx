import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { InsuranceProvider, getInsuranceProviders, resolveImageUrl } from '@/lib/api';

const colors = {
  brand: '#00b6bd',
  border: '#E5E7EB',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function InsuranceProvidersScreen() {
  const router = useRouter();
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProviders = useCallback(async () => {
    setIsLoading(true);

    try {
      setProviders(await getInsuranceProviders());
    } catch {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Insurance providers</Text>

      {isLoading ? <Text style={styles.stateText}>Loading providers</Text> : null}

      <View style={styles.providerGrid}>
        {providers.map((provider) => (
          <Pressable
            accessibilityLabel={`Add ${provider.name} insurance card`}
            key={provider.name}
            style={styles.providerCard}
            onPress={() => {
              router.push({
                pathname: '/insurance',
                params: {
                  provider: provider.name,
                },
              });
            }}
          >
            {resolveImageUrl(provider.logoUrl) ? (
              <Image
                source={{ uri: resolveImageUrl(provider.logoUrl) ?? undefined }}
                resizeMode="contain"
                style={styles.providerLogo}
              />
            ) : (
              <Text style={styles.providerFallback}>{provider.name}</Text>
            )}
            <View style={styles.addBadge}>
              <Ionicons name="add" size={17} color={colors.brand} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 92,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 14,
    width: '48%',
  },
  providerLogo: {
    height: 48,
    width: '100%',
  },
  providerFallback: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  stateText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },
  addBadge: {
    alignItems: 'center',
    backgroundColor: '#E6F8F7',
    borderRadius: 13,
    bottom: 8,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    width: 26,
  },
});
