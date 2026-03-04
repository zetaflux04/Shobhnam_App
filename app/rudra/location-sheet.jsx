import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { setAddressSaved } from '../../utils/addressSession';
import { colors, textVariants } from '../../styles/theme';

export default function RudraLocationSheet() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.overlay} />
      <View style={styles.sheet}>
        <TouchableOpacity style={styles.closeButton} activeOpacity={0.85} onPress={() => router.back()}>
          <Ionicons name="close" size={moderateScale(18)} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.illustrationRow}>
          <Ionicons name="business-outline" size={moderateScale(26)} color="#5A0C0C" />
          <Ionicons name="home-outline" size={moderateScale(26)} color="#5A0C0C" />
          <Ionicons name="map-outline" size={moderateScale(26)} color="#5A0C0C" />
        </View>
        <Text style={[textVariants.heading4, styles.title]}>Enter your event venue</Text>
        <Text style={[textVariants.body3, styles.subtitle]}>This will help us find best artists near you</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryButton}
          onPress={() => {
            setAddressSaved();
            router.push('/rudra/location-search');
          }}
        >
          <Text style={[textVariants.button1, styles.primaryButtonText]}>Another location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.secondaryButton}
          onPress={() => {
            setAddressSaved();
            router.back();
          }}
        >
          <Ionicons name="locate" size={moderateScale(16)} color="#5A0C0C" />
          <Text style={[textVariants.button2, styles.secondaryButtonText]}>Use current location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.background.base,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  closeButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationRow: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(4),
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: '#6A6E75',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(22),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(22),
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text.inverse,
  },
  secondaryButton: {
    marginTop: verticalScale(4),
    borderRadius: moderateScale(22),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    flexDirection: 'row',
    gap: scale(6),
  },
  secondaryButtonText: {
    color: '#5A0C0C',
  },
});
