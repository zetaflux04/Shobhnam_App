import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useOrder } from '../../context/OrderContext';
import { getAddressSaved, setAddressSaved } from '../../utils/addressSession';
import { colors, textVariants } from '../../styles/theme';
import { rudraAddresses, rudraCalendar, rudraFees, rudraTimeSlots } from '../../constants/rudra';

const weeks = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31],
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function RudraBooking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToBag } = useOrder();

  const [hasAddress, setHasAddress] = useState(getAddressSaved());
  const [showAddressGate, setShowAddressGate] = useState(!hasAddress);
  const [selectedAddress, setSelectedAddress] = useState(rudraAddresses[0]);
  const [selectedDate, setSelectedDate] = useState(rudraCalendar.highlightedDay ?? 15);
  const [selectedTime, setSelectedTime] = useState(rudraTimeSlots[0]);

  const packageTitle = params.packageTitle ?? 'Rudrabhishek';
  const packagePrice = useMemo(() => Number(params.packagePrice ?? rudraFees.total), [params.packagePrice]);

  const dateLabel = useMemo(
    () => `Sun, ${rudraCalendar.monthLabel} ${selectedDate.toString().padStart(2, '0')} - ${selectedTime}`,
    [selectedDate, selectedTime],
  );

  const handleGateChoice = (action) => {
    setAddressSaved();
    setHasAddress(true);
    setShowAddressGate(false);
    if (action === 'sheet') {
      router.push('/rudra/location-sheet');
    }
  };

  const eventDate = useMemo(
    () => new Date(2026, 0, selectedDate, 8, 0, 0).toISOString(),
    [selectedDate],
  );

  const handleAddToBag = () => {
    if (!hasAddress) {
      handleGateChoice();
      return;
    }
    const addr = selectedAddress;
    addToBag({
      serviceName: 'Rudrabhishek',
      packageTitle,
      price: packagePrice,
      dateTime: dateLabel,
      date: eventDate,
      address: addr.full,
      addressId: addr.id,
      addressLabel: addr.label,
      addressDetail: (addr.full ?? '').replace(/\n/g, ' '),
      gradient: ['rgba(0,126,137,0.85)', 'rgba(0,126,137,0.4)'],
      image: require('../../assets/service/card-5.png'),
    });
    router.push({
      pathname: '/rudra/confirmation',
      params: {
        packageTitle,
        packagePrice: packagePrice.toString(),
        dateLabel,
        addressLine: selectedAddress.full,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>Booking</Text>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={moderateScale(18)} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[textVariants.body1, styles.sectionTitle]}>Your address</Text>
          {hasAddress ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => handleGateChoice('sheet')}>
              <Text style={[textVariants.body2, styles.addAddress]}>+ Add new address</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.addressRow}>
          {rudraAddresses.map((item) => {
            const isSelected = selectedAddress.id === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.addressChip, isSelected && styles.addressChipActive]}
                onPress={() => setSelectedAddress(item)}
              >
                <Ionicons
                  name="location-outline"
                  size={moderateScale(16)}
                  color={isSelected ? colors.text.primary : '#5A0C0C'}
                />
                <Text style={[textVariants.body2, styles.addressLabel, isSelected && styles.addressLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[textVariants.body2, styles.addressDetail]}>{selectedAddress.full}</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.venueButton}
          onPress={() => handleGateChoice('sheet')}
        >
          <Ionicons name="navigate-circle-outline" size={moderateScale(18)} color="#5A0C0C" />
          <Text style={[textVariants.body2, styles.venueButtonText]}>Enter your event venue</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[textVariants.body1, styles.sectionTitle]}>Choose date</Text>
          <View style={styles.monthRow}>
            <TouchableOpacity activeOpacity={0.85} style={styles.monthArrow}>
              <Ionicons name="chevron-back" size={moderateScale(16)} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[textVariants.button2, styles.monthLabel]}>{rudraCalendar.monthLabel}</Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.monthArrow}>
              <Ionicons name="chevron-forward" size={moderateScale(16)} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dayNames}>
          {dayLabels.map((day) => (
            <Text key={day} style={[textVariants.body3, styles.dayName]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendar}>
          {weeks.map((week, idx) => (
            <View key={`week-${idx}`} style={styles.weekRow}>
              {week.map((day) => {
                const isSelected = selectedDate === day;
                return (
                  <TouchableOpacity
                    key={day}
                    activeOpacity={0.85}
                    style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                    onPress={() => setSelectedDate(day)}
                  >
                    <Text style={[textVariants.body3, styles.dayText, isSelected && styles.dayTextSelected]}>
                      {day.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {week.length < 7 &&
                Array.from({ length: 7 - week.length }).map((_, fillerIdx) => (
                  <View key={`empty-${fillerIdx}`} style={styles.dayCell} />
                ))}
            </View>
          ))}
        </View>

        <Text style={[textVariants.body1, styles.sectionTitle, styles.timeTitle]}>Available time</Text>
        <View style={styles.timeRow}>
          {rudraTimeSlots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <TouchableOpacity
                key={slot}
                activeOpacity={0.85}
                style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                onPress={() => setSelectedTime(slot)}
              >
                <Text style={[textVariants.body3, styles.timeText, isSelected && styles.timeTextSelected]}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.feeBox}>
          <Text style={[textVariants.heading5, styles.feeLabel]}>{formatCurrency(packagePrice)}</Text>
          <Text style={[textVariants.body4, styles.feeSub]}>Total{'\n'}Includes all taxes</Text>
        </View>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleAddToBag}>
          <Text style={[textVariants.button1, styles.primaryButtonText]}>Add to bag</Text>
        </TouchableOpacity>
      </View>

      {showAddressGate && (
        <View style={styles.gateOverlay}>
          <View style={styles.gateSheet}>
            <Text style={[textVariants.heading4, styles.gateTitle]}>Enter your event venue</Text>
            <Text style={[textVariants.body3, styles.gateSubtitle]}>
              This will help us find best artists near you
            </Text>
            <TouchableOpacity activeOpacity={0.9} style={styles.gatePrimary} onPress={() => handleGateChoice('sheet')}>
              <Text style={[textVariants.button1, styles.gatePrimaryText]}>Add address</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} style={styles.gateSecondary} onPress={() => handleGateChoice()}>
              <Ionicons name="locate" size={moderateScale(16)} color="#5A0C0C" />
              <Text style={[textVariants.button2, styles.gateSecondaryText]}>Use current location</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingBottom: verticalScale(24),
    gap: verticalScale(14),
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  addAddress: {
    color: '#C42C36',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flexWrap: 'wrap',
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: colors.background.base,
    borderColor: '#CFCFCF',
    borderWidth: 1,
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },
  addressChipActive: {
    backgroundColor: colors.background.surface,
    borderColor: '#5A0C0C',
  },
  addressLabel: {
    color: '#5A0C0C',
  },
  addressLabelActive: {
    color: colors.text.primary,
  },
  addressDetail: {
    color: colors.text.primary,
  },
  venueButton: {
    marginTop: verticalScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.background.surface,
  },
  venueButtonText: {
    color: colors.text.primary,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  monthArrow: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  monthLabel: {
    color: colors.text.primary,
    paddingHorizontal: scale(10),
  },
  dayNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayName: {
    color: '#6A6E75',
    width: '14%',
    textAlign: 'center',
  },
  calendar: {
    gap: verticalScale(8),
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#000',
  },
  dayText: {
    color: colors.text.primary,
  },
  dayTextSelected: {
    color: colors.text.inverse,
  },
  timeTitle: {
    marginTop: verticalScale(4),
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  timeChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(18),
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  timeChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  timeText: {
    color: colors.text.primary,
  },
  timeTextSelected: {
    color: colors.text.inverse,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  feeBox: {
    flex: 1,
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabel: {
    color: '#5A0C0C',
  },
  feeSub: {
    color: '#6A6E75',
  },
  primaryButton: {
    backgroundColor: '#5A0C0C',
    paddingHorizontal: scale(22),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(22),
  },
  primaryButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  gateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  gateSheet: {
    backgroundColor: colors.background.base,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
    gap: verticalScale(10),
  },
  gateTitle: {
    color: colors.text.primary,
  },
  gateSubtitle: {
    color: '#6A6E75',
  },
  gatePrimary: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(22),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(22),
    alignItems: 'center',
  },
  gatePrimaryText: {
    color: colors.text.inverse,
  },
  gateSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(14),
    alignSelf: 'flex-start',
  },
  gateSecondaryText: {
    color: '#5A0C0C',
  },
});
