import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AuthRequiredModal } from '@/components/auth-required-modal';
import { LoadingState } from '@/components/loading-state';
import { ProductCard } from '@/components/product-card';
import { useFavorites } from '@/lib/favorites-context';
import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00b6bd',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, isLoadingFavorites, loadFavorites } = useFavorites();
  const { isLoggedIn, isRestoringSession } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshFavorites = useCallback(async (refreshing = false) => {
    if (!isLoggedIn) {
      setErrorMessage(null);
      return;
    }

    if (refreshing) {
      setIsRefreshing(true);
    }

    setErrorMessage(null);

    try {
      await loadFavorites();
    } catch {
      setErrorMessage('Unable to load favorites. Check that the API is running.');
    } finally {
      setIsRefreshing(false);
    }
  }, [isLoggedIn, loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      if (!isRestoringSession && !isLoggedIn) {
        setShowAuthPrompt(true);
      }

      void refreshFavorites();
    }, [isLoggedIn, isRestoringSession, refreshFavorites]),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          colors={[colors.brand]}
          refreshing={isRefreshing}
          tintColor={colors.brand}
          onRefresh={() => {
            void refreshFavorites(true);
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Favorites</Text>

      {!isLoggedIn && !isRestoringSession ? (
        <View style={styles.stateBox}>
          <View style={styles.stateIcon}>
            <Ionicons name="heart-outline" size={31} color={colors.brand} />
          </View>
          <Text style={styles.stateTitle}>Sign in to save favorites</Text>
          <Text style={styles.stateText}>Keep frequently ordered pharmacy products ready for quick checkout.</Text>
          <Pressable style={styles.primaryButton} onPress={() => setShowAuthPrompt(true)}>
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </Pressable>
        </View>
      ) : null}

      {isLoggedIn && isLoadingFavorites && !isRefreshing ? <LoadingState /> : null}

      {isLoggedIn && errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              void refreshFavorites();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {isLoggedIn && !isLoadingFavorites && !errorMessage && favorites.length === 0 ? (
        <View style={styles.stateBox}>
          <View style={styles.stateIcon}>
            <Ionicons name="heart-outline" size={31} color={colors.brand} />
          </View>
          <Text style={styles.stateTitle}>No favorite products</Text>
          <Text style={styles.stateText}>Tap the heart on any product to keep it here.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/categories')}>
            <Ionicons name="bag-outline" size={18} color={colors.white} />
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : null}

      {isLoggedIn && favorites.length > 0 ? (
        <View style={styles.productGrid}>
          {favorites.map((favorite) => (
            <ProductCard key={favorite.productId} product={favorite.product} />
          ))}
        </View>
      ) : null}

      <AuthRequiredModal
        returnTo="/favorites"
        visible={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 32,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stateBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 6,
    padding: 24,
  },
  stateIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 29,
    height: 58,
    justifyContent: 'center',
    marginBottom: 14,
    width: 58,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 7,
    textAlign: 'center',
  },
  stateText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
    borderWidth: 1,
    marginHorizontal: 6,
    marginBottom: 14,
    padding: 16,
  },
  errorTitle: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#9F1D1D',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: '800',
  },
});
