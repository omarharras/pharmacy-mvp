import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createOrder, getAddresses, uploadPrescription } from '@/lib/api';
import { OrderSuccessScreen } from '@/components/order-success-screen';
import { CheckoutAddress, useRequest } from '@/lib/request-context';

type PaymentMethod = 'cash' | 'card_on_delivery';

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

const timeSlotsFallback = ['13:30 - 14:00', '16:00 - 16:30', '18:00 - 20:00'];

export default function PrescriptionCheckoutScreen() {
  const router = useRouter();
  const {
    addPrescription,
    checkoutAddress,
    clearPrescriptions,
    prescriptions,
    removePrescription,
    setCheckoutAddress,
  } = useRequest();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const availableSlots = useMemo(() => getAvailableTimeSlots(selectedDate), [selectedDate]);
  const [selectedSlot, setSelectedSlot] = useState(
    getAvailableTimeSlots(new Date())[0] ?? timeSlotsFallback[0],
  );
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [confirmByCall, setConfirmByCall] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notesText, setNotesText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const canSubmit =
    prescriptions.length > 0 &&
    Boolean(checkoutAddress) &&
    !isUploading &&
    !isSubmitting;
  const notes = useMemo(() => {
    const parts = [
      'Prescription pricing: Pending pharmacist review',
    ];

    if (checkoutAddress) {
      parts.push(`Address: ${formatAddress(checkoutAddress)}`);
      if (checkoutAddress.additionalPhone) {
        parts.push(`Additional phone: ${checkoutAddress.additionalPhone}`);
      }
    }

    if (confirmByCall) {
      parts.push('Customer requested a confirmation call');
    }

    if (notesText.trim()) {
      parts.push(`Notes: ${notesText.trim()}`);
    }

    return parts.join('\n');
  }, [checkoutAddress, confirmByCall, notesText]);

  useEffect(() => {
    if (checkoutAddress) {
      return;
    }

    const loadDefaultAddress = async () => {
      try {
        const addresses = await getAddresses();
        const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];

        if (defaultAddress) {
          setCheckoutAddress(defaultAddress);
        }
      } catch {
        // The prescription checkout still prompts for an address if none can be loaded.
      }
    };

    void loadDefaultAddress();
  }, [checkoutAddress, setCheckoutAddress]);

  const pickPrescription = async () => {
    setErrorMessage(null);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Photo library access is required to upload a prescription.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!asset) {
      return;
    }

    setIsUploading(true);

    try {
      const uploadedPrescription = await uploadPrescription({
        name: asset.fileName ?? `prescription-${Date.now()}.jpg`,
        type: asset.mimeType ?? 'image/jpeg',
        uri: asset.uri,
      });

      addPrescription({
        ...uploadedPrescription,
        localUri: asset.uri,
      });
    } catch {
      setErrorMessage('Unable to upload prescription. Check that the API is running.');
    } finally {
      setIsUploading(false);
    }
  };

  const changeDate = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);

    if (date) {
      setSelectedDate(date);
      setSelectedSlot(getAvailableTimeSlots(date)[0] ?? timeSlotsFallback[0]);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        minimumDate: new Date(),
        mode: 'date',
        onChange: changeDate,
        value: selectedDate,
      });
      return;
    }

    setShowDatePicker(true);
  };

  const submit = async () => {
    if (!canSubmit) {
      setErrorMessage(
        prescriptions.length === 0
          ? 'Upload a prescription image before sending.'
          : 'Add a delivery address before sending your prescription.',
      );
      return;
    }

    if (!checkoutAddress) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const order = await createOrder({
        type: 'PRESCRIPTION_REQUEST',
        customer: {
          address: formatAddress(checkoutAddress),
          name: checkoutAddress.fullName,
          phone: checkoutAddress.phone,
        },
        items: [],
        prescriptionUploadIds: prescriptions.map((prescription) => prescription.id),
        checkout: {
          confirmByCall,
          deliveryDate: formatSelectedDate(selectedDate),
          deliveryFeePiasters: 0,
          deliveryTimeSlot: selectedSlot,
          fulfillmentMethod: 'DELIVERY',
          paymentMethod: toApiPaymentMethod(paymentMethod),
        },
        notes,
      });

      clearPrescriptions();
      setSubmittedOrderId(order.id);
    } catch {
      setErrorMessage('Unable to submit. Check that the API is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrderId) {
    const trackSubmittedOrder = () => {
      router.dismissTo('/(tabs)/orders');
      requestAnimationFrame(() => {
        router.push({
          pathname: '/orders/[id]',
          params: { id: submittedOrderId },
        });
      });
    };

    return (
      <OrderSuccessScreen
        message="Your prescription was sent successfully. The pharmacy will review it and contact you with price and availability."
        primaryLabel="Track request"
        secondaryLabel="Back to home"
        title="Prescription sent"
        onPrimaryPress={trackSubmittedOrder}
        onSecondaryPress={() => router.replace('/(tabs)/(home)')}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <CheckoutSection title="Prescription image">
        <Text style={styles.helperText}>
          Upload a clear photo. Pricing will be confirmed after pharmacist review.
        </Text>
        <Pressable style={styles.uploadButton} disabled={isUploading} onPress={pickPrescription}>
          <Ionicons name="cloud-upload-outline" size={20} color={colors.white} />
          <Text style={styles.uploadButtonText}>{isUploading ? 'Uploading...' : 'Choose image'}</Text>
        </Pressable>
      </CheckoutSection>

      {prescriptions.map((prescription) => (
        <View key={prescription.id} style={styles.prescriptionCard}>
          <Image source={{ uri: prescription.localUri }} style={styles.prescriptionImage} />
          <View style={styles.prescriptionDetails}>
            <Text style={styles.prescriptionName} numberOfLines={1}>
              {prescription.originalName}
            </Text>
            <Text style={styles.prescriptionMeta}>
              {Math.max(1, Math.round(prescription.sizeBytes / 1024))} KB uploaded
            </Text>
          </View>
          <Pressable onPress={() => removePrescription(prescription.id)}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      ))}

      <CheckoutSection title="Delivery to">
        {checkoutAddress ? (
          <View style={styles.destinationCard}>
            <Ionicons name="location" size={25} color={colors.brand} />
            <View style={styles.destinationTextBlock}>
              <Text style={styles.destinationName}>{checkoutAddress.addressName}</Text>
              <Text style={styles.destinationText}>{checkoutAddress.phone}</Text>
              <Text style={styles.destinationText}>{formatAddress(checkoutAddress)}</Text>
            </View>
            <Link href="/addresses" asChild>
              <Pressable>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <Link href="/address" asChild>
            <Pressable style={styles.addAddressButton}>
              <Ionicons name="add" size={21} color={colors.brand} />
              <Text style={styles.addAddressText}>Complete Address</Text>
            </Pressable>
          </Link>
        )}
      </CheckoutSection>

      <CheckoutSection title="Choose delivery date">
        <View style={styles.dateTimeRow}>
          <Pressable style={styles.dateTimeButton} onPress={openDatePicker}>
            <View>
              <Text style={styles.datePickerLabel}>{dateDayLabel(selectedDate)}</Text>
              <Text style={styles.datePickerValue}>{formatSelectedDate(selectedDate)}</Text>
            </View>
            <Ionicons name="calendar-outline" size={22} color={colors.brand} />
          </Pressable>

          <Pressable
            style={styles.dateTimeButton}
            onPress={() => setShowTimeSlots((current) => !current)}
          >
            <View>
              <Text style={styles.datePickerLabel}>Select time</Text>
              <Text style={styles.datePickerValue}>{selectedSlot}</Text>
            </View>
            <Ionicons name="time-outline" size={22} color={colors.brand} />
          </Pressable>
        </View>

        {showDatePicker && Platform.OS !== 'android' ? (
          <DateTimePicker
            accentColor={colors.brand}
            mode="date"
            minimumDate={new Date()}
            value={selectedDate}
            onChange={changeDate}
          />
        ) : null}
      </CheckoutSection>

      <Pressable style={styles.optionCard} onPress={() => setConfirmByCall((current) => !current)}>
        <Ionicons name="person-circle-outline" size={27} color="#9CA3AF" />
        <Text style={styles.optionCardText}>Confirm order with call</Text>
        <View style={confirmByCall ? styles.checkboxActive : styles.checkbox}>
          {confirmByCall ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
        </View>
      </Pressable>

      <Pressable style={styles.optionCard}>
        <Ionicons name="shield-checkmark-outline" size={27} color={colors.brand} />
        <Text style={styles.optionCardText}>Select insurance</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      <Text style={styles.paymentTitle}>Payment Type</Text>
      <PaymentOption
        active={paymentMethod === 'cash'}
        icon="cash-outline"
        label="Cash On Delivery"
        onPress={() => setPaymentMethod('cash')}
      />
      <PaymentOption
        active={paymentMethod === 'card_on_delivery'}
        icon="card-outline"
        label="Visa On Delivery"
        onPress={() => setPaymentMethod('card_on_delivery')}
      />

      <CheckoutSection title="Additional Note">
        <TextInput
          multiline
          style={styles.notesInput}
          value={notesText}
          onChangeText={setNotesText}
          placeholder="note:"
          placeholderTextColor="#8A8A8A"
        />
      </CheckoutSection>

      <View style={styles.reviewCard}>
        <Ionicons name="time-outline" size={22} color={colors.brand} />
        <Text style={styles.reviewText}>
          No payment is collected now. The pharmacy will contact you after review.
        </Text>
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <Pressable
        style={canSubmit ? styles.primaryButton : styles.disabledButton}
        disabled={!canSubmit}
        onPress={submit}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmitting ? 'Submitting...' : 'Send prescription'}
        </Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={showTimeSlots}
        onRequestClose={() => setShowTimeSlots(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowTimeSlots(false)}>
          <Pressable style={styles.timeModal}>
            <View style={styles.timeModalHeader}>
              <Text style={styles.timeModalTitle}>Select time</Text>
              <Pressable onPress={() => setShowTimeSlots(false)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {availableSlots.map((slot) => (
                <Pressable
                  key={slot}
                  style={selectedSlot === slot ? styles.timeModalSlotActive : styles.timeModalSlot}
                  onPress={() => {
                    setSelectedSlot(slot);
                    setShowTimeSlots(false);
                  }}
                >
                  <Text
                    style={
                      selectedSlot === slot
                        ? styles.timeModalSlotTextActive
                        : styles.timeModalSlotText
                    }
                  >
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

type CheckoutSectionProps = {
  children: ReactNode;
  title: string;
};

function CheckoutSection({ children, title }: CheckoutSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function formatAddress(address: CheckoutAddress) {
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

function formatSelectedDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function dateDayLabel(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDate(date, today)) {
    return 'Today';
  }

  if (isSameDate(date, tomorrow)) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function isSameDate(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getAvailableTimeSlots(date: Date) {
  const slots: string[] = [];
  const cursor = new Date(date);
  const now = new Date();

  if (isSameDate(date, now)) {
    cursor.setHours(now.getHours(), now.getMinutes(), 0, 0);
    roundUpToNextHalfHour(cursor);
  } else {
    cursor.setHours(9, 0, 0, 0);
  }

  const end = new Date(date);
  end.setHours(23, 30, 0, 0);

  while (cursor <= end) {
    const slotEnd = new Date(cursor);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    slots.push(`${formatTime(cursor)} - ${formatTime(slotEnd)}`);
    cursor.setMinutes(cursor.getMinutes() + 30);
  }

  return slots;
}

function roundUpToNextHalfHour(date: Date) {
  const minutes = date.getMinutes();

  if (minutes === 0 || minutes === 30) {
    return;
  }

  date.setMinutes(minutes < 30 ? 30 : 60, 0, 0);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  });
}

type PaymentOptionProps = {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function PaymentOption({ active, icon, label, onPress }: PaymentOptionProps) {
  return (
    <Pressable style={styles.paymentOption} onPress={onPress}>
      <Ionicons name={icon} size={25} color={colors.brand} />
      <Text style={styles.paymentOptionText}>{label}</Text>
      {active ? <Ionicons name="checkmark-circle" size={19} color={colors.brand} /> : null}
    </Pressable>
  );
}

function toApiPaymentMethod(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'card_on_delivery') {
    return 'CARD_ON_DELIVERY';
  }

  return 'CASH_ON_DELIVERY';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  helperText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 12,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  prescriptionCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
  },
  prescriptionImage: {
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    height: 56,
    width: 56,
  },
  prescriptionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  prescriptionName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  prescriptionMeta: {
    color: colors.muted,
    fontSize: 12,
  },
  removeText: {
    color: '#9F1D1D',
    fontSize: 13,
    fontWeight: '800',
  },
  destinationCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 13,
  },
  destinationTextBlock: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  destinationName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 5,
  },
  destinationText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  changeText: {
    color: colors.brand,
    fontSize: 13,
    fontWeight: '800',
  },
  addAddressButton: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
  },
  addAddressText: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateTimeButton: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  datePickerLabel: {
    color: colors.brandDark,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  datePickerValue: {
    color: colors.brandDark,
    fontSize: 16,
    fontWeight: '800',
  },
  optionCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 62,
    paddingHorizontal: 14,
  },
  optionCardText: {
    color: '#8B9098',
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#9CA3AF',
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    borderRadius: 4,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  notesInput: {
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    height: 94,
    paddingHorizontal: 14,
    paddingTop: 13,
    textAlignVertical: 'top',
  },
  paymentTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    marginTop: 4,
  },
  paymentOption: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 60,
    marginBottom: 10,
    paddingHorizontal: 14,
  },
  paymentOptionText: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 12,
  },
  reviewCard: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderColor: '#BCEDEA',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
  },
  reviewText: {
    color: colors.brandDark,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
    marginLeft: 10,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(17,24,39,0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  timeModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '68%',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  timeModalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeModalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  timeModalSlot: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  timeModalSlotActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  timeModalSlotText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  timeModalSlotTextActive: {
    color: colors.brandDark,
    fontSize: 15,
    fontWeight: '800',
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
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  disabledButton: {
    alignItems: 'center',
    backgroundColor: '#9CA3AF',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    marginTop: 6,
  },
});
