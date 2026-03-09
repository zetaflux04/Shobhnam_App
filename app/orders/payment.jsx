import { useRazorpay } from '@codearcade/expo-razorpay';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useOrder } from '../../context/OrderContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const DELIVERY_CHARGE = 0;
const TRAVELING_FEE = 500;

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = params.bookingId;
  const { selectedItems, selectedTotal } = useOrder();
  const { openCheckout, RazorpayUI } = useRazorpay();

  const [razorpayKey, setRazorpayKey] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/config');
        setRazorpayKey(res.data?.data?.razorpayKeyId ?? res.data?.razorpayKeyId);
      } catch {
        setRazorpayKey(null);
      }
    };
    fetchConfig();
  }, []);

  const grandTotal = useMemo(() => {
    if (bookingId) return 0;
    return selectedTotal + DELIVERY_CHARGE + TRAVELING_FEE;
  }, [bookingId, selectedTotal]);

  const handlePaymentSuccess = useCallback(() => {
    setPaying(false);
    router.replace('/orders/confirmed');
  }, [router]);

  const handleBack = () => {
    router.back();
  };

  const handlePay = useCallback(async () => {
    if (bookingId && razorpayKey) {
      setPaying(true);
      try {
        const res = await api.post('/payments/create-order', { bookingId });
        const { order } = res.data?.data ?? res.data ?? {};
        if (!order?.id) {
          Alert.alert('Error', 'Could not create payment order');
          setPaying(false);
          return;
        }
        openCheckout(
          {
            key: razorpayKey,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency ?? 'INR',
            name: 'Shobhnam',
            description: 'Event booking payment',
          },
          {
            onSuccess: async (data) => {
              try {
                await api.post('/payments/verify', {
                  razorpayOrderId: data.razorpay_order_id,
                  razorpayPaymentId: data.razorpay_payment_id,
                  razorpaySignature: data.razorpay_signature,
                });
                handlePaymentSuccess();
              } catch (err) {
                setPaying(false);
                Alert.alert('Error', err.response?.data?.message ?? 'Payment verification failed');
              }
            },
            onFailure: (err) => {
              setPaying(false);
              Alert.alert('Payment Failed', err?.description ?? 'Payment was cancelled or failed');
            },
          }
        );
      } catch (err) {
        setPaying(false);
        Alert.alert('Error', err.response?.data?.message ?? err.message ?? 'Failed to create order');
      }
    } else if (!bookingId && selectedItems.length > 0 && razorpayKey) {
      setPaying(true);
      try {
        const items = selectedItems.map((i) => ({
          serviceName: i.serviceName,
          packageTitle: i.packageTitle,
          price: i.price,
          dateTime: i.dateTime,
          date: i.date,
          addressDetail: i.addressDetail,
          addressLabel: i.addressLabel,
        }));
        const orderRes = await api.post('/orders', { items });
        const order = orderRes.data?.data ?? orderRes.data;
        const orderId = order?._id ?? order?.id;
        if (!orderId) {
          Alert.alert('Error', 'Could not create order');
          setPaying(false);
          return;
        }
        const payRes = await api.post('/payments/create-order', { orderId });
        const { order: razorpayOrder } = payRes.data?.data ?? payRes.data ?? {};
        if (!razorpayOrder?.id) {
          Alert.alert('Error', 'Could not create payment order');
          setPaying(false);
          return;
        }
        openCheckout(
          {
            key: razorpayKey,
            order_id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency ?? 'INR',
            name: 'Shobhnam',
            description: 'Service booking payment',
          },
          {
            onSuccess: async (data) => {
              try {
                await api.post('/payments/verify', {
                  razorpayOrderId: data.razorpay_order_id,
                  razorpayPaymentId: data.razorpay_payment_id,
                  razorpaySignature: data.razorpay_signature,
                });
                handlePaymentSuccess();
              } catch (err) {
                setPaying(false);
                Alert.alert('Error', err.response?.data?.message ?? 'Payment verification failed');
              }
            },
            onFailure: (err) => {
              setPaying(false);
              Alert.alert('Payment Failed', err?.description ?? 'Payment was cancelled or failed');
            },
          }
        );
      } catch (err) {
        setPaying(false);
        Alert.alert('Error', err.response?.data?.message ?? err.message ?? 'Failed to create order');
      }
    }
  }, [bookingId, razorpayKey, selectedItems, openCheckout, handlePaymentSuccess]);

  const canPay = (bookingId ? razorpayKey : selectedItems.length > 0 && razorpayKey) && !paying;

  if (!bookingId && selectedItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={[textVariants.body2, styles.emptyText]}>No items in order. Go back to orders.</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.backButton} onPress={() => router.replace('/(tabs)/orders')}>
            <Text style={[textVariants.button2, styles.backButtonText]}>Back to orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {RazorpayUI}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.headerTitle]}>Payment</Text>
        <View style={styles.iconPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.trustRow}>
            <Ionicons name="shield-checkmark" size={moderateScale(20)} color={colors.state.success} />
            <Text style={[textVariants.body3, styles.trustText]}>Secure payment powered by Razorpay</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={[textVariants.body2, styles.amountLabel]}>Amount to pay</Text>
            <Text style={[textVariants.heading3, styles.amountValue]}>
              {bookingId ? 'Pay for booking' : formatCurrency(grandTotal)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.payButton, !canPay && styles.payButtonDisabled]}
          onPress={handlePay}
          disabled={!canPay}
        >
          {paying ? (
            <ActivityIndicator color={colors.text.inverse} size="small" />
          ) : (
            <>
              <Ionicons name="card" size={moderateScale(20)} color={colors.text.inverse} />
              <Text style={[textVariants.button1, styles.payButtonText]}>
                {bookingId ? 'Pay Now' : 'Pay with Razorpay'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  iconPlaceholder: {
    width: moderateScale(36),
    height: moderateScale(36),
  },
  headerTitle: {
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
  },
  summaryCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(16),
    padding: scale(20),
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: verticalScale(16),
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  trustText: {
    color: '#6A6E75',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountLabel: {
    color: '#6A6E75',
  },
  amountValue: {
    color: colors.text.primary,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(24),
  },
  payButtonDisabled: {
    backgroundColor: '#B1B4BB',
  },
  payButtonText: {
    color: colors.text.inverse,
  },
  emptyContainer: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(16),
  },
  emptyText: {
    color: '#6A6E75',
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(20),
  },
  backButtonText: {
    color: colors.text.inverse,
  },
});
