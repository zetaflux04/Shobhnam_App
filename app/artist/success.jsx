import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

export default function ArtistSuccessScreen() {
  const steps = ['Applied', 'Account setup', 'Verified', 'All done'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={moderateScale(30)} color={colors.text.inverse} />
        </View>

        <Text style={[textVariants.heading3, styles.title]}>Application successful!</Text>
        <Text style={[textVariants.body1, styles.subtitle]}>
          Thank you for applying! We will reach back to you within 2-3 business days.
        </Text>

        <View style={styles.progress}>
          <Text style={[textVariants.body3, styles.progressLabel]}>Application progress</Text>

          <View style={styles.progressRow}>
            {steps.map((step, index) => {
              const active = index === 0;
              return (
                <View key={step} style={styles.progressItem}>
                  <View style={[styles.progressDot, active ? styles.dotActive : styles.dotInactive]} />
                  <Text style={[textVariants.caption5, active ? styles.progressTextActive : styles.progressTextInactive]}>
                    {step}
                  </Text>
                  {index < steps.length - 1 && (
                    <View style={[styles.progressLine, active ? styles.lineActive : styles.lineInactive]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.button} activeOpacity={0.9} onPress={() => router.replace('/')}>
          <Text style={[textVariants.button1, styles.buttonText]}>CONTINUE</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    gap: verticalScale(14),
  },
  badge: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(6),
  },
  title: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text.primary,
    textAlign: 'center',
  },
  progress: {
    width: '100%',
    marginTop: verticalScale(4),
    gap: verticalScale(10),
  },
  progressLabel: {
    color: colors.text.primary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  progressDot: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
  },
  dotActive: {
    backgroundColor: '#5A0C0C',
  },
  dotInactive: {
    backgroundColor: '#D8D8D8',
  },
  progressTextActive: {
    color: '#5A0C0C',
  },
  progressTextInactive: {
    color: '#B3B3B3',
  },
  progressLine: {
    width: scale(28),
    height: scale(2),
  },
  lineActive: {
    backgroundColor: '#5A0C0C',
  },
  lineInactive: {
    backgroundColor: '#D8D8D8',
  },
  button: {
    marginTop: verticalScale(10),
    width: '100%',
    height: verticalScale(54),
    borderRadius: moderateScale(27),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text.inverse,
  },
});
