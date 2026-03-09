import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const canSubmit = name.trim().length > 0 && agreed;

  const handleSubmit = () => {
    if (canSubmit) {
      router.push({ pathname: '/login/phone', params: { name } });
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
          <Text style={[textVariants.heading1, styles.title]}>Hello there!</Text>
          <Text style={[textVariants.body1, styles.subtitle]}>What is your good name?</Text>

          <TextInput
            placeholder="Shobhit Jakotra"
            placeholderTextColor="#A8A8A8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreed((prev) => !prev)} activeOpacity={0.8}>
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? <Ionicons name="checkmark" size={moderateScale(14)} color={colors.text.inverse} /> : null}
            </View>
            <Text style={[textVariants.body2, styles.checkboxText]}>
              I agree with <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.push({ pathname: '/login/phone', params: { name } })}
          activeOpacity={0.8}
        >
          <Text style={[textVariants.body2, styles.skipText]}>Skip onboarding</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={canSubmit ? 0.9 : 1}
          style={[styles.button, canSubmit ? styles.buttonPrimary : styles.buttonDisabled]}
          onPress={handleSubmit}
        >
          <Text style={[textVariants.button1, canSubmit ? styles.buttonText : styles.buttonDisabledText]}>SUBMIT</Text>
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
    marginBottom: verticalScale(20),
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
  input: {
    borderWidth: scale(1),
    borderColor: '#7A201A',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: colors.text.primary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginTop: verticalScale(6),
  },
  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: '#7A201A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.base,
  },
  checkboxChecked: {
    backgroundColor: '#7A201A',
  },
  checkboxText: {
    color: colors.text.primary,
  },
  link: {
    color: '#0D63C7',
    fontFamily: 'Inter_600SemiBold',
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
