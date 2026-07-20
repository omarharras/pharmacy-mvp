import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Order, getOrder, resolveImageUrl } from '@/lib/api';
import { formatPiasters } from '@/lib/request-context';

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

const statusCopy: Record<Order['status'], string> = {
  PENDING_REVIEW: 'Pending review',
  RECEIVED: 'Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
};

const productSteps: Order['status'][] = ['RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const prescriptionSteps: Order['status'][] = ['PENDING_REVIEW', 'RECEIVED', 'PREPARING', 'DELIVERED'];

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = typeof params.id === 'string' ? params.id : '';
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setErrorMessage('Order id is missing.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      setOrder(await getOrder(orderId));
    } catch {
      setErrorMessage('Unable to load order details. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const itemsTotal = order?.items.reduce(
    (total, item) => total + item.pricePiasters * item.quantity,
    0,
  ) ?? 0;
  const orderTotal = order ? itemsTotal + order.deliveryFeePiasters : 0;
  const isPrescription = order?.type === 'PRESCRIPTION_REQUEST';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <StateCard title="Loading order" text="Getting order details." />
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadOrder}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {order ? (
        <>
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroTitle}>{statusCopy[order.status]}</Text>
                <Text style={styles.heroMeta}>
                  {isPrescription ? 'Prescription request' : 'Product order'} #{order.id.slice(-8).toUpperCase()}
                </Text>
                <Text style={styles.heroCreated}>Created {formatDateTime(order.createdAt)}</Text>
              </View>
              <View style={styles.heroIcon}>
                <Ionicons name={isPrescription ? 'document-text-outline' : 'cube-outline'} size={24} color={colors.brand} />
              </View>
            </View>
          </View>

          <View style={styles.trackerCard}>
            <Text style={styles.sectionTitle}>Tracking</Text>
            <OrderTracker order={order} />
          </View>

          {isPrescription ? (
            <Section title="Prescription">
              <Text style={styles.reviewText}>{prescriptionReviewCopy(order.pricingStatus)}</Text>
              <DetailLine icon="document-attach-outline" text={`${order.prescriptions.length} uploaded file${order.prescriptions.length === 1 ? '' : 's'}`} />
            </Section>
          ) : (
            <Section title="Items">
              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemImage}>
                    {resolveImageUrl(item.product.imageUrl) ? (
                      <Image
                        source={{ uri: resolveImageUrl(item.product.imageUrl) ?? undefined }}
                        resizeMode="contain"
                        style={styles.itemPhoto}
                      />
                    ) : (
                      <Text style={styles.itemImageText}>Product</Text>
                    )}
                  </View>
                  <View style={styles.itemText}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                    <Text style={styles.itemQty}>Qty {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatPiasters(item.pricePiasters)}</Text>
                </View>
              ))}
            </Section>
          )}

          <Section title={order.fulfillmentMethod === 'PICKUP' ? 'Pickup' : 'Delivery'}>
            <DetailLine icon="time-outline" text={formatDeliverySlot(order)} />
            <DetailLine icon="location-outline" text={order.address} />
            <DetailLine icon="call-outline" text={order.customerPhone} />
          </Section>

          <Section title="Payment">
            <PaymentRow label="Payment method" value={paymentCopy(order.paymentMethod)} />
            {isPrescription ? (
              <PaymentRow label="Pricing status" value={pricingCopy(order.pricingStatus)} />
            ) : (
              <>
                <PaymentRow label="Subtotal" value={formatPiasters(itemsTotal)} />
                <PaymentRow label="Delivery fees" value={formatPiasters(order.deliveryFeePiasters)} />
                <View style={styles.divider} />
                <PaymentRow label="Total" value={formatPiasters(orderTotal)} strong />
              </>
            )}
          </Section>
        </>
      ) : null}
    </ScrollView>
  );
}

