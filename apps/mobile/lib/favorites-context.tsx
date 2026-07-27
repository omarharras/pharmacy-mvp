import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  FavoriteProduct,
  Product,
  addFavorite,
  getFavorites,
  removeFavorite,
} from './api';
import { useSession } from './session-context';

type FavoritesContextValue = {
  favoriteProductIds: Set<string>;
  favorites: FavoriteProduct[];
  isFavorite: (productId: string) => boolean;
  isLoadingFavorites: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (product: Product) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { token } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  const favoriteProductIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.productId)),
    [favorites],
  );

  const loadFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      setIsLoadingFavorites(false);
      return;
    }

    setIsLoadingFavorites(true);

    try {
      setFavorites(await getFavorites(token));
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [token]);

  useEffect(() => {
    void loadFavorites();
  }, [loadFavorites]);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteProductIds,
      favorites,
      isFavorite: (productId) => favoriteProductIds.has(productId),
      isLoadingFavorites,
      loadFavorites,
      toggleFavorite: async (product) => {
        if (!token) {
          throw new Error('Authentication required');
        }

        if (favoriteProductIds.has(product.id)) {
          const previousFavorites = favorites;

          setFavorites((currentFavorites) =>
            currentFavorites.filter((favorite) => favorite.productId !== product.id),
          );

          try {
            await removeFavorite(product.id, token);
          } catch (error) {
            setFavorites(previousFavorites);
            throw error;
          }

          return;
        }

        const previousFavorites = favorites;
        const optimisticFavorite: FavoriteProduct = {
          createdAt: new Date().toISOString(),
          id: `pending-${product.id}`,
          product,
          productId: product.id,
        };

        setFavorites((currentFavorites) => [optimisticFavorite, ...currentFavorites]);

        try {
          await addFavorite(product.id, token);
          await loadFavorites();
        } catch (error) {
          setFavorites(previousFavorites);
          throw error;
        }
      },
    }),
    [favoriteProductIds, favorites, isLoadingFavorites, loadFavorites, token],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }

  return context;
}
