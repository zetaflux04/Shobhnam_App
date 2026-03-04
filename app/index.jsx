import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../styles/theme';

const roles = [
  {
    key: 'artist',
    title: 'Join as Artist.',
    description: 'If you want to offer services to the multiple users.',
    image: require('../assets/images/artist-1.jpg'),
  },
  {
    key: 'user',
    title: 'Join as User.',
    description: 'If you want to enjoy the service from variety of artists.',
    image: require('../assets/images/artist-2.jpg'),
  },
];

export default function RoleSelectionScreen() {
  const [selected, setSelected] = useState(null);

  const doneEnabled = useMemo(() => selected !== null, [selected]);

  const handleProceed = () => {
    if (selected === 'user') {
      router.push('/onboarding');
      return;
    }

    if (selected === 'artist') {
      router.push('/artist/onboarding');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[textVariants.heading1, styles.headerTitle]}>Choose your role</Text>
          <Text style={[textVariants.body1, styles.headerSubtitle]}>
            Join as <Text style={styles.emphasis}>Artist</Text> or join as <Text style={styles.emphasis}>User</Text>...
          </Text>
        </View>

        <View style={styles.cards}>
          {roles.map((role) => {
            const isSelected = selected === role.key;
            const showCheck = isSelected;

            return (
              <TouchableOpacity
                key={role.key}
                activeOpacity={0.85}
                style={styles.cardShadow}
                onPress={() => setSelected(role.key)}
              >
                <ImageBackground source={role.image} style={styles.card} imageStyle={styles.cardImage}>
                  <LinearGradient
                    colors={['rgba(92,14,14,0.78)', 'rgba(92,14,14,0.35)']}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={styles.overlay}
                  />
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={[textVariants.heading3, styles.cardTitle]}>{role.title}</Text>
                      {showCheck ? (
                        <View style={styles.checkCircle}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={[textVariants.body2, styles.cardDescription]}>{role.description}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={doneEnabled ? 0.9 : 1}
          onPress={handleProceed}
          style={[styles.button, doneEnabled ? styles.buttonPrimary : styles.buttonDisabled]}
        >
          <Text style={[textVariants.button1, doneEnabled ? styles.buttonText : styles.buttonDisabledText]}>DONE</Text>
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
  content: {
    padding: scale(20),
    paddingBottom: verticalScale(32),
    gap: verticalScale(18),
  },
  header: {
    gap: verticalScale(6),
  },
  headerTitle: {
    color: colors.text.primary,
  },
  headerSubtitle: {
    color: colors.text.primary,
  },
  emphasis: {
    fontFamily: 'Inter_600SemiBold',
  },
  cards: {
    gap: verticalScale(16),
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(12),
    elevation: moderateScale(6),
  },
  card: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    height: verticalScale(190),
    backgroundColor: colors.neutral.softDarkish,
  },
  cardImage: {
    borderRadius: moderateScale(16),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    padding: scale(16),
    justifyContent: 'flex-end',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(6),
  },
  cardTitle: {
    color: colors.text.inverse,
  },
  cardDescription: {
    color: colors.text.inverse,
  },
  checkCircle: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.text.inverse,
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(24),
  },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#5A0C0C',
  },
  buttonDisabled: {
    backgroundColor: colors.neutral.grey2,
  },
  buttonText: {
    color: colors.text.inverse,
  },
  buttonDisabledText: {
    color: '#9EA3A9',
  },
});
