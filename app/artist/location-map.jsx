import { router } from 'expo-router';
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

export default function LocationMapScreen() {
  const venue = 'Vikaspuri 110037, New delhi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={styles.back}>
          <Ionicons name="chevron-back" size={moderateScale(22)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.title]}>Add address</Text>
      </View>

      <View style={styles.mapContainer}>
        <ImageBackground
          source={require('../../assets/images/map-location.png')}
          style={styles.map}
          imageStyle={styles.mapImage}
          resizeMode="cover"
        >
          <View style={styles.searchWrapper}>
            <View style={styles.searchCard}>
              <Ionicons name="search" size={moderateScale(18)} color="#7D7D7D" />
              <TextInput
                placeholder="Search for area, street name..."
                placeholderTextColor="#7D7D7D"
                style={styles.searchInput}
              />
            </View>
          </View>

          <View style={styles.pinWrapper}>
            <Ionicons name="location-sharp" size={moderateScale(34)} color="#5A0C0C" />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.venueRow}>
          <Ionicons name="location-outline" size={moderateScale(18)} color="#5A0C0C" />
          <View>
            <Text style={[textVariants.caption4, styles.venueLabel]}>Your event venue</Text>
            <Text style={[textVariants.body2, styles.venueText]} numberOfLines={1}>
              {venue}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.9}
          onPress={() => router.push({ pathname: '/artist/address', params: { venue } })}
        >
          <Text style={[textVariants.button1, styles.addButtonText]}>ADD MORE ADDRESS DETAILS</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(10),
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
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  searchWrapper: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(10),
    elevation: moderateScale(6),
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: colors.text.primary,
  },
  pinWrapper: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    transform: [{ translateY: -moderateScale(18) }],
  },
  bottomCard: {
    backgroundColor: colors.neutral.white,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(16),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    gap: verticalScale(12),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(12),
    elevation: moderateScale(10),
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  venueLabel: {
    color: colors.text.primary,
  },
  venueText: {
    color: colors.text.primary,
  },
  addButton: {
    height: verticalScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.text.inverse,
  },
});
