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

export default function ArtistPhoneScreen() {
  const params = useLocalSearchParams();
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
        pathname: '/artist/otp',
        params: { phone: phoneE164, name: params.name },
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
        <View style={[styles.contentBlock, keyboardVisible && styles.contentBlockCompact]}>
          <View style={[styles.form, keyboardVisible && styles.formCompact]}>
          <Text style={[keyboardVisible ? textVariants.loginHeadingCompact : textVariants.loginHeading, styles.title]}>Let’s stay{'\n'}connected</Text>
          <Text style={[keyboardVisible ? textVariants.body2 : textVariants.body1, styles.subtitle]}>Enter your phone number</Text>

          <View style={[styles.phoneField, keyboardVisible && styles.phoneFieldCompact]}>
            <View style={[styles.countrySection, keyboardVisible && styles.countrySectionCompact]}>
              <Text style={[textVariants.body2, styles.countryText]}>IN +91</Text>
            </View>
            <View style={styles.divider} />
            <TextInput
              placeholder="9876 543 210"
              placeholderTextColor={colors.placeholder}
              style={[styles.phoneInput, keyboardVisible && styles.phoneInputCompact]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={14}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.replace('/')}
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
    gap: verticalScale(14),
  },
  contentBlockCompact: {
    gap: verticalScale(8),
  },
  form: {
    gap: verticalScale(8),
  },
  formCompact: {
    gap: verticalScale(4),
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.primary,
  },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: verticalScale(6),
    borderWidth: scale(1),
    borderColor: colors.brand.maroonLight,
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  phoneFieldCompact: {
    marginTop: verticalScale(4),
  },
  countrySection: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    minWidth: scale(70),
  },
  countrySectionCompact: {
    paddingVertical: verticalScale(8),
  },
  countryText: {
    color: colors.brand.link,
  },
  divider: {
    width: scale(1),
    backgroundColor: colors.brand.maroonLight,
    alignSelf: 'stretch',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  phoneInputCompact: {
    paddingVertical: verticalScale(8),
    fontSize: moderateScale(14),
  },
  skip: {
    alignItems: 'center',
  },
  skipText: {
    color: colors.brand.link,
    textDecorationLine: 'underline',
  },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
    height: verticalScale(44),
    borderRadius: moderateScale(22),
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
