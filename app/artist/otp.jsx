import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
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

export default function ArtistOTPScreen() {
  const { phone } = useLocalSearchParams();
  const { login } = useAuth();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

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
    if (!phone) return;
    setResending(true);
    try {
      await api.post('/auth/send-otp', { phone });
      Alert.alert('Success', 'OTP resent successfully');
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message ?? 'Failed to resend OTP';
      Alert.alert('Error', msg);
    } finally {
      setResending(false);
    }
  }, [phone]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const otpString = otp.join('');

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp/artist', { phone, otp: otpString });
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
            onPress={handleResend}
            activeOpacity={0.8}
            disabled={resending || !phone}
          >
            <Text style={[textVariants.body2, styles.link]}>
              {resending ? 'Sending...' : 'Resend OTP'}
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
    flex: 1,
    height: verticalScale(56),
    borderWidth: scale(1),
    borderColor: '#7A201A',
    borderRadius: moderateScale(8),
    textAlign: 'center',
    fontSize: moderateScale(18),
    color: colors.text.primary,
    marginHorizontal: scale(4),
  },
  resend: {
    marginTop: verticalScale(6),
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
