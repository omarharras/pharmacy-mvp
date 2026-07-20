import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Address, AddressInput, getAddresses, updateAddress } from '@/lib/api';
import { useRequest } from '@/lib/request-context';

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

export default function AddressesScreen() {
  const { checkoutAddress, setCheckoutAddress } = useRequest();
  const checkoutAddressRef = useRef(checkoutAddress);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingDefaultId, setUpdatingDefaultId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  checkoutAddressRef.current = checkoutAddress;

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const savedAddresses = await getAddresses();
      setAddresses(savedAddresses);

      const defaultAddress = savedAddresses.find((address) => address.isDefault) ?? savedAddresses[0];
      if (!checkoutAddressRef.current && defaultAddress) {
        setCheckoutAddress(defaultAddress);
      }
    } catch {
      setErrorMessage('Unable to load addresses. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [setCheckoutAddress]);

  useFocusEffect(
    useCallback(() => {
      void loadAddresses();
    }, [loadAddresses]),
  );

  const setDefaultAddress = async (address: Address) => {
    setUpdatingDefaultId(address.id);
    setErrorMessage(null);

    try {
      const updatedAddress = await updateAddress(address.id, toAddressInput(address, true));
      setAddresses((currentAddresses) =>
        currentAddresses.map((currentAddress) => ({
          ...currentAddress,
          isDefault: currentAddress.id === updatedAddress.id,
        })),
      );
      setCheckoutAddress(updatedAddress);
    } catch {
      setErrorMessage('Unable to update default address. Check that the API is running.');
    } finally {
      setUpdatingDefaultId(null);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading addresses</Text>
          <Text style={styles.stateText}>Getting your saved delivery addresses.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadAddresses}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !errorMessage && addresses.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="location-outline" size={31} color={colors.brand} />
          </View>
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <Text style={styles.emptyText}>Add an address to use it during product and prescription checkout.</Text>
        </View>
      ) : null}

      {addresses.map((address) => {
        return (
          <View
            key={address.id}
            style={address.isDefault ? styles.addressCardSelected : styles.addressCard}
          >
            <View style={styles.addressTopRow}>
              <View style={styles.addressIcon}>
                <Ionicons name="location-outline" size={23} color={colors.brand} />
              </View>
              <View style={styles.addressTitleBlock}>
                <Text style={styles.addressName}>{address.addressName}</Text>
                {address.isDefault ? <Text style={styles.defaultBadge}>Default address</Text> : null}
              </View>
              {!address.isDefault ? (
                <Pressable
                  disabled={updatingDefaultId === address.id}
                  onPress={() => setDefaultAddress(address)}
                >
                  <Text style={styles.defaultActionText}>
                    {updatingDefaultId === address.id ? 'Updating' : 'Set default'}
                  </Text>
                </Pressable>
              ) : null}
              <Link
                href={{
                  pathname: '/address',
                  params: {
                    id: address.id,
                  },
                }}
                asChild
              >
                <Pressable>
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </Link>
            </View>

            <Text style={styles.addressText}>{formatAddress(address)}</Text>
            <Text style={styles.phoneText}>{address.phone}</Text>
          </View>
        );
      })}

      <Link href="/address" asChild>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={22} color={colors.white} />
          <Text style={styles.addButtonText}>Add address</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function formatAddress(address: Address) {
  return [
    address.street,
    address.building ? `Building ${address.building}` : '',
    address.floor ? `Floor ${address.floor}` : '',
    address.apartment ? `Apt ${address.apartment}` : '',
    address.area,
    address.city,
    address.landmark ? `near ${address.landmark}` : '',
  ].filter(Boolean).join(', ');
}

function toAddressInput(address: Address, isDefault: boolean): AddressInput {
  return {
    additionalPhone: address.additionalPhone ?? '',
    addressName: address.addressName,
    apartment: address.apartment ?? '',
    area: address.area,
    building: address.building,
    city: address.city,
    floor: address.floor ?? '',
    fullName: address.fullName,
    isDefault,
    landmark: address.landmark ?? '',
    phone: address.phone,
    street: address.street,
  };
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
  addressCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  addressCardSelected: {
    backgroundColor: colors.white,
    borderColor: colors.brand,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  addressTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 12,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  addressTitleBlock: {
    flex: 1,
    marginLeft: 12,
  },
  addressName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  defaultBadge: {
    color: colors.brand,
    fontSize: 12,
    fontWeight: '800',
  },
  editText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '800',
  },
  defaultActionText: {
    color: colors.brandDark,
    fontSize: 13,
    fontWeight: '800',
    marginRight: 14,
  },
  addressText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 2,
  },
  phoneText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 24,
  },
  stateCard: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  stateText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  errorCard: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 16,
    borderWidth: 1,
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
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 25,
    height: 58,
    justifyContent: 'center',
    marginBottom: 14,
    width: 58,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 7,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 7,
  },
});
