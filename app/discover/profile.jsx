import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

/**
 * @param {{ label: string; description: string; isLast?: boolean }} props
 */
function ExpectRow({ label, description, isLast }) {
  return (
    <View style={[styles.expectRow, isLast && styles.expectRowLast]}>
      <Ionicons name="checkbox-outline" size={moderateScale(18)} color="#5A0C0C" />
      <View style={styles.expectTextBlock}>
        <Text style={[textVariants.body3, styles.expectLabel]}>{label}</Text>
        <Text style={[textVariants.body3, styles.expectDescription]}>{description}</Text>
      </View>
    </View>
  );
}

export default function DiscoverArtistProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const artistId = params.artistId;

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!artistId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/artists/${artistId}`);
        setArtist(res.data?.data ?? null);
      } catch {
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [artistId]);

  const handleSelectSlot = () => {
    if (artist) {
      router.push({
        pathname: '/bhagwat-katha/booking',
        params: { artistId: artist._id },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A0C0C" />
        </View>
      </SafeAreaView>
    );
  }

  if (!artist) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={[textVariants.body2, styles.errorText]}>Artist not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={[textVariants.button2, styles.backButtonText]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const rating = artist.rating?.averageRating ?? 0;
  const reviews = artist.rating?.totalReviews ?? 0;
  const experience = artist.experienceYears ? `${artist.experienceYears} Years` : '—';
  const languages = artist.languages?.length ? artist.languages.join(', ') : '—';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.headerTitle]}>Discover artists</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
          <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleBlock}>
          <View style={styles.nameRow}>
            <Text style={[textVariants.heading3, styles.artistName]}>{artist.name}</Text>
            {artist.status === 'APPROVED' ? (
              <Ionicons name="checkmark-circle" size={moderateScale(18)} color="#5A0C0C" />
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Text style={[textVariants.body3, styles.metaText]}>Exp: {experience}</Text>
            <View style={styles.metaDivider} />
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={moderateScale(14)} color="#D29B1B" />
              <Text style={[textVariants.body3, styles.ratingText]}>
                {rating > 0 ? rating.toFixed(1) : '—'} ({reviews}+)
              </Text>
            </View>
          </View>
          <Text style={[textVariants.body3, styles.languagesText]}>
            Language known: {languages}
          </Text>
        </View>

        {artist.profilePhoto ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryRow}
          >
            <Image source={{ uri: artist.profilePhoto }} style={styles.galleryImage} />
          </ScrollView>
        ) : null}

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>About</Text>
          <Text style={[textVariants.body3, styles.sectionBody]} numberOfLines={4}>
            {artist.bio || artist.category ? `${artist.category} artist. ${artist.bio || ''}` : 'No description available.'}
          </Text>
          <TouchableOpacity activeOpacity={0.85}>
            <Text style={[textVariants.body3, styles.readMore]}>Read more</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>What to expect</Text>
          <View style={styles.expectList}>
            <ExpectRow label="Get artist" description="Select your service." />
            <ExpectRow label="Enjoy performance" description="Select your performer & view details." />
            <ExpectRow label="Rating and review" description="Confirm your booking and enjoy!" isLast />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>Rating and reviews</Text>
          <Text style={[textVariants.body3, styles.sectionBody]}>
            {reviews > 0 ? `${reviews} reviews` : 'No reviews yet'}
          </Text>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} style={styles.primaryButton} onPress={handleSelectSlot}>
          <Text style={[textVariants.button1, styles.primaryButtonText]}>SELECT YOUR SLOT</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: verticalScale(20),
  },
  titleBlock: {
    gap: verticalScale(6),
    marginBottom: verticalScale(14),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  artistName: {
    color: colors.text.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  metaText: {
    color: '#6A6E75',
  },
  metaDivider: {
    width: 1,
    height: moderateScale(14),
    backgroundColor: '#D5D5D5',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  ratingText: {
    color: colors.text.primary,
  },
  languagesText: {
    color: '#6A6E75',
  },
  galleryRow: {
    gap: scale(10),
    paddingVertical: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  galleryImage: {
    width: scale(160),
    height: verticalScale(140),
    borderRadius: moderateScale(14),
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    color: colors.text.primary,
    marginBottom: verticalScale(8),
  },
  sectionBody: {
    color: '#6A6E75',
    marginBottom: verticalScale(4),
  },
  readMore: {
    color: '#5A0C0C',
  },
  expectList: {
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#ECECEC',
    overflow: 'hidden',
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
  expectRowLast: {
    borderBottomWidth: 0,
  },
  expectTextBlock: {
    flex: 1,
    gap: 2,
  },
  expectLabel: {
    color: colors.text.primary,
  },
  expectDescription: {
    color: '#6A6E75',
  },
  reviewsRow: {
    gap: scale(12),
    paddingVertical: verticalScale(4),
  },
  reviewCard: {
    width: scale(260),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#ECECEC',
    padding: scale(12),
    gap: verticalScale(6),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
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
  reviewRatingText: {
    color: colors.text.primary,
  },
  reviewBody: {
    color: '#6A6E75',
  },
  showAllButton: {
    marginTop: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.text.primary,
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  showAllText: {
    color: colors.text.primary,
  },
  footerSpacer: {
    height: verticalScale(80),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    paddingBottom: verticalScale(28),
    backgroundColor: colors.background.base,
  },
  primaryButton: {
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(16),
  },
  errorText: {
    color: '#6A6E75',
  },
  backButton: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(20),
  },
  backButtonText: {
    color: colors.text.inverse,
  },
});
