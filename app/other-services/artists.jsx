import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { getServiceById, otherServiceArtists } from '../../constants/otherServices';
import { colors, textVariants } from '../../styles/theme';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function OtherServicesArtists() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();

  const service = getServiceById(serviceId);
  const serviceTitle = service?.title ?? 'Light, sound and tent crew.';

  const handleArtistPress = (artist) => {
    router.push({
      pathname: '/other-services/profile',
      params: { artistId: artist.id, serviceId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.headerTitle]} numberOfLines={1}>
          {serviceTitle.replace(/\.$/, '')}
        </Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
          <Ionicons name="search" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <Text style={[textVariants.body1, styles.chooseLabel]}>Choose your artist</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.filterButton}>
          <Ionicons name="options-outline" size={moderateScale(16)} color={colors.text.primary} />
          <Text style={[textVariants.body3, styles.filterText]}>Filters</Text>
          <Ionicons name="chevron-down" size={moderateScale(14)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.artistList} showsVerticalScrollIndicator={false}>
        {otherServiceArtists.map((artist) => (
          <TouchableOpacity
            key={artist.id}
            activeOpacity={0.9}
            style={styles.artistRow}
            onPress={() => handleArtistPress(artist)}
          >
            <Image source={artist.image} style={styles.artistImage} />
            <View style={styles.artistInfo}>
              <View style={styles.artistNameRow}>
                <Text style={[textVariants.heading5, styles.artistName]} numberOfLines={1}>
                  {artist.name}
                </Text>
                {artist.verified ? (
                  <Ionicons name="checkmark-circle" size={moderateScale(14)} color="#B31A1A" />
                ) : null}
              </View>
              <Text style={[textVariants.body3, styles.artistMeta]}>
                Exp: {artist.experience} <Ionicons name="star" size={moderateScale(12)} color="#D29B1B" /> {artist.rating.toFixed(1)}
              </Text>
              <Text style={[textVariants.body3, styles.artistMeta]}>
                Lang: {artist.languages.join(', ')}
              </Text>
              <Text style={[textVariants.caption4, styles.viewProfile]}>View profile</Text>
            </View>
            <View style={styles.artistRight}>
              <Text style={[textVariants.heading5, styles.artistPrice]}>{formatCurrency(artist.price)}</Text>
              <Text style={[textVariants.caption4, styles.artistDistance]}>{artist.distance}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: verticalScale(24) }} />
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
  },
  headerTitle: {
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: scale(8),
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  chooseLabel: {
    color: '#6A6E75',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
    backgroundColor: colors.background.surface,
  },
  filterText: {
    color: colors.text.primary,
  },
  artistList: {
    paddingHorizontal: scale(16),
    gap: verticalScale(10),
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  artistImage: {
    width: scale(56),
    height: scale(56),
    borderRadius: moderateScale(28),
  },
  artistInfo: {
    flex: 1,
    gap: verticalScale(2),
  },
  artistNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  artistName: {
    color: colors.text.primary,
  },
  artistMeta: {
    color: '#6A6E75',
  },
  viewProfile: {
    color: '#6A6E75',
    marginTop: verticalScale(4),
  },
  artistRight: {
    alignItems: 'flex-end',
    gap: verticalScale(4),
  },
  artistPrice: {
    color: colors.text.primary,
  },
  artistDistance: {
    color: '#B02B2B',
  },
});
