import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useAddresses, buildAddressLine } from '../../context/AddressContext';
import { useOrder } from '../../context/OrderContext';
import { BOOKING_TIME_SLOTS } from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';
import AddressFormModal from '../address/AddressFormModal';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const SLOT_TO_HOUR = {
  '9:00 AM': 9,
  '12:00 PM': 12,
  '3:00 PM': 15,
  '6:00 PM': 18,
};

const getMonthGrid = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingNulls = firstDay.getDay();
  const days = [...Array(leadingNulls).fill(null), ...Array.from({ length: totalDays }, (_, idx) => idx + 1)];
  const weeks = [];
  for (let idx = 0; idx < days.length; idx += 7) {
    weeks.push(days.slice(idx, idx + 7));
  }
  if (weeks.length > 0 && weeks[weeks.length - 1].length < 7) {
    weeks[weeks.length - 1] = [...weeks[weeks.length - 1], ...Array(7 - weeks[weeks.length - 1].length).fill(null)];
  }
  return weeks;
};

const defaultForm = {
  addressType: 'HOME',
  saveAs: 'Home',
  houseFloor: '',
  towerBlock: '',
  landmark: '',
  recipientName: '',
  recipientPhone: '',
  city: 'New Delhi',
  state: 'Delhi',
  pinCode: '',
  isDefault: false,
};

/**
 * @param {{
 *  serviceName: string;
 *  defaultPackageTitle: string;
 *  defaultPackagePrice: number;
 *  confirmationPath: string;
 *  cardGradient: string[];
 *  cardImage: import('react-native').ImageSourcePropType;
 * }} props
 */
