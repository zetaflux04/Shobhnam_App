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

export default function OrderConfirmedScreen() {
  const router = useRouter();
  const { selectedItems, clearSelectedAfterOrder } = useOrder();

  const { primaryAddress, primaryDateTime, grandTotal } = useMemo(() => {
    if (selectedItems.length === 0) {
      return { primaryAddress: '—', primaryDateTime: '—', grandTotal: 0 };
    }
    const first = selectedItems[0];
    const serviceTotal = selectedItems.reduce((sum, i) => sum + (i.price ?? 0), 0);
    return {
      primaryAddress: first.addressDetail ?? '—',
      primaryDateTime: first.dateTime ?? '—',
      grandTotal: serviceTotal + DELIVERY_CHARGE + TRAVELING_FEE,
    };
  }, [selectedItems]);

  const handleDone = () => {
    clearSelectedAfterOrder();
    router.replace('/(tabs)/orders');
  };

  if (selectedItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, styles.emptyContent]}>
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={moderateScale(36)} color={colors.text.inverse} />
          </View>
          <Text style={[textVariants.heading3, styles.title]}>Order confirmed</Text>
          <Text style={[textVariants.body2, { color: '#6A6E75', textAlign: 'center', marginBottom: verticalScale(20) }]}>
            Your payment was successful. Your order has been confirmed.
          </Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.doneButton} onPress={handleDone}>
            <Text style={[textVariants.button1, styles.doneButtonText]}>VIEW ORDERS</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={moderateScale(36)} color={colors.text.inverse} />
        </View>
        <Text style={[textVariants.heading3, styles.title]}>Order confirmed</Text>
        <Text style={[textVariants.body2, styles.subtitle]}>
          Your payment was successful. Your order has been confirmed.
        </Text>

        <View style={styles.detailCard}>
          <Text style={[textVariants.heading4, styles.cardTitle]}>Services</Text>
          {selectedItems.map((item) => (
            <View key={item.id} style={styles.serviceRow}>
              <Text style={[textVariants.body3, styles.serviceName]}>{item.serviceName}</Text>
              <Text style={[textVariants.body4, styles.serviceSubtitle]}>{item.packageTitle}</Text>
            </View>
          ))}

          <Text style={[textVariants.caption4, styles.sectionLabel]}>Event venue</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={moderateScale(16)} color={colors.text.primary} />
            <Text style={[textVariants.body3, styles.rowText]}>{primaryAddress}</Text>
          </View>

          <Text style={[textVariants.caption4, styles.sectionLabel, styles.sectionSpacing]}>Date and time</Text>
          <View style={styles.dateTimeBox}>
            <Text style={[textVariants.body3, styles.dateTimeText]}>{primaryDateTime}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={[textVariants.heading4, styles.totalLabel]}>Total fee</Text>
            <Text style={[textVariants.heading4, styles.totalValue]}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.doneButton} onPress={handleDone}>
          <Text style={[textVariants.button1, styles.doneButtonText]}>DONE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  content: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(30),
    alignItems: 'center',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  subtitle: {
    color: '#6A6E75',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  detailCard: {
    width: '100%',
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(18),
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: verticalScale(8),
  },
  cardTitle: {
    color: colors.text.primary,
    marginBottom: verticalScale(4),
  },
  serviceRow: {
    marginBottom: verticalScale(4),
  },
  serviceName: {
    color: colors.text.primary,
  },
  serviceSubtitle: {
    color: '#6A6E75',
    marginTop: 2,
  },
  sectionLabel: {
    color: '#6A6E75',
    marginTop: verticalScale(8),
  },
  sectionSpacing: {
    marginTop: verticalScale(6),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(8),
  },
  rowText: {
    color: colors.text.primary,
    flex: 1,
  },
  dateTimeBox: {
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
  },
  dateTimeText: {
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    borderStyle: 'dashed',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    marginVertical: verticalScale(12),
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.text.primary,
  },
  totalValue: {
    color: colors.text.primary,
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  doneButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
