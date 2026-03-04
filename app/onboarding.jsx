import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../styles/theme';

const steps = [
  {
    icon: <Ionicons name="hand-left-outline" size={moderateScale(20)} color="white" />,
    title: 'Step 1',
    subtitle: 'Select your service.',
  },
  {
    icon: <Ionicons name="person-circle-outline" size={moderateScale(20)} color="white" />,
    title: 'Step 2',
    subtitle: 'Select your Artist.',
  },
  {
    icon: <MaterialCommunityIcons name="hand-coin-outline" size={moderateScale(20)} color="white" />,
    title: 'Step 3',
    subtitle: 'Pay, confirm and enjoy your booking!',
  },
];

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/onboard-1.png')} style={styles.background} resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.35)']}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.6, 1]}
        />

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={[textVariants.heading3, styles.cardTitle]}>How to use the app?</Text>

            <View style={styles.steps}>
              {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1;
                return (
                  <View key={step.title} style={styles.stepRow}>
                    <View style={styles.stepIcon}>{step.icon}</View>
                    <View style={styles.stepText}>
                      <Text style={[textVariants.heading5, styles.stepTitle]}>{step.title}</Text>
                      <Text style={[textVariants.body3, styles.stepSubtitle]}>{step.subtitle}</Text>
                    </View>
                    {!isLast && <View style={styles.dashedLine} />}
                  </View>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.nextButton} activeOpacity={0.9} onPress={() => router.push('/login/name')}>
            <Text style={[textVariants.button1, styles.nextText]}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  background: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(18),
  },
  card: {
    backgroundColor: '#6D1B1B',
    borderRadius: moderateScale(20),
    padding: scale(18),
    gap: verticalScale(12),
  },
  cardTitle: {
    color: colors.text.inverse,
  },
  steps: {
    gap: verticalScale(10),
  },
  stepRow: {
    paddingVertical: verticalScale(8),
    paddingRight: scale(6),
  },
  stepIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(4),
  },
  stepText: {
    gap: verticalScale(2),
  },
  stepTitle: {
    color: colors.text.inverse,
  },
  stepSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  dashedLine: {
    position: 'absolute',
    left: scale(19),
    right: 0,
    bottom: verticalScale(-4),
    height: verticalScale(22),
    borderLeftWidth: scale(2),
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
  },
  nextButton: {
    marginTop: verticalScale(14),
    height: verticalScale(54),
    borderRadius: moderateScale(27),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: colors.text.inverse,
  },
});
