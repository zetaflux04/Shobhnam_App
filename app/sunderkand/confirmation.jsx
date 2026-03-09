import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';
import { sunderServiceName } from '../../constants/sunderkand';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function SunderConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const packageTitle = params.packageTitle ?? 'Diamond package.';
  const packagePrice = Number(params.packagePrice ?? 11000);
  const addressLine =
    params.addressLine ?? 'Home - 303B, 3rd floor, Vikas puri 110037,\nNew delhi';
  const dateLabel = params.dateLabel ?? 'Sun, January 15, 2026 - 08:00 AM';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>Booking</Text>
          <View style={styles.iconPlaceholder} />
        </View>

        <View style={styles.statusBadge}>
          <Ionicons name="checkmark" size={moderateScale(26)} color={colors.text.inverse} />
        </View>
        <Text style={[textVariants.heading4, styles.statusTitle]}>Added to bag</Text>
        <Text style={[textVariants.body2, styles.statusSubtitle]}>
          Your order has been added to the bag.{'\n'}Go to bag to review and confirm payment.
        </Text>

        <View style={styles.detailCard}>
          <Text style={[textVariants.heading4, styles.eventTitle]}>{sunderServiceName}</Text>
          <Text style={[textVariants.body3, styles.eventSubtitle]}>{packageTitle}</Text>

          <Text style={[textVariants.caption4, styles.sectionLabel]}>Event venue</Text>
          <View style={styles.row}>
            <Ionicons name="location-outline" size={moderateScale(16)} color={colors.text.primary} />
            <Text style={[textVariants.body3, styles.rowText]}>{addressLine}</Text>
          </View>

          <Text style={[textVariants.caption4, styles.sectionLabel, styles.sectionLabelSpacing]}>
            Date and time
          </Text>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={moderateScale(16)} color={colors.text.primary} />
            <Text style={[textVariants.body3, styles.rowText]}>{dateLabel}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.row, styles.totalRow]}>
            <Text style={[textVariants.heading4, styles.totalLabel]}>Total fee</Text>
            <Text style={[textVariants.heading4, styles.totalValue]}>{formatCurrency(packagePrice)}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryButton}
          onPress={() => router.replace('/(tabs)/orders')}
        >
          <Text style={[textVariants.button1, styles.primaryButtonText]}>View orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.secondaryButton}
          onPress={() => router.replace('/(tabs)/service')}
        >
          <Text style={[textVariants.button1, styles.secondaryButtonText]}>Back to home</Text>
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
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(30),
    gap: verticalScale(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  statusBadge: {
    alignSelf: 'center',
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6F1D1D',
    marginTop: verticalScale(16),
  },
  statusTitle: {
    textAlign: 'center',
    color: colors.text.primary,
    marginTop: verticalScale(8),
  },
  statusSubtitle: {
    textAlign: 'center',
    color: '#6A6E75',
  },
  detailCard: {
    marginTop: verticalScale(14),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: verticalScale(8),
  },
  eventTitle: {
    color: colors.text.primary,
  },
  eventSubtitle: {
    color: '#A0A4AA',
  },
  sectionLabel: {
    color: '#6A6E75',
    marginTop: verticalScale(8),
  },
  sectionLabelSpacing: {
    marginTop: verticalScale(6),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  rowText: {
    color: colors.text.primary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: verticalScale(10),
  },
  totalRow: {
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.text.primary,
  },
  totalValue: {
    color: '#5A0C0C',
  },
  primaryButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginTop: verticalScale(12),
  },
  primaryButtonText: {
    color: colors.text.inverse,
  },
  secondaryButton: {
    borderColor: '#5A0C0C',
    borderWidth: 1,
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#5A0C0C',
  },
});
