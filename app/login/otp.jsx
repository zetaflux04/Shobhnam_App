import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

export default function OTPScreen() {
  const { phone, name } = useLocalSearchParams();
  const { login } = useAuth();

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const maskedPhone = useMemo(() => {
    if (!phone) return '******';
    const digits = String(phone).replace(/\D/g, '');
    const suffix = digits.slice(-4).padStart(4, '*');
    return `******${suffix}`;
  }, [phone]);

  const canSubmit = otp.every((d) => d.length === 1);
  const hasPhone = !!phone;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resendOtp = useCallback(async () => {
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

  const handleSubmit = async () => {
    if (!canSubmit || !phone) return;
    const otpStr = otp.join('');

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp/user', {
        phone,
        otp: otpStr,
        name: name || undefined,
      });
      const { user, accessToken } = res.data?.data ?? {};
      if (user && accessToken) {
        await login(user, accessToken);
        router.replace('/(tabs)/service');
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

  if (!hasPhone) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={[textVariants.body2, styles.title]}>Phone number required</Text>
          <Text style={[textVariants.body3, styles.subtitle]}>Please enter your phone number first.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()} activeOpacity={0.9}>
            <Text style={[textVariants.button1, styles.buttonText]}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <Image source={require('../../assets/images/splash.png')} style={styles.logo} resizeMode="contain" />
          <Text style={[textVariants.heading4, styles.brandName]}>Shobhnam</Text>
        </View>

        <View style={styles.form}>
          <Text style={[textVariants.heading1, styles.title]}>We’ve sent you a code</Text>
          <Text style={[textVariants.body1, styles.subtitle]}>
            Please enter the code sent on <Text style={styles.link}>{maskedPhone}</Text>
          </Text>

          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => {
                  if (ref) inputRefs.current[idx] = ref;
                }}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(val) => updateDigit(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                autoFocus={idx === 0}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.resend}
            onPress={resendOtp}
            activeOpacity={0.8}
            disabled={resendCooldown > 0 || loading}
          >
            <Text
              style={[
                textVariants.body2,
                styles.link,
                (resendCooldown > 0 || loading) && styles.resendDisabled,
              ]}
            >
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={canSubmit && !loading ? 0.9 : 1}
          style={[styles.button, canSubmit && !loading ? styles.buttonPrimary : styles.buttonDisabled]}
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
    gap: verticalScale(12),
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.primary,
  },
  link: {
    color: '#0D63C7',
    fontFamily: 'Inter_600SemiBold',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
  },
  otpInput: {
    width: moderateScale(46),
    height: verticalScale(54),
    borderWidth: scale(1),
    borderColor: '#7A201A',
    borderRadius: moderateScale(8),
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: colors.text.primary,
  },
  resend: {
    marginTop: verticalScale(6),
  },
  resendDisabled: {
    opacity: 0.6,
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
    backgroundColor: '#EAEAEA',
  },
  buttonText: {
    color: colors.text.inverse,
  },
  buttonDisabledText: {
    color: '#B3B3B3',
  },
});
