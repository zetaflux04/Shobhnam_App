import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useOrder } from '../../context/OrderContext';
import { colors, textVariants } from '../../styles/theme';

const DELIVERY_CHARGE = 0;
const TRAVELING_FEE = 500;

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function CheckoutScreen() {
  const router = useRouter();
  const { selectedItems } = useOrder();

  const { primaryAddress, primaryDateTime, serviceTotal, grandTotal } = useMemo(() => {
    if (selectedItems.length === 0) {
      return {
        primaryAddress: '—',
        primaryDateTime: '—',
        serviceTotal: 0,
        grandTotal: 0,
      };
    }
    const first = selectedItems[0];
    const primaryAddress = first.addressDetail ?? '—';
    const primaryDateTime = first.dateTime ?? '—';
    const serviceTotal = selectedItems.reduce((sum, i) => sum + (i.price ?? 0), 0);
    const grandTotal = serviceTotal + DELIVERY_CHARGE + TRAVELING_FEE;
    return { primaryAddress, primaryDateTime, serviceTotal, grandTotal };
  }, [selectedItems]);

  const handleProceedToPay = () => {
    router.push('/orders/payment');
  };

  if (selectedItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={[textVariants.body2, styles.emptyText]}>No items selected. Go back to select services.</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.backButton} onPress={() => router.back()}>
            <Text style={[textVariants.button2, styles.backButtonText]}>Back to orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.headerTitle]}>Checkout</Text>
        <View style={styles.iconPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[textVariants.heading4, styles.sectionTitle]}>Event venue</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={moderateScale(18)} color={colors.text.primary} />
          <Text style={[textVariants.body3, styles.rowText]}>{primaryAddress}</Text>
        </View>

        <Text style={[textVariants.heading4, styles.sectionTitle, styles.sectionSpacing]}>Date and time</Text>
        <View style={styles.dateTimeBox}>
          <Text style={[textVariants.body3, styles.dateTimeText]}>{primaryDateTime}</Text>
        </View>

        <Text style={[textVariants.heading4, styles.sectionTitle, styles.sectionSpacing]}>Bill details</Text>
        <View style={styles.billCard}>
          <View style={styles.billRow}>
            <Text style={[textVariants.body3, styles.billLabel]}>Service total</Text>
            <Text style={[textVariants.body3, styles.billValue]}>{formatCurrency(serviceTotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[textVariants.body3, styles.billLabel]}>Delivery charge</Text>
            <Text style={[textVariants.body3, styles.billValueFree]}>Free</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={[textVariants.body3, styles.billLabel]}>Traveling fee</Text>
            <Text style={[textVariants.body3, styles.billValue]}>{formatCurrency(TRAVELING_FEE)}</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={[textVariants.heading4, styles.billLabel]}>Grand total</Text>
            <Text style={[textVariants.heading4, styles.billValue]}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleProceedToPay}>
          <Text style={[textVariants.button1, styles.primaryButtonText]}>PROCEED TO PAY</Text>
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
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  headerTitle: {
    color: colors.text.primary,
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
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(24),
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: verticalScale(8),
  },
  sectionSpacing: {
    marginTop: verticalScale(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(10),
  },
  rowText: {
    color: colors.text.primary,
    flex: 1,
  },
  dateTimeBox: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
  },
  dateTimeText: {
    color: colors.text.primary,
  },
  billCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(8),
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: verticalScale(10),
  },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billLabel: {
    color: colors.text.primary,
  },
  billValue: {
    color: colors.text.primary,
  },
  billValueFree: {
    color: colors.state.success,
  },
  billDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: verticalScale(4),
  },
  footer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    paddingBottom: verticalScale(24),
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  primaryButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
