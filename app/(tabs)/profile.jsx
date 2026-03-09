import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

/**
 * @param {{ icon: string; label: string; showSwitch?: boolean; switchValue?: boolean; onToggle?: () => void }} props
 */
function SettingRow({
  icon,
  label,
  showSwitch,
  switchValue,
  onToggle,
}) {
  return (
    <View style={styles.row}>
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
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userType, login, logout } = useAuth();
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
      } catch {
        setProfile((prev) => ({ ...prev, name: user?.name ?? prev.name }));
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
                />
                {idx !== profileSettings.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

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
});