function StateCard({ text, title }: { text: string; title: string }) {
  return (
    <View style={styles.stateBox}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{text}</Text>
    </View>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DetailLine({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.detailLine}>
      <Ionicons name={icon} size={18} color={colors.brand} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

function PaymentRow({ label, strong = false, value }: { label: string; strong?: boolean; value: string }) {
  return (
    <View style={styles.paymentRow}>
      <Text style={strong ? styles.paymentLabelStrong : styles.paymentLabel}>{label}</Text>
      <Text style={strong ? styles.paymentValueStrong : styles.paymentValue}>{value}</Text>
    </View>
  );
}

function OrderTracker({ order }: { order: Order }) {
  const steps = order.type === 'PRESCRIPTION_REQUEST' ? prescriptionSteps : productSteps;
  const activeIndex = Math.max(steps.indexOf(order.status), 0);

  return (
    <View style={styles.tracker}>
      <View style={styles.trackerLineBase} />
      <View
        style={[
          styles.trackerLineProgress,
          { width: `${steps.length <= 1 ? 0 : (activeIndex / (steps.length - 1)) * 100}%` },
        ]}
      />
      {steps.map((step, index) => {
        const isActive = index <= activeIndex;

        return (
          <View key={step} style={styles.trackerStep}>
            <View style={isActive ? styles.trackerDotActive : styles.trackerDot}>
              <Ionicons
                name={trackerIcon(step)}
                size={15}
                color={isActive ? colors.white : '#9CA3AF'}
              />
            </View>
            <Text style={isActive ? styles.trackerLabelActive : styles.trackerLabel}>
              {shortStatusCopy(step)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function trackerIcon(status: Order['status']): keyof typeof Ionicons.glyphMap {
  if (status === 'PENDING_REVIEW') return 'document-text-outline';
  if (status === 'RECEIVED') return 'receipt-outline';
  if (status === 'PREPARING') return 'medkit-outline';
  if (status === 'OUT_FOR_DELIVERY') return 'bicycle-outline';
  return 'checkmark-done-outline';
}

function shortStatusCopy(status: Order['status']) {
  if (status === 'PENDING_REVIEW') return 'Review';
  if (status === 'RECEIVED') return 'Received';
  if (status === 'PREPARING') return 'Preparing';
  if (status === 'OUT_FOR_DELIVERY') return 'Delivery';
  return 'Done';
}

function formatDeliverySlot(order: Order) {
  if (!order.deliveryDate && !order.deliveryTimeSlot) return 'Not selected';
  return [order.deliveryDate, order.deliveryTimeSlot].filter(Boolean).join(' ');
}

function formatDateTime(dateValue: string) {
  return new Date(dateValue).toLocaleString('en-US', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function paymentCopy(method: Order['paymentMethod']) {
  if (method === 'ONLINE') return 'Online Payment';
  if (method === 'CARD_ON_DELIVERY') return 'Visa On Delivery';
  return 'Cash On Delivery';
}

function pricingCopy(status: Order['pricingStatus']) {
  if (status === 'PENDING_REVIEW') return 'Pending review';
  if (status === 'PRICED') return 'Priced';
  return 'Not required';
}

function prescriptionReviewCopy(status: Order['pricingStatus']) {
  if (status === 'PRICED') {
    return 'The pharmacy has priced this prescription and will prepare it after confirmation.';
  }

  return 'The pharmacy will review the prescription and contact you with price and availability.';
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
  hero: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 5,
  },
  heroMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroCreated: {
    color: colors.brandDark,
    fontSize: 13,
    fontWeight: '800',
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.brandSoft,
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  trackerCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  tracker: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    position: 'relative',
  },
  trackerStep: {
    alignItems: 'center',
    width: 68,
    zIndex: 1,
  },
  trackerLineBase: {
    backgroundColor: '#D1D5DB',
    height: 2,
    left: 34,
    position: 'absolute',
    right: 34,
    top: 18,
  },
  trackerLineProgress: {
    backgroundColor: colors.brand,
    height: 2,
    left: 34,
    maxWidth: '80%',
    position: 'absolute',
    top: 18,
  },
  trackerDot: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginBottom: 8,
    width: 34,
  },
  trackerDotActive: {
    alignItems: 'center',
    backgroundColor: colors.brand,
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    marginBottom: 8,
    width: 34,
  },
  trackerLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  trackerLabelActive: {
    color: colors.brandDark,
    fontSize: 11,
    fontWeight: '800',
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
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  reviewText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 10,
  },
  detailLine: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginLeft: 9,
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 10,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  itemImageText: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  itemPhoto: {
    height: '88%',
    width: '88%',
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 8,
  },
  itemName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 3,
  },
  itemQty: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  itemPrice: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '800',
  },
  paymentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  paymentLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  paymentValue: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'right',
  },
  paymentLabelStrong: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  paymentValueStrong: {
    color: colors.brand,
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'right',
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginBottom: 10,
    marginTop: 1,
  },
  stateBox: {
    backgroundColor: colors.white,
    borderColor: '#CFF2F1',
    borderRadius: 14,
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
    lineHeight: 19,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FFD4D4',
    borderRadius: 14,
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
});
