import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useOrder } from '../../context/OrderContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

function ServiceCard({ item, isSelected, onToggle, onPress }) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.cardWrapper}>
      <Pressable style={styles.card} onPress={() => onToggle(item.id)}>
        <ImageBackground
          source={item.image}
          style={[styles.cardBg, { backgroundColor: item.gradient?.[0] ?? '#444' }]}
          imageStyle={styles.cardImg}
          resizeMode="cover"
        >
          <LinearGradient
            colors={item.gradient ?? ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
            style={styles.cardOverlay}
          />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Text style={[textVariants.heading3, styles.cardTitle]}>{item.serviceName}</Text>
                <Text style={[textVariants.body2, styles.cardSubtitle]}>{item.packageTitle}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                  onPress={() => onToggle(item.id)}
                >
                  {isSelected ? (
                    <Ionicons name="checkmark" size={moderateScale(14)} color={colors.text.inverse} />
                  ) : null}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.menuButton}
                  onPress={() => setMenuVisible(true)}
                >
                  <Ionicons name="ellipsis-vertical" size={moderateScale(18)} color={colors.text.inverse} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={[textVariants.heading4, styles.cardPrice]}>{formatCurrency(item.price)}</Text>
              <Text style={[textVariants.body3, styles.cardDateTime]}>{item.dateTime}</Text>
            </View>
          </View>
        </ImageBackground>
      </Pressable>

      <Modal visible={menuVisible} transparent animationType="fade">
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuCard}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onPress?.('edit', item);
              }}
            >
              <Ionicons name="pencil-outline" size={moderateScale(18)} color={colors.text.primary} />
              <Text style={[textVariants.body3, styles.menuItemText]}>Edit order details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                onPress?.('remove', item);
              }}
            >
              <Ionicons name="trash-outline" size={moderateScale(18)} color={colors.state.error} />
              <Text style={[textVariants.body3, styles.menuItemTextDanger]}>Remove from bag</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const {
    bagItems,
    selectedIds,
    selectedTotal,
    selectedCount,
    toggleSelection,
    removeFromBag,
    clearSelectedAfterOrder,
  } = useOrder();

  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        setLoadingBookings(true);
        setLoadingOrders(true);
        try {
          const [bookingsRes, ordersRes] = await Promise.all([
            api.get('/bookings/user'),
            api.get('/orders/user'),
          ]);
          if (!cancelled) {
            setBookings(bookingsRes.data?.data ?? []);
            setOrders(ordersRes.data?.data ?? []);
          }
        } catch {
          if (!cancelled) {
            setBookings([]);
            setOrders([]);
          }
        } finally {
          if (!cancelled) {
            setLoadingBookings(false);
            setLoadingOrders(false);
          }
        }
      };
      load();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const groupedByAddress = useMemo(() => {
    const groups = new Map();
    bagItems.forEach((item) => {
      const key = item.addressId ?? item.addressDetail ?? 'default';
      if (!groups.has(key)) {
        groups.set(key, { addressLabel: item.addressLabel, addressDetail: item.addressDetail, items: [] });
      }
      groups.get(key).items.push(item);
    });
    return Array.from(groups.entries());
  }, [bagItems]);

  const selectedItems = useMemo(
    () => bagItems.filter((i) => selectedIds.has(i.id)),
    [bagItems, selectedIds]
  );
  const itemsWithArtist = selectedItems.filter((i) => i.artistId);

  const handleProceed = useCallback(async () => {
    if (selectedCount === 0) return;
    if (itemsWithArtist.length > 0) {
      setSubmitting(true);
      try {
        for (const item of itemsWithArtist) {
          await api.post('/bookings/request', {
            artistId: item.artistId,
            date: item.date ?? new Date().toISOString(),
            type: item.serviceName ?? 'Bhagwat Katha',
            address: item.address ?? item.addressDetail,
            city: item.city ?? 'New Delhi',
            pinCode: item.pinCode ?? '110001',
          });
        }
        clearSelectedAfterOrder();
        const res = await api.get('/bookings/user');
        setBookings(res.data?.data ?? []);
        Alert.alert('Success', 'Booking requests sent. Artist will confirm shortly.');
      } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to create booking';
        Alert.alert('Error', msg);
      } finally {
        setSubmitting(false);
      }
    } else {
      router.push('/orders/checkout');
    }
  }, [selectedCount, itemsWithArtist, clearSelectedAfterOrder, router]);

  const handleMenuAction = (action, item) => {
    if (action === 'remove') {
      removeFromBag(item.id);
    } else if (action === 'edit') {
      // TODO: Navigate to edit flow
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[textVariants.heading2, styles.title]}>Your orders</Text>

        {orders.length > 0 && (
          <>
            <Text style={[textVariants.heading4, styles.sectionTitle]}>My orders</Text>
            {orders
              .filter((o) => o.paymentStatus === 'PAID')
              .map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  <View style={styles.orderRow}>
                    <Text style={[textVariants.body4, styles.statusBadge, styles.status_PAID]}>PAID</Text>
                    <Text style={[textVariants.body3, styles.bookingValue]}>
                      {formatCurrency(order.grandTotal ?? 0)}
                    </Text>
                  </View>
                  {order.items?.map((item, idx) => (
                    <Text key={idx} style={[textVariants.body3, styles.bookingArtist]}>
                      {item.serviceName} · {item.packageTitle}
                    </Text>
                  ))}
                  <Text style={[textVariants.body4, styles.bookingDate]}>
                    {order.items?.[0]?.dateTime ? order.items[0].dateTime : '—'}
                  </Text>
                  <Text style={[textVariants.body4, styles.bookingDate]}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </Text>
                </View>
              ))}
          </>
        )}

        {bookings.length > 0 && (
          <>
            <Text style={[textVariants.heading4, styles.sectionTitle]}>My bookings</Text>
            {bookings.map((b) => (
              <View key={b._id} style={styles.bookingCard}>
                <View style={styles.bookingRow}>
                  <Text style={[textVariants.body4, styles.statusBadge, styles[`status_${b.status}`]]}>
                    {b.status}
                  </Text>
                  <Text style={[textVariants.body3, styles.bookingValue]}>
                    {formatCurrency(b.pricing?.agreedPrice ?? 0)}
                  </Text>
                </View>
                <Text style={[textVariants.body3, styles.bookingArtist]}>
                  {b.artist?.name ?? 'Artist'} · {b.eventDetails?.type ?? 'Event'}
                </Text>
                <Text style={[textVariants.body4, styles.bookingDate]}>
                  {b.eventDetails?.date
                    ? new Date(b.eventDetails.date).toLocaleDateString()
                    : '—'}
                </Text>
                {b.status === 'CONFIRMED' && b.paymentStatus !== 'PAID' && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.payButton}
                    onPress={() => router.push({ pathname: '/orders/payment', params: { bookingId: b._id } })}
                  >
                    <Text style={[textVariants.button2, styles.payButtonText]}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}

        {bagItems.length > 0 && (
          <>
            <Text style={[textVariants.heading4, styles.sectionTitle]}>Cart</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryLeft}>
                <Text style={[textVariants.heading3, styles.totalAmount]}>{formatCurrency(selectedTotal)}</Text>
                <Text style={[textVariants.body4, styles.totalLabel]}>Total</Text>
                <Text style={[textVariants.body4, styles.countLabel]}>Count: {selectedCount}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.proceedButton, (selectedCount === 0 || submitting) && styles.proceedButtonDisabled]}
                onPress={handleProceed}
                disabled={selectedCount === 0 || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.text.inverse} size="small" />
                ) : (
                  <Text style={[textVariants.button1, styles.proceedButtonText]}>PROCEED TO BUY</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[textVariants.body3, styles.prompt]}>Select the services you need.</Text>

            {groupedByAddress.map(([key, group]) => (
              <View key={key} style={styles.addressGroup}>
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={moderateScale(16)} color={colors.text.primary} />
                  <Text style={[textVariants.body3, styles.addressText]}>{group.addressDetail}</Text>
                </View>
                {group.items.map((item) => (
                  <ServiceCard
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggle={toggleSelection}
                    onPress={handleMenuAction}
                  />
                ))}
              </View>
            ))}
          </>
        )}

        {bagItems.length === 0 && !loadingBookings && !loadingOrders && bookings.length === 0 && orders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="bag-outline" size={moderateScale(48)} color="#B1B4BB" />
            <Text style={[textVariants.body2, styles.emptyText]}>Your bag is empty</Text>
            <Text style={[textVariants.body4, styles.emptySubtext]}>
              Add services from the Service tab to get started
            </Text>
          </View>
        )}

        {loadingBookings && loadingOrders && bookings.length === 0 && orders.length === 0 && bagItems.length === 0 && (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#5A0C0C" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(30),
    gap: verticalScale(12),
  },
  title: {
    color: colors.text.primary,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLeft: {
    gap: 2,
  },
  totalAmount: {
    color: colors.text.primary,
  },
  totalLabel: {
    color: '#6A6E75',
  },
  countLabel: {
    color: '#6A6E75',
    marginTop: 2,
  },
  proceedButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
  },
  proceedButtonDisabled: {
    backgroundColor: '#B1B4BB',
  },
  proceedButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prompt: {
    color: '#6A6E75',
  },
  addressGroup: {
    gap: verticalScale(10),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  addressText: {
    color: colors.text.primary,
    flex: 1,
  },
  cardWrapper: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  card: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    minHeight: verticalScale(140),
  },
  cardBg: {
    flex: 1,
    minHeight: verticalScale(140),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  cardImg: {
    borderRadius: moderateScale(16),
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    padding: scale(14),
    justifyContent: 'space-between',
    minHeight: verticalScale(140),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text.inverse,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  checkbox: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(4),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#5A0C0C',
    borderColor: '#5A0C0C',
  },
  menuButton: {
    padding: scale(4),
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardPrice: {
    color: colors.text.inverse,
  },
  cardDateTime: {
    color: 'rgba(255,255,255,0.9)',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(24),
  },
  menuCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(14),
    paddingVertical: verticalScale(8),
    minWidth: scale(220),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  menuItemText: {
    color: colors.text.primary,
  },
  menuItemTextDanger: {
    color: colors.state.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(48),
    gap: verticalScale(8),
  },
  emptyText: {
    color: '#6A6E75',
  },
  emptySubtext: {
    color: '#9EA3A9',
  },
  sectionTitle: {
    color: colors.text.primary,
    marginTop: verticalScale(16),
  },
  orderCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    padding: scale(14),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  bookingCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    padding: scale(14),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(4),
  },
  statusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: 2,
    borderRadius: moderateScale(6),
  },
  status_PENDING: { backgroundColor: '#FFF3E0', color: '#E65100' },
  status_CONFIRMED: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
  status_COMPLETED: { backgroundColor: '#E3F2FD', color: '#1565C0' },
  status_REJECTED: { backgroundColor: '#FFEBEE', color: '#C62828' },
  status_PAID: { backgroundColor: '#E8F5E9', color: '#2E7D32' },
  bookingValue: {
    color: colors.text.primary,
  },
  bookingArtist: {
    color: '#6A6E75',
  },
  bookingDate: {
    color: '#9EA3A9',
    marginTop: 2,
  },
  payButton: {
    marginTop: verticalScale(10),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    alignItems: 'center',
  },
  payButtonText: {
    color: colors.text.inverse,
  },
});
