import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import api from '../../lib/api';
import { getNetworkErrorMessage } from '../../config/api';
import { colors, textVariants } from '../../styles/theme';

export default function PhoneScreen() {
  const params = useLocalSearchParams();
  const nameFromOnboarding = params.name ?? '';

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => phone.replace(/\D/g, '').length >= 10, [phone]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const digits = phone.replace(/\D/g, '').slice(-10);
    const phoneE164 = `+91${digits}`;

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: phoneE164 });
      router.push({ pathname: '/login/otp', params: { phone: phoneE164, name: nameFromOnboarding } });
    } catch (err) {
      const isNetworkError = !err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK');
      const msg = isNetworkError
        ? getNetworkErrorMessage()
        : (err.response?.data?.message ?? err.message ?? 'Failed to send OTP');
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Image source={require('../../assets/images/splash.png')} style={styles.logo} resizeMode="contain" />
          <Text style={[textVariants.heading4, styles.brandName]}>Shobhnam</Text>
        </View>

        <View style={styles.form}>
          <Text style={[textVariants.heading1, styles.title]}>Let’s stay connected</Text>
          <Text style={[textVariants.body1, styles.subtitle]}>Enter your phone number</Text>

          <View style={styles.phoneRow}>
            <View style={styles.countryBox}>
              <Text style={[textVariants.body2, styles.countryText]}>IN +91</Text>
            </View>
            <TextInput
              placeholder="9876 543 210"
              placeholderTextColor="#A8A8A8"
              style={styles.phoneInput}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={14}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.replace('/(tabs)/service')}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={[textVariants.body2, styles.skipText]}>Skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={canSubmit && !loading ? 0.9 : 1}
          style={[styles.button, canSubmit && !loading ? styles.buttonPrimary : styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text style={[textVariants.button1, canSubmit ? styles.buttonText : styles.buttonDisabledText]}>SUBMIT</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
  },
  brand: {
    alignItems: 'center',
    marginBottom: verticalScale(18),
    gap: verticalScale(6),
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(80),
  },
  brandName: {
    color: '#7A201A',
  },
  form: {
    gap: verticalScale(10),
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.primary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginTop: verticalScale(6),
  },
  countryBox: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(8),
    borderWidth: scale(1),
    borderColor: '#7A201A',
  },
  countryText: {
    color: colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    borderWidth: scale(1),
    borderColor: '#7A201A',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  skip: {
    marginTop: verticalScale(18),
    alignItems: 'center',
  },
  skipText: {
    color: '#0D63C7',
  },
  button: {
    marginTop: 'auto',
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#5A0C0C',
  },
  buttonDisabled: {
    backgroundColor: '#DADADA',
  },
  buttonText: {
    color: colors.text.inverse,
  },
  buttonDisabledText: {
    color: '#9EA3A9',
  },
});
