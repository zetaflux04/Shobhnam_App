import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import LoginScreenLayout from '../../components/LoginScreenLayout';
import { useKeyboardVisible } from '../../context/KeyboardContext';
import api from '../../lib/api';
import { getNetworkErrorMessage } from '../../config/api';
import { colors, textVariants } from '../../styles/theme';

export default function PhoneScreen() {
  const params = useLocalSearchParams();
  const nameFromOnboarding = params.name ?? '';

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const keyboardVisible = useKeyboardVisible();

  const canSubmit = useMemo(() => phone.replace(/\D/g, '').length >= 10, [phone]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const digits = phone.replace(/\D/g, '').slice(-10);
    const phoneE164 = `+91${digits}`;

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone: phoneE164 });
      router.push({
        pathname: '/login/otp',
        params: { phone: phoneE164, name: nameFromOnboarding },
      });
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
      <LoginScreenLayout>
        <View style={styles.contentBlock}>
          <View style={styles.form}>
          <Text style={[keyboardVisible ? textVariants.loginHeadingCompact : textVariants.loginHeading, styles.title]}>Let’s stay connected</Text>
          <Text style={[keyboardVisible ? textVariants.body2 : textVariants.body1, styles.subtitle, keyboardVisible && styles.subtitleCompact]}>Enter your phone number</Text>

          <View style={[styles.phoneField, keyboardVisible && styles.phoneFieldCompact]}>
            <View style={styles.countrySection}>
              <Text style={[textVariants.body2, styles.countryText]}>IN +91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              placeholder="9876 543 210"
              placeholderTextColor={colors.placeholder}
              style={styles.phoneInput}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={14}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.skip, keyboardVisible && styles.skipCompact]}
          onPress={() => router.replace('/(tabs)/service')}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={[textVariants.body2, styles.skipText]}>Skip onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={canSubmit && !loading ? 0.9 : 1}
          style={[styles.button, canSubmit && !loading ? styles.buttonPrimary : styles.buttonDisabled, keyboardVisible && styles.buttonCompact]}
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
      </LoginScreenLayout>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  contentBlock: {
    gap: 0,
  },
  form: {
    gap: 0,
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: verticalScale(8),
  },
  subtitleCompact: {
    marginTop: verticalScale(4),
  },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: verticalScale(56),
    marginTop: verticalScale(20),
    borderWidth: scale(1),
    borderColor: colors.brand.maroon,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    backgroundColor: colors.neutral.white,
  },
  phoneFieldCompact: {
    marginTop: verticalScale(10),
  },
  countrySection: {
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    minWidth: scale(70),
  },
  countryText: {
    color: colors.brand.link,
  },
  divider: {
    width: scale(1),
    backgroundColor: colors.brand.maroon,
    alignSelf: 'stretch',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: 0,
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  skip: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  skipCompact: {
    marginTop: verticalScale(10),
  },
  skipText: {
    color: colors.brand.link,
    textDecorationLine: 'underline',
  },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
  },
  buttonCompact: {
    marginTop: verticalScale(10),
    height: verticalScale(46),
    borderRadius: moderateScale(23),
  },
  buttonPrimary: {
    backgroundColor: colors.brand.maroon,
  },
  buttonDisabled: {
    backgroundColor: colors.disabledButton,
  },
  buttonText: {
    color: colors.text.inverse,
  },
  buttonDisabledText: {
    color: colors.disabledButtonText,
  },
});
