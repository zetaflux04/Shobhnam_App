import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useAuth } from '../../context/AuthContext';
import { buildAddressLine, useAddresses } from '../../context/AddressContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';
import AddressFormModal from '../../components/address/AddressFormModal';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * @param {{ icon: string; label: string; showSwitch?: boolean; switchValue?: boolean; onToggle?: () => void; onPress?: () => void }} props
 */
function SettingRow({
  icon,
  label,
  showSwitch,
  switchValue,
  onToggle,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={showSwitch ? 1 : 0.85}
      style={styles.row}
      onPress={showSwitch ? undefined : onPress}
      disabled={showSwitch}
    >
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={moderateScale(18)} color="#5A0C0C" />
        </View>
        <Text style={[textVariants.body1, styles.rowLabel]}>{label}</Text>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: '#E7E1E1', true: '#5A0C0C' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={moderateScale(18)} color="#6A6E75" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userType, login, logout } = useAuth();
  const { addresses, loading: loadingAddresses, editAddress, removeAddress } = useAddresses();
  const isArtistAuth = userType === 'artist';

  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name ?? '—',
    hasOtherProfile: false,
    rating: 0,
    ordersCompleted: 0,
    totalEarning: 0,
  });
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [manageSheetVisible, setManageSheetVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressType: 'HOME',
    saveAs: 'Home',
    houseFloor: '',
    towerBlock: '',
    landmark: '',
    recipientName: user?.name ?? '',
    recipientPhone: user?.phone ?? '',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '',
    isDefault: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meEndpoint = isArtistAuth ? '/artists/me' : '/users/me';
        const bookingsEndpoint = isArtistAuth ? '/bookings/artist' : '/bookings/user';
        const [meRes, bookingsRes, dualRes] = await Promise.all([
          api.get(meEndpoint),
          api.get(bookingsEndpoint).catch(() => ({ data: { data: [] } })),
          api.get('/auth/has-dual-profile').catch(() => ({ data: { data: { hasDualProfile: false } } })),
        ]);
        const u = meRes.data?.data;
        const bookings = Array.isArray(bookingsRes.data?.data) ? bookingsRes.data.data : [];
        const completed = bookings.filter((b) => b.status === 'COMPLETED');
        const totalEarning = completed.reduce((sum, b) => sum + (b.pricing?.agreedPrice ?? 0), 0);
        const hasDualProfile = dualRes.data?.data?.hasDualProfile ?? false;

        setProfile((prev) => ({
          ...prev,
          name: u?.name ?? user?.name ?? prev.name,
          hasOtherProfile: hasDualProfile,
          ordersCompleted: bookings.length,
          totalEarning,
        }));
        setBookings(bookings);
      } catch {
        setProfile((prev) => ({ ...prev, name: user?.name ?? prev.name }));
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.name, isArtistAuth]);

  const isArtist = isArtistAuth;
  const isSwitchAction = profile.hasOtherProfile;

  const ctaLabel = useMemo(() => {
    if (isArtist) {
      return profile.hasOtherProfile ? 'Switch profile' : 'Join as user';
    }
    return profile.hasOtherProfile ? 'Switch profile' : 'Join as artist';
  }, [isArtist, profile.hasOtherProfile]);

  const ctaIcon = isSwitchAction ? 'swap-horizontal' : 'person-add-outline';

  const ctaBackground = useMemo(() => {
    if (isArtist) {
      return colors.background.surface;
    }
    return isSwitchAction ? 'transparent' : '#5A0C0C';
  }, [isArtist, isSwitchAction]);

  const ctaBorderColor = useMemo(() => {
    if (isArtist) {
      return 'transparent';
    }
    return '#5A0C0C';
  }, [isArtist]);

  const ctaTextColor = useMemo(() => {
    if (isArtist) {
      return '#5A0C0C';
    }
    return isSwitchAction ? '#5A0C0C' : colors.text.inverse;
  }, [isArtist, isSwitchAction]);

  const stats = [
    {
      label: 'Rating',
      value: profile.rating > 0 ? profile.rating.toFixed(1) : '—',
      icon: <Ionicons name="star" size={moderateScale(16)} color="#D29B1B" />,
    },
    {
      label: 'Orders completed',
      value: profile.ordersCompleted.toLocaleString('en-IN'),
      icon: <Ionicons name="checkbox" size={moderateScale(16)} color="#2BD697" />,
    },
    {
      label: 'Total earning',
      value: formatCurrency(profile.totalEarning),
      icon: <MaterialCommunityIcons name="hand-coin-outline" size={moderateScale(16)} color="#C89100" />,
    },
  ];

  const profileSettings = [
    { icon: 'information-circle-outline', label: 'About us' },
    { icon: 'help-circle-outline', label: 'Get help' },
    ...(isArtist ? [] : [{ icon: 'location-outline', label: 'Manage address' }]),
    { icon: 'chatbox-ellipses-outline', label: 'Feedback' },
    { icon: 'moon-outline', label: 'Dark mode', switch: true },
    { icon: 'settings-outline', label: 'Account settings' },
  ];

  const legalAgreements = [
    { icon: 'document-text-outline', label: 'Disclaimer' },
    { icon: 'lock-closed-outline', label: 'Privacy policy' },
    { icon: 'list-outline', label: 'Terms & conditions' },
    { icon: 'refresh-circle-outline', label: 'Refund & cancellation policy' },
  ];

  const onPressCta = useCallback(async () => {
    if (profile.hasOtherProfile) {
      setSwitching(true);
      try {
        const res = await api.post('/auth/switch-profile');
        const data = res.data?.data;
        if (data?.user && data?.accessToken) {
          await login(data.user, data.accessToken, 'user');
        } else if (data?.artist && data?.accessToken) {
          await login(data.artist, data.accessToken, 'artist');
        }
      } catch (err) {
        const msg = err.response?.data?.message ?? err.message ?? 'Failed to switch profile';
        Alert.alert('Error', msg);
      } finally {
        setSwitching(false);
      }
    } else {
      if (isArtist) {
        router.push('/login/name');
      } else {
        router.push('/artist/onboarding');
      }
    }
  }, [profile.hasOtherProfile, isArtist, login, router]);

  const openManageAddressSheet = () => {
    setManageSheetVisible(true);
  };

  const openEditAddress = (address) => {
    setManageSheetVisible(false);
    setEditingAddressId(address._id);
    setAddressForm({
      addressType: address.addressType ?? 'HOME',
      saveAs: address.saveAs,
      houseFloor: address.houseFloor,
      towerBlock: address.towerBlock,
      landmark: address.landmark,
      recipientName: address.recipientName,
      recipientPhone: address.recipientPhone,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      isDefault: address.isDefault,
    });
    setAddressModalVisible(true);
  };

  const saveAddress = async () => {
    if (!addressForm.saveAs.trim()) {
      Alert.alert('Validation', 'Save address as is required.');
      return;
    }
    if (!addressForm.houseFloor.trim()) {
      Alert.alert('Validation', 'House number / floor is required.');
      return;
    }
    if (!addressForm.recipientName.trim()) {
      Alert.alert('Validation', 'Your name is required.');
      return;
    }
    if (!addressForm.recipientPhone.trim()) {
      Alert.alert('Validation', 'Your phone number is required.');
      return;
    }

    setSavingAddress(true);
    try {
      const payload = {
        ...addressForm,
        addressType: addressForm.addressType,
        saveAs: addressForm.saveAs.trim(),
        houseFloor: addressForm.houseFloor.trim(),
        towerBlock: addressForm.towerBlock.trim(),
        landmark: addressForm.landmark.trim(),
        recipientName: addressForm.recipientName.trim(),
        recipientPhone: addressForm.recipientPhone.trim(),
        city: addressForm.city.trim() || 'New Delhi',
        state: addressForm.state.trim() || 'Delhi',
        pinCode: addressForm.pinCode.trim(),
      };
      if (!editingAddressId) {
        Alert.alert('Error', 'Please select an address to edit.');
        return;
      }
      await editAddress(editingAddressId, payload);
      setAddressModalVisible(false);
      if (!isArtist) {
        setManageSheetVisible(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to save address';
      Alert.alert('Error', msg);
    } finally {
      setSavingAddress(false);
    }
  };

  const confirmDeleteAddress = (addressId) => {
    Alert.alert('Delete Address?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeAddress(addressId);
          } catch (err) {
            const msg = err.response?.data?.message ?? err.message ?? 'Failed to delete address';
            Alert.alert('Error', msg);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A0C0C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, isArtist ? styles.heroArtist : styles.heroUser]}>
          <View style={styles.heroTop}>
            <View style={styles.heroInfo}>
              <Image
                source={{ uri: user?.profilePhoto ?? DEFAULT_AVATAR }}
                style={styles.avatar}
              />
              <View>
                <Text style={[textVariants.heading4, styles.heroName, isArtist && styles.heroNameInverse]}>
                  {profile.name}
                </Text>
                <Text style={[textVariants.body3, styles.heroSubtitle, isArtist && styles.heroSubtitleInverse]}>
                  {isArtist ? 'Artist profile' : user?.city ? `${user.city} · User` : 'User profile'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.ctaButton,
                { backgroundColor: ctaBackground, borderColor: ctaBorderColor },
                !isArtist && isSwitchAction ? styles.ctaOutline : undefined,
              ]}
              onPress={onPressCta}
              disabled={switching}
            >
              {switching ? (
                <ActivityIndicator size="small" color={ctaTextColor} />
              ) : (
                <>
                  <Ionicons
                    name={ctaIcon}
                    size={moderateScale(16)}
                    color={ctaTextColor}
                    style={styles.ctaIcon}
                  />
                  <Text style={[textVariants.button2, { color: ctaTextColor }]}>{ctaLabel}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, styles.statsCard]}>
          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1;
            return (
              <View key={stat.label} style={[styles.statItem, !isLast && styles.statDivider]}>
                <View style={styles.statValueRow}>
                  {stat.icon}
                  <Text style={[textVariants.heading4, styles.statValue]}>{stat.value}</Text>
                </View>
                <Text style={[textVariants.body3, styles.statLabel]}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>Profile settings</Text>
          <View style={styles.card}>
            {profileSettings.map((item, idx) => (
              <View key={item.label}>
                <SettingRow
                  icon={item.icon}
                  label={item.label}
                  showSwitch={item.switch}
                  switchValue={item.switch ? darkMode : undefined}
                  onToggle={item.switch ? () => setDarkMode((prev) => !prev) : undefined}
                  onPress={item.label === 'Manage address' ? openManageAddressSheet : undefined}
                />
                {idx !== profileSettings.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {isArtist && (
          <>
            <View style={styles.section}>
              <Text style={[textVariants.heading4, styles.sectionTitle]}>Artist address</Text>
              <View style={styles.card}>
                <Text style={[textVariants.body3, styles.readOnlyAddress]}>
                  {user?.serviceLocation ?? 'Address not provided'}
                </Text>
                <Text style={[textVariants.body5, styles.readOnlyNote]}>Read only</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[textVariants.heading4, styles.sectionTitle]}>Customer addresses</Text>
              <View style={styles.card}>
                {bookings.length === 0 ? (
                  <Text style={[textVariants.body3, styles.emptyAddressText]}>No customer bookings yet.</Text>
                ) : (
                  bookings.slice(0, 5).map((booking, idx) => (
                    <View key={booking._id}>
                      <Text style={[textVariants.heading5, styles.addressTag]}>
                        {booking.user?.name ?? 'Customer'}
                      </Text>
                      <Text style={[textVariants.body3, styles.addressLine]}>
                        {booking.location?.address ?? 'Address unavailable'}
                      </Text>
                      <Text style={[textVariants.body4, styles.addressLine]}>
                        {booking.eventDetails?.date
                          ? `${new Date(booking.eventDetails.date).toLocaleDateString()} • ${booking.eventDetails?.slot ?? '—'}`
                          : 'Date unavailable'}
                      </Text>
                      {idx !== Math.min(bookings.length, 5) - 1 && <View style={styles.divider} />}
                    </View>
                  ))
                )}
              </View>
            </View>
          </>
        )}

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>Legal agreements</Text>
          <View style={styles.card}>
            {legalAgreements.map((item, idx) => (
              <View key={item.label}>
                <SettingRow icon={item.icon} label={item.label} />
                {idx !== legalAgreements.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.logoutRow} onPress={logout}>
          <Text style={[textVariants.body1, styles.logoutText]}>Log out</Text>
        </TouchableOpacity>

        <Text style={[textVariants.body5, styles.footerNote]}>
          Copyright © 2026 Shobhnam Pvt. Ltd. All rights reserved.
        </Text>
      </ScrollView>

      <AddressFormModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        title={editingAddressId ? 'Edit address' : 'Add address'}
        value={addressForm}
        onChange={(key, nextValue) => setAddressForm((prev) => ({ ...prev, [key]: nextValue }))}
        onSubmit={saveAddress}
        submitting={savingAddress}
      />

      {!isArtist && (
        <Modal
          visible={manageSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setManageSheetVisible(false)}
        >
          <View style={styles.sheetOverlay}>
            <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setManageSheetVisible(false)} />
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.closeSheetButton}
              onPress={() => setManageSheetVisible(false)}
            >
              <Ionicons name="close" size={moderateScale(20)} color="#3A3A3A" />
            </TouchableOpacity>
            <View style={styles.sheetCard}>
              <Text style={[textVariants.heading3, styles.sheetTitle]}>Manage address</Text>
              <View style={styles.divider} />
              {loadingAddresses ? (
                <ActivityIndicator size="small" color="#5A0C0C" style={styles.addressLoader} />
              ) : null}
              {!loadingAddresses && addresses.length === 0 ? (
                <Text style={[textVariants.body3, styles.emptyAddressText]}>
                  No saved addresses yet. Add from booking screen.
                </Text>
              ) : null}
              {addresses.map((address, idx) => (
                <View key={address._id}>
                  <View style={styles.addressItem}>
                    <View style={styles.addressItemTop}>
                      <Text style={[textVariants.heading5, styles.addressTag]}>{address.saveAs}</Text>
                      <View style={styles.addressActions}>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => openEditAddress(address)}>
                          <Ionicons name="create-outline" size={moderateScale(18)} color="#0C7BDE" />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.85} onPress={() => confirmDeleteAddress(address._id)}>
                          <Ionicons name="trash-outline" size={moderateScale(18)} color="#FF4D5A" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={[textVariants.body3, styles.addressLine]}>{buildAddressLine(address)}</Text>
                    <Text style={[textVariants.body4, styles.addressLine]}>{address.recipientPhone}</Text>
                  </View>
                  {idx !== addresses.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: verticalScale(32),
    gap: verticalScale(18),
  },
  hero: {
    borderRadius: moderateScale(20),
    padding: scale(18),
    gap: verticalScale(14),
  },
  heroArtist: {
    backgroundColor: '#5A0C0C',
  },
  heroUser: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: '#E4DDDD',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  avatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: '#D3D5DA',
  },
  heroName: {
    color: colors.text.primary,
  },
  heroNameInverse: {
    color: colors.text.inverse,
  },
  heroSubtitle: {
    color: '#6A6E75',
  },
  heroSubtitleInverse: {
    color: '#F2F2F2',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ctaOutline: {
    borderWidth: 1,
  },
  ctaIcon: {
    marginRight: scale(6),
  },
  card: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#ECE8E8',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    gap: scale(12),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: verticalScale(4),
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: '#ECE8E8',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  statValue: {
    color: colors.text.primary,
  },
  statLabel: {
    color: '#6A6E75',
  },
  section: {
    gap: verticalScale(8),
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  rowIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    backgroundColor: '#F8F2F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1EEEE',
  },
  addressLoader: {
    marginVertical: verticalScale(12),
  },
  emptyAddressText: {
    color: '#6A6E75',
    paddingVertical: verticalScale(8),
  },
  addressItem: {
    paddingVertical: verticalScale(8),
    gap: verticalScale(4),
  },
  addressItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(14),
  },
  addressTag: {
    color: colors.text.primary,
  },
  addressLine: {
    color: '#4F545C',
  },
  readOnlyAddress: {
    color: colors.text.primary,
  },
  readOnlyNote: {
    marginTop: verticalScale(4),
    color: '#8A8E95',
  },
  logoutRow: {
    paddingVertical: verticalScale(10),
  },
  logoutText: {
    color: '#BC2A2A',
  },
  footerNote: {
    color: '#8A8E95',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeSheetButton: {
    alignSelf: 'center',
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(10),
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
  sheetTitle: {
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
  modalBody: {
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
  modalSaveButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(22),
    paddingVertical: verticalScale(13),
    alignItems: 'center',
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#B1B4BB',
  },
  modalSaveText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
});
