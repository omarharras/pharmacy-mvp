import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useRequest } from '@/lib/request-context';

type HeaderCartButtonProps = {
  colorScheme?: 'light' | 'brand';
};

export function HeaderCartButton({ colorScheme = 'light' }: HeaderCartButtonProps) {
  const { itemCount } = useRequest();
  const isLight = colorScheme === 'light';

  return (
    <Link href="/cart" asChild>
      <Pressable style={styles.hitArea}>
        <View style={isLight ? styles.lightButton : styles.brandButton}>
          <Ionicons
            name="cart-outline"
            size={22}
            color={isLight ? '#00A9A5' : '#FFFFFF'}
          />
        </View>
        {itemCount > 0 ? (
          <View style={isLight ? styles.lightBadge : styles.brandBadge}>
            <Text style={styles.badgeText}>{itemCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  hitArea: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',
    marginRight: 8,
    position: 'relative',
    width: 52,
  },
  lightButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  brandButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  lightBadge: {
    alignItems: 'center',
    backgroundColor: '#007F7B',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  brandBadge: {
    alignItems: 'center',
    backgroundColor: '#007F7B',
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
  },
});
