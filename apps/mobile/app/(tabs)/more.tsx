import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSession } from '@/lib/session-context';

const colors = {
  brand: '#00A9A5',
  brandDark: '#007F7B',
  brandSoft: '#E6F8F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function MoreScreen() {
  const router = useRouter();
  const { customer, isLoggedIn, signOut } = useSession();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileBand}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={25} color={colors.brand} />
        </View>
        <View style={styles.profileTextBlock}>
          <Text style={styles.profileName}>{customer?.fullName ?? 'Guest customer'}</Text>
          <Text style={styles.profileMeta}>
            {isLoggedIn
              ? 'Manage your saved details and pharmacy orders'
              : 'Sign in to save addresses and view your order history'}
          </Text>
        </View>
        {isLoggedIn ? (
          <Pressable style={styles.signInButton}>
            <Text style={styles.signInText}>Edit</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.signInButton} onPress={() => router.push('/signin')}>
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>
        )}
      </View>

      {isLoggedIn ? (
        <MenuSection title="Account">
          <Link href="/addresses" asChild>
            <MenuRow icon="location-outline" label="Saved addresses" />
          </Link>
          <Link href="/(tabs)/orders" asChild>
            <MenuRow icon="receipt-outline" label="Order history" />
          </Link>
          <MenuRow icon="notifications-outline" label="Notifications" />
        </MenuSection>
      ) : null}

      <MenuSection title="Preferences">
        <MenuRow icon="language-outline" label="Language" value="English" />
      </MenuSection>

      <MenuSection title="Branches">
        <MenuRow
          icon="business-outline"
          label="Branches"
          onPress={() => router.push('/branches')}
        />
      </MenuSection>

      <MenuSection title="Help">
        <MenuRow
          icon="chatbubble-ellipses-outline"
          label="Customer support"
          onPress={() => router.push('/support')}
        />
        <MenuRow
          icon="shield-checkmark-outline"
          label="Privacy policy"
          onPress={() => router.push('/privacy')}
        />
        <MenuRow
          icon="information-circle-outline"
          label="About El Khabiry Pharmacy"
          onPress={() => router.push('/about')}
        />
      </MenuSection>

      {isLoggedIn ? (
        <Pressable style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={19} color="#9F1D1D" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

type MenuSectionProps = {
  children: ReactNode;
  title: string;
};

function MenuSection({ children, title }: MenuSectionProps) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuList}>{children}</View>
    </View>
  );
}

type MenuRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  value?: string;
};

function MenuRow({ icon, label, onPress, value }: MenuRowProps) {
  return (
    <Pressable style={styles.menuRow} disabled={!onPress} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={21} color={colors.brand} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      {onPress ? <Ionicons name="chevron-forward" size={19} color="#9CA3AF" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  profileBand: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  profileTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 11,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  signInText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  menuSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  menuList: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 13,
  },
  menuIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  menuLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 12,
  },
  menuValue: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    marginRight: 8,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 52,
    justifyContent: 'center',
  },
  signOutText: {
    color: '#9F1D1D',
    fontSize: 15,
    fontWeight: '800',
  },
});
