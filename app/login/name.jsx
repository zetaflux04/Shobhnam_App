import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import LoginScreenLayout from '../../components/LoginScreenLayout';
import { useKeyboardVisible } from '../../context/KeyboardContext';
import { colors, textVariants } from '../../styles/theme';

export default function NameScreen() {
  const [name, setName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const keyboardVisible = useKeyboardVisible();

  const canSubmit = name.trim().length > 0 && agreed;

  const handleSubmit = () => {
    if (canSubmit) {
      router.push({ pathname: '/login/phone', params: { name } });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginScreenLayout>
        <View style={styles.contentBlock}>
          <View style={styles.form}>
            <Text style={[keyboardVisible ? textVariants.loginHeadingCompact : textVariants.loginHeading, styles.title]}>Hello there!</Text>
            <Text style={[textVariants.body1, styles.subtitle, keyboardVisible && styles.subtitleCompact]}>What is your good name?</Text>

            <TextInput
              placeholder="Shobhit Jakotra"
              placeholderTextColor={colors.placeholder}
              style={[styles.input, keyboardVisible && styles.inputCompact]}
              value={name}
              onChangeText={setName}
            />

            <TouchableOpacity style={[styles.checkboxRow, keyboardVisible && styles.checkboxRowCompact]} onPress={() => setAgreed((prev) => !prev)} activeOpacity={0.8}>
              <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                {agreed ? <Ionicons name="checkmark" size={moderateScale(keyboardVisible ? 12 : 14)} color={colors.text.inverse} /> : null}
              </View>
              <Text style={[textVariants.body2, styles.checkboxText]}>
                I agree with <Text style={styles.link}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.skip, keyboardVisible && styles.skipCompact]}
            onPress={() => router.push({ pathname: '/login/phone', params: { name } })}
            activeOpacity={0.8}
          >
            <Text style={[textVariants.body2, styles.skipText]}>Skip onboarding</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={canSubmit ? 0.9 : 1}
            style={[styles.button, canSubmit ? styles.buttonPrimary : styles.buttonDisabled, keyboardVisible && styles.buttonCompact]}
            onPress={handleSubmit}
          >
            <Text style={[textVariants.button1, canSubmit ? styles.buttonText : styles.buttonDisabledText]}>SUBMIT</Text>
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
  input: {
    height: verticalScale(56),
    borderWidth: scale(1),
    borderColor: colors.brand.maroon,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(16),
    paddingVertical: 0,
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
    color: colors.text.primary,
    backgroundColor: colors.neutral.white,
  },
  inputCompact: {
    marginTop: verticalScale(12),
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    marginTop: verticalScale(12),
  },
  checkboxRowCompact: {
    marginTop: verticalScale(8),
  },
  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: colors.brand.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: colors.brand.maroon,
  },
  checkboxText: {
    color: colors.text.primary,
    fontSize: moderateScale(12),
  },
  link: {
    color: colors.brand.link,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
  skip: {
    alignItems: 'center',
    marginTop: verticalScale(30),
  },
  skipCompact: {
    marginTop: verticalScale(12),
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
    marginTop: verticalScale(12),
    height: verticalScale(48),
    borderRadius: moderateScale(24),
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
