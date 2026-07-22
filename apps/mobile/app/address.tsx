import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { LoadingState } from '@/components/loading-state';
import {
  Address,
  AddressInput,
  createAddress,
  getAddress,
  updateAddress,
} from '@/lib/api';
import { useRequest } from '@/lib/request-context';

const colors = {
  brand: '#00b6bd',
  border: '#E5E7EB',
  muted: '#6B7280',
  page: '#F7F8FA',
  text: '#111827',
  white: '#FFFFFF',
};

export default function AddressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const addressId = typeof params.id === 'string' ? params.id : null;
  const { setCheckoutAddress } = useRequest();
  const [addressName, setAddressName] = useState('home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isDefault, setIsDefault] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(addressId));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canSave =
    fullName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    city.trim().length >= 2 &&
    area.trim().length >= 2 &&
    street.trim().length >= 2 &&
    building.trim().length >= 1;

  const fillForm = useCallback((address: Address) => {
    setAddressName(address.addressName);
    setFullName(address.fullName);
    setPhone(address.phone);
    setAdditionalPhone(address.additionalPhone ?? '');
    setCity(address.city);
    setArea(address.area);
    setStreet(address.street);
    setBuilding(address.building);
    setFloor(address.floor ?? '');
    setApartment(address.apartment ?? '');
    setLandmark(address.landmark ?? '');
    setIsDefault(address.isDefault);
  }, []);

  const loadAddress = useCallback(async (refreshing = false) => {
    if (!addressId) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      fillForm(await getAddress(addressId));
    } catch {
      setErrorMessage('Unable to load address. Check that the API is running.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addressId, fillForm]);

  useEffect(() => {
    void loadAddress();
  }, [loadAddress]);

  const saveAddress = async () => {
    if (!canSave) {
      setErrorMessage('Enter name, phone, city, area, street, and building.');
      return;
    }

    const address: AddressInput = {
      additionalPhone: additionalPhone.trim(),
      addressName: addressName.trim() || 'home',
      apartment: apartment.trim(),
      area: area.trim(),
      building: building.trim(),
      city: city.trim(),
      floor: floor.trim(),
      fullName: fullName.trim(),
      isDefault,
      landmark: landmark.trim(),
      phone: phone.trim(),
      street: street.trim(),
    };

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const savedAddress = addressId
        ? await updateAddress(addressId, address)
        : await createAddress(address);

      setCheckoutAddress(savedAddress);
      router.back();
    } catch {
      setErrorMessage('Unable to save address. Check that the API is running.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          colors={['#00b6bd']}
          enabled={Boolean(addressId)}
          refreshing={isRefreshing}
          tintColor="#00b6bd"
          onRefresh={() => {
            void loadAddress(true);
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>{addressId ? 'Edit address' : 'Add address'}</Text>

      {isLoading && !isRefreshing ? (
        <LoadingState />
      ) : null}

      <Pressable style={styles.mapButton}>
        <Ionicons name="locate-outline" size={22} color={colors.brand} />
        <Text style={styles.mapButtonText}>Select Location</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Address</Text>

      <TextInput
        style={styles.input}
        value={addressName}
        onChangeText={setAddressName}
        placeholder="Address name"
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Mobile number"
        placeholderTextColor="#8A8A8A"
      />
      <TextInput
        keyboardType="phone-pad"
        style={styles.input}
        value={additionalPhone}
        onChangeText={setAdditionalPhone}
        placeholder="Additional mobile number"
        placeholderTextColor="#8A8A8A"
      />
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor="#8A8A8A"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={area}
          onChangeText={setArea}
          placeholder="Area"
          placeholderTextColor="#8A8A8A"
        />
      </View>
      <TextInput
        style={styles.input}
        value={street}
        onChangeText={setStreet}
        placeholder="Street"
        placeholderTextColor="#8A8A8A"
      />
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={building}
          onChangeText={setBuilding}
          placeholder="Building"
          placeholderTextColor="#8A8A8A"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={floor}
          onChangeText={setFloor}
          placeholder="Floor"
          placeholderTextColor="#8A8A8A"
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={apartment}
          onChangeText={setApartment}
          placeholder="Apartment"
          placeholderTextColor="#8A8A8A"
        />
        <TextInput
          style={[styles.input, styles.inputHalf]}
          value={landmark}
          onChangeText={setLandmark}
          placeholder="Landmark"
          placeholderTextColor="#8A8A8A"
        />
      </View>

      <Pressable style={styles.defaultRow} onPress={() => setIsDefault((current) => !current)}>
        <View style={isDefault ? styles.checkboxActive : styles.checkbox}>
          {isDefault ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
        </View>
        <Text style={styles.defaultText}>Set As Default Address</Text>
      </Pressable>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Pressable
        style={canSave && !isSaving ? styles.saveButton : styles.disabledButton}
        disabled={!canSave || isSaving}
        onPress={saveAddress}
      >
        <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Address'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 34,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  mapButton: {
    alignItems: 'center',
    backgroundColor: '#EEF6F7',
    borderRadius: 14,
    flexDirection: 'row',
    height: 84,
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapButtonText: {
    color: colors.brand,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  input: {
    borderColor: '#0F4C68',
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    height: 58,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  defaultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 48,
    marginBottom: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9CA3AF',
    borderRadius: 5,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  checkboxActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    borderRadius: 5,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  defaultText: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  errorText: {
    color: '#7F1D1D',
    fontSize: 13,
    lineHeight: 19,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