export default function PackageBookingScreen({
  serviceName,
  defaultPackageTitle,
  defaultPackagePrice,
  confirmationPath,
  cardGradient,
  cardImage,
}) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToBag } = useOrder();
  const { addresses, loading, addAddress } = useAddresses();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedSlot, setSelectedSlot] = useState(BOOKING_TIME_SLOTS[0]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
  const [formState, setFormState] = useState(defaultForm);
  const [savingAddress, setSavingAddress] = useState(false);

  const packageTitle = String(params.packageTitle ?? defaultPackageTitle);
  const packagePrice = useMemo(() => {
    const incoming = Number(params.packagePrice ?? defaultPackagePrice);
    return Number.isFinite(incoming) ? incoming : defaultPackagePrice;
  }, [defaultPackagePrice, params.packagePrice]);

  const selectedAddress = useMemo(
    () => addresses.find((item) => item._id === selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressId(null);
      return;
    }
    const existing = addresses.find((item) => item._id === selectedAddressId);
    if (existing) return;
    const preferred = addresses.find((item) => item.isDefault) ?? addresses[0];
    setSelectedAddressId(preferred?._id ?? null);
  }, [addresses, selectedAddressId]);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    [currentMonth]
  );

  const weekRows = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);

  const selectedDateLabel = useMemo(() => {
    const humanDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    return `${humanDate} - ${selectedSlot}`;
  }, [selectedDate, selectedSlot]);

  const openCreateAddress = () => {
    setFormState(defaultForm);
    setFormVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!formState.saveAs.trim()) {
      Alert.alert('Validation', 'Save address as is required.');
      return;
    }
    if (!formState.houseFloor.trim()) {
      Alert.alert('Validation', 'House number / floor is required.');
      return;
    }
    if (!formState.recipientName.trim()) {
      Alert.alert('Validation', 'Your name is required.');
      return;
    }
    if (!formState.recipientPhone.trim()) {
      Alert.alert('Validation', 'Your phone number is required.');
      return;
    }

    setSavingAddress(true);
    try {
      const payload = {
        ...formState,
        addressType: formState.addressType,
        saveAs: formState.saveAs.trim(),
        houseFloor: formState.houseFloor.trim(),
        towerBlock: formState.towerBlock.trim(),
        landmark: formState.landmark.trim(),
        recipientName: formState.recipientName.trim(),
        recipientPhone: formState.recipientPhone.trim(),
        city: formState.city.trim() || 'New Delhi',
        state: formState.state.trim() || 'Delhi',
        pinCode: formState.pinCode.trim(),
      };

      const saved = await addAddress(payload);

      setSelectedAddressId(saved?._id ?? null);
      setFormVisible(false);
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? 'Failed to save address';
      Alert.alert('Error', message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleAddToBag = () => {
    if (!selectedAddress) {
      Alert.alert('Address required', 'Please add/select an address first.');
      return;
    }

    const slotHour = SLOT_TO_HOUR[selectedSlot] ?? 9;
    const eventDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      slotHour,
      0,
      0
    ).toISOString();
    const addressDetail = buildAddressLine(selectedAddress);

    addToBag({
      artistId: params.artistId ? String(params.artistId) : undefined,
      serviceName,
      packageTitle,
      price: packagePrice,
      dateTime: selectedDateLabel,
      date: eventDate,
      slot: selectedSlot,
      addressId: selectedAddress._id,
      addressLabel: selectedAddress.saveAs,
      addressDetail,
      address: addressDetail,
      city: selectedAddress.city,
      pinCode: selectedAddress.pinCode,
      recipientName: selectedAddress.recipientName,
      recipientPhone: selectedAddress.recipientPhone,
      gradient: cardGradient,
      image: cardImage,
    });

    router.push({
      pathname: confirmationPath,
      params: {
        packageTitle,
        packagePrice: String(packagePrice),
        dateLabel: selectedDateLabel,
        addressLine: addressDetail,
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
          <View style={styles.iconButton} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[textVariants.body1, styles.sectionTitle]}>Your address</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={openCreateAddress}>
            <Text style={[textVariants.body2, styles.addAddress]}>+ Add new address</Text>
          </TouchableOpacity>
        </View>

        {loading ? <Text style={[textVariants.body3, styles.infoText]}>Loading addresses...</Text> : null}
        {addresses.length === 0 && !loading ? (
          <View style={styles.emptyAddressCard}>
            <Text style={[textVariants.body3, styles.infoText]}>
              No address saved yet. Add your address to continue booking.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.addressRow}>
              {addresses.map((item) => {
                const isSelected = selectedAddressId === item._id;
                return (
                  <Pressable
                    key={item._id}
                    style={[styles.addressChip, isSelected && styles.addressChipActive]}
                    onPress={() => setSelectedAddressId(item._id)}
                  >
                    <Ionicons
                      name="location-outline"
                      size={moderateScale(16)}
                      color={isSelected ? colors.text.primary : '#5A0C0C'}
                    />
                    <Text style={[textVariants.body2, styles.addressLabel, isSelected && styles.addressLabelActive]}>
                      {item.saveAs}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {selectedAddress ? (
              <View style={styles.addressDetailCard}>
                <Text style={[textVariants.body2, styles.addressDetail]}>{buildAddressLine(selectedAddress)}</Text>
                <Text style={[textVariants.body4, styles.addressMeta]}>
                  {selectedAddress.recipientName} • {selectedAddress.recipientPhone}
                </Text>
              </View>
            ) : null}
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[textVariants.body1, styles.sectionTitle]}>Choose date</Text>
          <View style={styles.monthRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.monthArrow}
              onPress={() =>
                setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
              }
            >
              <Ionicons name="chevron-back" size={moderateScale(16)} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[textVariants.button2, styles.monthLabel]}>{monthLabel}</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.monthArrow}
              onPress={() =>
                setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
              }
            >
              <Ionicons name="chevron-forward" size={moderateScale(16)} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dayNames}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Text key={day} style={[textVariants.body3, styles.dayName]}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendar}>
          {weekRows.map((week, idx) => (
            <View key={`week-${idx}`} style={styles.weekRow}>
              {week.map((day, dayIdx) => {
                if (!day) {
                  return <View key={`empty-${idx}-${dayIdx}`} style={styles.dayCell} />;
                }
                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear();
                return (
                  <TouchableOpacity
                    key={`day-${day}`}
                    activeOpacity={0.85}
                    style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                    onPress={() =>
                      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
                    }
                  >
                    <Text style={[textVariants.body3, styles.dayText, isSelected && styles.dayTextSelected]}>
                      {String(day).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={[textVariants.body1, styles.sectionTitle, styles.timeTitle]}>Available time</Text>
        <View style={styles.timeRow}>
          {BOOKING_TIME_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                activeOpacity={0.85}
                style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                onPress={() => setSelectedSlot(slot)}
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

      <AddressFormModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        title="Add address"
        value={formState}
        onChange={(key, nextValue) => setFormState((prev) => ({ ...prev, [key]: nextValue }))}
        onSubmit={handleSaveAddress}
        submitting={savingAddress}
      />
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
  infoText: {
    color: '#6A6E75',
  },
  emptyAddressCard: {
    padding: scale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: colors.background.surface,
  },
  addressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  addressChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    borderWidth: 1,
    borderColor: '#CFCFCF',
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
  addressDetailCard: {
    marginTop: verticalScale(2),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: scale(10),
    gap: verticalScale(4),
    backgroundColor: colors.background.surface,
  },
  addressDetail: {
    color: colors.text.primary,
  },
  addressMeta: {
    color: '#6A6E75',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '82%',
    backgroundColor: colors.background.base,
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: colors.text.primary,
  },
  formBody: {
    gap: verticalScale(10),
    paddingBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(11),
    color: colors.text.primary,
    backgroundColor: colors.background.surface,
  },
  saveButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(22),
    paddingVertical: verticalScale(13),
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#B1B4BB',
  },
  saveButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
});
