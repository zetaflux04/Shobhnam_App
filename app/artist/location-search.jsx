import { router } from 'expo-router';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

export default function LocationSearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={styles.back}>
            <Ionicons name="chevron-back" size={moderateScale(22)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.title]}>Search city and locality</Text>
        </View>

        <View style={styles.searchCard}>
          <Ionicons name="search" size={moderateScale(18)} color="#7D7D7D" />
          <TextInput
            placeholder="Search for area, street name..."
            placeholderTextColor="#7D7D7D"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity
          style={styles.currentButton}
          activeOpacity={0.9}
          onPress={() => router.push('/artist/location-map')}
        >
          <Ionicons name="location-outline" size={moderateScale(18)} color="#5A0C0C" />
          <Text style={[textVariants.button2, styles.currentText]}>USE CURRENT LOCATION</Text>
        </TouchableOpacity>

        <View style={styles.illustrationContainer}>
          <Image source={require('../../assets/images/Vector.png')} style={styles.illustration} resizeMode="contain" />
        </View>
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
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(14),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(14),
  },
  back: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: scale(1),
    borderColor: '#B5B5B5',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.neutral.white,
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    fontSize: moderateScale(14),
    color: colors.text.primary,
  },
  currentButton: {
    marginTop: verticalScale(16),
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    borderWidth: scale(1),
    borderColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },
  currentText: {
    color: '#5A0C0C',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(18),
  },
  illustration: {
    width: '100%',
    height: verticalScale(240),
  },
});
