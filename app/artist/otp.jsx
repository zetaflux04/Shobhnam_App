import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, InteractionManager, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import LoginScreenLayout from '../../components/LoginScreenLayout';
import { useAuth } from '../../context/AuthContext';
import { useKeyboardVisible } from '../../context/KeyboardContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

export default function ArtistOTPScreen() {
  const { phone, name } = useLocalSearchParams();
  const { login } = useAuth();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const keyboardVisible = useKeyboardVisible();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      inputRefs.current[0]?.focus();
    });

    return () => {
      interaction.cancel?.();
    };
  }, []);

  const maskedPhone = useMemo(() => {
    if (!phone) return '******';
    const digits = phone.replace(/\D/g, '');
    const suffix = digits.slice(-4).padStart(4, '*');
    return `******${suffix}`;
  }, [phone]);

  const canSubmit = otp.every((d) => d.length === 1);

  const updateDigit = (value, index) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = useCallback(async () => {
    if (!phone || resendCooldown > 0) return;
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to resend OTP';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }, [phone, resendCooldown]);

  const handleSubmit = async () => {
    if (!canSubmit || !phone) return;
    const otpString = otp.join('');

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp/artist', { phone, otp: otpString, name: name || undefined });
      const { artist, accessToken } = res.data?.data ?? {};
      if (artist && accessToken) {
        await login(artist, accessToken, 'artist');
        router.replace('/artist/details');
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Invalid or expired OTP';
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
          <Text style={[keyboardVisible ? textVariants.loginHeadingCompact : textVariants.loginHeading, styles.title]}>We’ve sent{'\n'}you a code</Text>
          <Text style={[keyboardVisible ? textVariants.body2 : textVariants.body1, styles.subtitle]}>
            Please enter the code sent on <Text style={styles.link}>{maskedPhone}</Text>
          </Text>

          <View style={[styles.otpRow, keyboardVisible && styles.otpRowCompact]}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => {
                  if (ref) inputRefs.current[idx] = ref;
                }}
                style={[styles.otpInput, keyboardVisible && styles.otpInputCompact]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(val) => updateDigit(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.resend, keyboardVisible && styles.resendCompact]}
            onPress={handleResend}
            activeOpacity={0.8}
            disabled={resendCooldown > 0 || loading}
          >
            <Text style={[textVariants.body2, styles.link, (resendCooldown > 0 || loading) && styles.resendDisabled]}>
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={canSubmit && !loading ? 0.9 : 1}
            style={[styles.button, canSubmit && !loading ? styles.buttonPrimary : styles.buttonDisabled, keyboardVisible && styles.buttonCompact]}
            onPress={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={[textVariants.button1, canSubmit ? styles.buttonText : styles.buttonDisabledText]}>DONE</Text>
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
    gap: verticalScale(6),
  },
  form: {
    gap: verticalScale(10),
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
  link: {
    color: colors.brand.link,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  otpRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginTop: verticalScale(8),
  },
  otpRowCompact: {
    marginTop: verticalScale(6),
  },
  otpInput: {
    flex: 1,
    aspectRatio: 1,
    minWidth: 0,
    borderWidth: scale(1),
    borderColor: colors.brand.maroonLight,
    borderRadius: moderateScale(8),
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: colors.text.primary,
  },
  otpInputCompact: {
    fontSize: moderateScale(14),
  },
  resend: {
    marginTop: verticalScale(6),
    alignSelf: "center",
  },
  resendCompact: {
    marginTop: verticalScale(4),
  },
  resendDisabled: {
    opacity: 0.6,
  },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCompact: {
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
