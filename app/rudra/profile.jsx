import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { rudraArtists, rudraReview, rudraFees } from '../../constants/rudra';
import { colors, textVariants } from '../../styles/theme';

export default function RudraArtistProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const artist = rudraArtists.find((item) => item.id === params.artistId) ?? rudraArtists[0];

  const gallery = [artist.image, require('../../assets/service/artist 2.png'), require('../../assets/service/artist 3.png')];

  const handleSelectSlot = () => {
    router.push({
      pathname: '/rudra/booking',
      params: {
        artistId: artist.id,
        packageTitle: 'Customised selection',
        packagePrice: rudraFees.base.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>Artist profile</Text>
          <TouchableOpacity activeOpacity={0.9} style={styles.iconButton}>
            <Ionicons name="share-outline" size={moderateScale(18)} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryRow}
          decelerationRate="fast"
          snapToInterval={scale(160) + scale(10)}
        >
          {gallery.map((image, idx) => (
            <Image key={`gallery-${idx}`} source={image} style={styles.galleryImage} />
          ))}
        </ScrollView>

        <View style={styles.titleBlock}>
          <View style={styles.nameRow}>
            <Text style={[textVariants.heading3, styles.artistName]}>{artist.name}</Text>
            {artist.verified ? (
              <Ionicons name="checkmark-circle" size={moderateScale(16)} color="#B31A1A" />
            ) : null}
          </View>
          <Text style={[textVariants.body3, styles.metaText]}>
            Exp: {artist.experience} |{' '}
            <Text style={styles.highlight}>
              <Ionicons name="star" size={moderateScale(14)} color="#D29B1B" /> {artist.rating.toFixed(1)} ({artist.reviews}
              +)
            </Text>
          </Text>
          <Text style={[textVariants.body3, styles.metaText]}>Language known: {artist.languages.join(', ')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>About</Text>
          <Text style={[textVariants.body3, styles.sectionBody]} numberOfLines={3}>
            Devotional Rudrabhishek performed by experienced acharayas tailored for your event.
          </Text>
          <Text style={[textVariants.body3, styles.readMore]}>Read more</Text>
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>What to expect</Text>
          <View style={styles.expectList}>
            <ExpectRow label="Get artist" description="Select your service." />
            <ExpectRow label="Enjoy performance" description="Select your performer & view details." />
            <ExpectRow label="Rating and review" description="Confirm your booking and enjoy!" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>Rating and reviews</Text>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={[textVariants.body3, styles.reviewTitle]}>{rudraReview.name}</Text>
              <Text style={[textVariants.body3, styles.reviewDate]}>{rudraReview.date}</Text>
              <View style={styles.reviewRating}>
                <Ionicons name="star" size={moderateScale(14)} color="#D29B1B" />
                <Text style={[textVariants.body3, styles.reviewTitle]}>{rudraReview.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={[textVariants.body3, styles.reviewBody]} numberOfLines={3}>
              {rudraReview.text}
            </Text>
            <Text style={[textVariants.body3, styles.readMore]}>Read more</Text>
          </View>
          <TouchableOpacity activeOpacity={0.9} style={styles.outlineButton}>
            <Text style={[textVariants.body1, styles.outlineButtonText]}>Show all 619 reviews</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.95} style={styles.primaryButton} onPress={handleSelectSlot}>
          <Text style={[textVariants.button1, styles.primaryButtonText]}>Select your slot</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * @param {{ label: string; description: string }} props
 */
function ExpectRow({ label, description }) {
  return (
    <View style={styles.expectRow}>
      <Ionicons name="checkbox-outline" size={moderateScale(18)} color="#5A0C0C" />
      <View style={{ flex: 1, gap: verticalScale(2) }}>
        <Text style={[textVariants.body3, styles.expectLabel]}>{label}</Text>
        <Text style={[textVariants.body3, styles.expectDescription]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: verticalScale(28),
    gap: verticalScale(14),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
  },
  galleryRow: {
    gap: scale(10),
    paddingVertical: verticalScale(10),
  },
  galleryImage: {
    width: scale(160),
    height: verticalScale(140),
    borderRadius: moderateScale(14),
  },
  titleBlock: {
    gap: verticalScale(4),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  artistName: {
    color: colors.text.primary,
  },
  metaText: {
    color: '#6A6E75',
  },
  highlight: {
    color: colors.text.primary,
  },
  section: {
    gap: verticalScale(8),
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  sectionBody: {
    color: '#6A6E75',
  },
  readMore: {
    color: '#5A0C0C',
  },
  expectList: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#ECE8E8',
  },
  expectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F1EEEE',
  },
  expectLabel: {
    color: colors.text.primary,
  },
  expectDescription: {
    color: '#6A6E75',
  },
  reviewCard: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#ECE8E8',
    padding: scale(12),
    gap: verticalScale(6),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    flexWrap: 'wrap',
  },
  reviewTitle: {
    color: colors.text.primary,
  },
  reviewDate: {
    color: '#6A6E75',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  reviewBody: {
    color: '#6A6E75',
  },
  outlineButton: {
    marginTop: verticalScale(6),
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: colors.text.primary,
  },
  primaryButton: {
    marginTop: verticalScale(8),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.text.inverse,
  },
});
