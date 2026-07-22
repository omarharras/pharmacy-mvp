import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Order, getOrders } from '@/lib/api';
import { formatPiasters } from '@/lib/request-context';

const statusCopy: Record<Order['status'], string> = {
  PENDING_REVIEW: 'Pending review',
  RECEIVED: 'Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
};

const productStatusSteps: Order['status'][] = [
  'RECEIVED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const prescriptionStatusSteps: Order['status'][] = [
  'PENDING_REVIEW',
  'RECEIVED',
  'PREPARING',
  'DELIVERED',
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setOrders(await getOrders());
    } catch {
      setErrorMessage('Unable to load orders. Check that the API is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Orders</Text>

      {isLoading ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Loading orders</Text>
          <Text style={styles.stateText}>Getting your active and past orders.</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Could not connect</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={loadOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!isLoading && !errorMessage && orders.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>No orders yet</Text>
          <Text style={styles.stateText}>Your product orders and prescription requests will appear here.</Text>
        </View>
      ) : null}

      {orders.map((order) => {
        const isPrescription = order.type === 'PRESCRIPTION_REQUEST';
        const totalPiasters = order.items.reduce(
          (total, item) => total + item.pricePiasters * item.quantity,
          0,
        );

        return (
          <Link
            key={order.id}
            href={{
              pathname: '/orders/[id]',
              params: {
                id: order.id,
              },
            }}
            asChild
          >
          <Pressable style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View>
                <Text style={styles.orderRef}>Order #{order.id.slice(-8).toUpperCase()}</Text>
                <View style={styles.orderMetaStack}>
                  <View style={styles.orderMetaItem}>
                    <Ionicons name="time-outline" size={15} color="#00b6bd" />
                    <Text style={styles.orderMeta}>
                      Created at {formatCreatedDateTime(order.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.orderMetaItem}>
                    <Ionicons name="calendar-outline" size={15} color="#00b6bd" />
                    <Text style={styles.orderMeta}>
                      Delivery time {formatDeliveryTime(order)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderActions}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{statusCopy[order.status]}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </View>

            <OrderTimeline order={order} />

            {isPrescription ? (
              <Text style={styles.reviewText}>
                The pharmacy will review the prescription and contact you with price and availability.
              </Text>
            ) : (
              <Text style={styles.totalText}>{formatPiasters(totalPiasters)}</Text>
            )}
          </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );
}

type OrderTimelineProps = {
  order: Order;
};

function OrderTimeline({ order }: OrderTimelineProps) {
  const steps = order.type === 'PRESCRIPTION_REQUEST'
    ? prescriptionStatusSteps
    : productStatusSteps;
  const activeIndex = Math.max(steps.indexOf(order.status), 0);

  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => {
        const isActive = index <= activeIndex;
        const isLast = index === steps.length - 1;

        return (
          <View key={step} style={styles.timelineStep}>
            <View style={isActive ? styles.timelineIconActive : styles.timelineIcon}>
              <Ionicons
                name={timelineIconName(step)}
                size={17}
                color={isActive ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            {!isLast ? (
              <View style={isActive ? styles.timelineLineActive : styles.timelineLine} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function timelineIconName(status: Order['status']): keyof typeof Ionicons.glyphMap {
  if (status === 'PENDING_REVIEW') {
    return 'document-text-outline';
  }

  if (status === 'RECEIVED') {
    return 'cube-outline';
  }

  if (status === 'PREPARING') {
    return 'medkit-outline';
  }

  if (status === 'OUT_FOR_DELIVERY') {
    return 'bicycle-outline';
  }

  return 'checkmark-done-outline';
}

function formatCreatedDateTime(dateValue: string) {
  return new Date(dateValue).toLocaleString([], {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
}

function formatDeliveryTime(order: Order) {
  if (!order.deliveryDate && !order.deliveryTimeSlot) {
    return 'Not scheduled';
  }

  return [order.deliveryDate, order.deliveryTimeSlot].filter(Boolean).join(' ');
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  stateBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CFF2F1',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  stateTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  stateText: {
    color: '#6B7280',
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
    color: '#FFFFFF',
    fontWeight: '800',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  orderTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderRef: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  orderActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: '#E6F8F7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    color: '#00b6bd',
    fontSize: 12,
    fontWeight: '800',
  },
  orderMetaStack: {
    marginTop: 4,
  },
  orderMetaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  orderMeta: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 5,
  },
  timeline: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 2,
  },
  timelineStep: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timelineIcon: {
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  timelineIconActive: {
    alignItems: 'center',
    backgroundColor: '#00b6bd',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  timelineLine: {
    backgroundColor: '#D1D5DB',
    height: 2,
    width: 38,
  },
  timelineLineActive: {
    backgroundColor: '#00b6bd',
    height: 2,
    width: 38,
  },
  reviewText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 19,
  },
  totalText: {
    color: '#00b6bd',
    fontSize: 17,
    fontWeight: '800',
  },
});
