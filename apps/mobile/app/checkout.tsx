import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createOrder, getAddresses } from '@/lib/api';
import { OrderSuccessScreen } from '@/components/order-success-screen';
import { CheckoutAddress, formatPiasters, useRequest } from '@/lib/request-context';

type FulfillmentMethod = 'delivery' | 'pickup';
type PaymentMethod = 'online' | 'cash' | 'card_on_delivery';

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

const pickupBranches = ['Maadi branch', 'New Cairo branch', 'Nasr City branch'];

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    checkoutAddress,
    clearProducts,
    itemCount,
    items,
    setCheckoutAddress,
    totalPiasters,
  } = useRequest();
  const [method, setMethod] = useState<FulfillmentMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const availableSlots = useMemo(() => getAvailableTimeSlots(selectedDate), [selectedDate]);
  const [selectedSlot, setSelectedSlot] = useState(getAvailableTimeSlots(new Date())[0] ?? 'Now');
  const [selectedBranch, setSelectedBranch] = useState(pickupBranches[0]);
  const [confirmByCall, setConfirmByCall] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);
  const deliveryFeePiasters = 0;
  const payableTotalPiasters = totalPiasters + deliveryFeePiasters;
  const hasDestination = method === 'delivery' ? Boolean(checkoutAddress) : selectedBranch.length > 0;
  const canSubmit = items.length > 0 && hasDestination && acceptedTerms && !isSubmitting;
  const destinationText = method === 'delivery' && checkoutAddress
    ? formatAddress(checkoutAddress)
    : selectedBranch;
  const customer = checkoutAddress
    ? {
        address: method === 'delivery' ? formatAddress(checkoutAddress) : selectedBranch,
        name: checkoutAddress.fullName,
        phone: checkoutAddress.phone,
      }
    : {
        address: selectedBranch,
        name: 'Pickup customer',
        phone: '01000000000',
      };
  const notes = useMemo(() => {
    const parts = [
      `Destination: ${destinationText}`,
    ];

    if (checkoutAddress?.additionalPhone) {
      parts.push(`Additional phone: ${checkoutAddress.additionalPhone}`);
    }

    if (confirmByCall) {
      parts.push('Customer requested a confirmation call');
    }

    if (notesText.trim()) {
      parts.push(`Notes: ${notesText.trim()}`);
    }

    return parts.join('\n');
  }, [checkoutAddress, confirmByCall, destinationText, notesText]);

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
        // The checkout screen already asks the user to add an address if none is available.
      }
    };

    void loadDefaultAddress();
  }, [checkoutAddress, setCheckoutAddress]);

  const changeDate = (_event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);

    if (date) {
      setSelectedDate(date);
      setSelectedSlot(getAvailableTimeSlots(date)[0] ?? 'No slots');
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
        !hasDestination
          ? 'Add a delivery address before confirming the order.'
          : 'Accept the terms and refund policy before confirming the order.',
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const order = await createOrder({
        type: 'PRODUCT_ORDER',
        customer,
        items: items.map((item) => ({
          productId: item.product.id,
          productUnitId: item.unit.id,
          quantity: item.quantity,
        })),
        prescriptionUploadIds: [],
        checkout: {
          confirmByCall,
          deliveryDate: formatSelectedDate(selectedDate),
          deliveryFeePiasters,
          deliveryTimeSlot: selectedSlot,
          fulfillmentMethod: method === 'delivery' ? 'DELIVERY' : 'PICKUP',
          paymentMethod: toApiPaymentMethod(paymentMethod),
        },
        notes,
      });

      clearProducts();
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
        message="Your order was placed successfully. The pharmacy will review it and update the order status."
        primaryLabel="Track order"
        secondaryLabel="Continue shopping"
        title="Order placed"
        onPrimaryPress={trackSubmittedOrder}
        onSecondaryPress={() => router.replace('/categories')}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No items to checkout</Text>
          <Text style={styles.emptyText}>Add products to your cart before placing an order.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/categories')}>
            <Text style={styles.primaryButtonText}>Browse products</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <CheckoutSection title="Order summary">
            <SummaryRow label="Delivery Date" value={formatSelectedDate(selectedDate)} />
            <SummaryRow label="Delivery Time" value={selectedSlot} />
            <SummaryRow label="Order Items" value={`${itemCount} item${itemCount === 1 ? '' : 's'}`} />
            <SummaryRow label="Subtotal" value={formatPiasters(totalPiasters)} />
            <SummaryRow label="Delivery fees" value="0 EGP" />
            <View style={styles.summaryDivider} />
            <SummaryRow label="Total" value={formatPiasters(payableTotalPiasters)} strong />
          </CheckoutSection>

          <View style={styles.segmentedControl}>
            <SegmentButton
              active={method === 'delivery'}
              icon="home-outline"
              label="Delivery"
              onPress={() => setMethod('delivery')}
            />
            <SegmentButton
              active={method === 'pickup'}
              icon="storefront-outline"
              label="Pickup"
              onPress={() => setMethod('pickup')}
            />
          </View>

          {method === 'delivery' ? (
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
          ) : (
            <CheckoutSection title="Pickup branch">
              <View style={styles.slotGrid}>
                {pickupBranches.map((branch) => (
                  <Pressable
                    key={branch}
                    style={selectedBranch === branch ? styles.slotActive : styles.slot}
                    onPress={() => setSelectedBranch(branch)}
                  >
                    <Text style={selectedBranch === branch ? styles.slotTextActive : styles.slotText}>
                      {branch}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </CheckoutSection>
          )}

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

          <Pressable
            style={styles.optionCard}
            onPress={() => setConfirmByCall((current) => !current)}
          >
            <Ionicons name="person-circle-outline" size={27} color="#9CA3AF" />
            <Text style={styles.optionCardText}>Confirm order with call</Text>
            <View style={confirmByCall ? styles.checkboxActive : styles.checkbox}>
              {confirmByCall ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
            </View>
          </Pressable>

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

          <Text style={styles.paymentTitle}>Payment Type</Text>
          <Pressable
            style={styles.termsRow}
            onPress={() => setAcceptedTerms((current) => !current)}
          >
            <View style={acceptedTerms ? styles.checkboxActive : styles.checkbox}>
              {acceptedTerms ? <Ionicons name="checkmark" size={15} color={colors.white} /> : null}
            </View>
            <Text style={styles.termsText}>I accept terms and conditions & refund policy</Text>
          </Pressable>

          <PaymentOption
            active={paymentMethod === 'online'}
            disabled
            icon="card-outline"
            label="Online Payment"
            onPress={() => setPaymentMethod('online')}
          />
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
              {isSubmitting ? 'Submitting...' : 'Confirm order'}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
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

type SegmentButtonProps = {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function SegmentButton({ active, icon, label, onPress }: SegmentButtonProps) {
  return (
    <Pressable style={active ? styles.segmentActive : styles.segment} onPress={onPress}>
      <Ionicons name={icon} size={17} color={active ? colors.white : colors.brand} />
      <Text style={active ? styles.segmentTextActive : styles.segmentText}>{label}</Text>
    </Pressable>
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

type PaymentOptionProps = {
  active: boolean;
  disabled?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function PaymentOption({
  active,
  disabled = false,
  icon,
  label,
  onPress,
}: PaymentOptionProps) {
  return (
    <Pressable
      style={disabled ? styles.paymentOptionDisabled : styles.paymentOption}
      disabled={disabled}
      onPress={onPress}
    >
      <Ionicons name={icon} size={25} color={disabled ? '#A7AAB2' : colors.brand} />
      <Text style={disabled ? styles.paymentOptionTextDisabled : styles.paymentOptionText}>
        {label}
      </Text>
      {active ? <Ionicons name="checkmark-circle" size={19} color={colors.brand} /> : null}
    </Pressable>
  );
}

type SummaryRowProps = {
  label: string;
  strong?: boolean;
  value: string;
};

function SummaryRow({ label, strong = false, value }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <Text style={strong ? styles.summaryLabelStrong : styles.summaryLabel}>{label}</Text>
      <Text style={strong ? styles.summaryValueStrong : styles.summaryValue}>{value}</Text>
    </View>
  );
}

function toApiPaymentMethod(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'online') {
    return 'ONLINE';
  }

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
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
    textAlign: 'center',
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
    marginBottom: 13,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  summaryLabel: {
    color: '#8B9098',
    fontSize: 15,
    fontWeight: '700',
  },
  summaryValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  summaryLabelStrong: {
    color: '#8B9098',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryValueStrong: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  summaryDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginBottom: 10,
    marginTop: 2,
  },
  segmentedControl: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    padding: 5,
  },
  segment: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'center',
  },
  segmentActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'center',
  },
  segmentText: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
  },
  segmentTextActive: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 7,
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
  slotGrid: {
    gap: 9,
  },
  slot: {
    backgroundColor: colors.page,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  slotActive: {
    backgroundColor: colors.brandSoft,
    borderColor: colors.brand,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  slotText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  slotTextActive: {
    color: colors.brandDark,
    fontSize: 13,
    fontWeight: '800',
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
  termsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
    minHeight: 42,
  },
  termsText: {
    color: colors.brand,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginLeft: 12,
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
  paymentOptionDisabled: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 60,
    marginBottom: 10,
    opacity: 0.62,
    paddingHorizontal: 14,
  },
  paymentOptionText: {
    color: colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 12,
  },
  paymentOptionTextDisabled: {
    color: '#8B9098',
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 12,
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
