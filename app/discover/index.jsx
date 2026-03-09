import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const DELHI_REGION = {
  latitude: 28.6519,
  longitude: 77.0497,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const getPlaceholderCoords = (index) => {
  const offsets = [[0, 0], [0.003, 0.005], [-0.002, 0.003], [0.004, -0.002], [-0.003, -0.004], [0.002, 0.006]];
  const [dLat, dLng] = offsets[index % offsets.length];
  return { latitude: DELHI_REGION.latitude + dLat, longitude: DELHI_REGION.longitude + dLng };
};

const PLACEHOLDER_IMAGE = require('../../assets/service/artist 1.png');

function ArtistMarker({ artist, isSelected, onPress }) {
  const coords = artist.latitude != null
    ? { latitude: artist.latitude, longitude: artist.longitude }
    : getPlaceholderCoords(artist._index ?? 0);
  const imgSource = artist.profilePhoto ? { uri: artist.profilePhoto } : PLACEHOLDER_IMAGE;

  return (
    <Marker coordinate={coords} onPress={() => onPress(artist)} tracksViewChanges={false}>
      <View style={[styles.markerWrapper, isSelected && styles.markerWrapperSelected]}>
        <Image source={imgSource} style={styles.markerImage} />
      </View>
    </Marker>
  );
}

function BottomSheet({ artist, onClose, onViewProfile }) {
  if (!artist) return null;

  const rating = artist.rating?.averageRating ?? 0;
  const reviews = artist.rating?.totalReviews ?? 0;
  const languages = artist.languages?.length ? artist.languages.join(', ') : '—';
  const experience = artist.experienceYears ? `${artist.experienceYears} Years` : '—';

  return (
    <View style={styles.sheetHandleBar}>
      <View style={styles.sheetHandle} />
      <View style={styles.sheetContent}>
        <View style={styles.sheetHeader}>
          <View style={styles.sheetTitleRow}>
            <Text style={[textVariants.heading4, styles.sheetArtistName]}>{artist.name}</Text>
            {artist.status === 'APPROVED' ? (
              <Ionicons name="checkmark-circle" size={moderateScale(18)} color="#5A0C0C" />
            ) : null}
          </View>
          <Text style={[textVariants.body3, styles.sheetMeta]}>Exp: {experience}</Text>
          <View style={styles.sheetRatingRow}>
            <Ionicons name="star" size={moderateScale(14)} color="#D29B1B" />
            <Text style={[textVariants.body3, styles.sheetRating]}>
              {rating > 0 ? rating.toFixed(1) : '—'} ({reviews}+)
            </Text>
          </View>
          <Text style={[textVariants.body4, styles.sheetLanguages]}>Language known: {languages}</Text>
        </View>

        {artist.profilePhoto ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sheetGallery}>
            <Image source={{ uri: artist.profilePhoto }} style={styles.sheetGalleryImage} />
          </ScrollView>
        ) : null}

        <TouchableOpacity activeOpacity={0.9} style={styles.viewProfileButton} onPress={onViewProfile}>
          <Text style={[textVariants.button2, styles.viewProfileText]}>View full profile</Text>
          <Ionicons name="chevron-forward" size={moderateScale(16)} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DiscoverArtistsScreen() {
  const router = useRouter();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get('/artists', { params: { limit: 20 } });
        const list = res.data?.data?.artists ?? [];
        setArtists(list.map((a, i) => ({ ...a, _id: a._id, _index: i })));
      } catch {
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const handleArtistPress = useCallback((artist) => {
    setSelectedArtist(artist);
    setSheetVisible(true);
  }, []);

  const handleMapPress = useCallback(() => {
    setSheetVisible(false);
    setSelectedArtist(null);
  }, []);

  const handleViewProfile = useCallback(() => {
    if (selectedArtist) {
      setSheetVisible(false);
      router.push({ pathname: '/discover/profile', params: { artistId: selectedArtist._id } });
      setSelectedArtist(null);
    }
  }, [selectedArtist, router]);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
    setSelectedArtist(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={moderateScale(22)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.title]}>Discover artists</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#5A0C0C" />
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={DELHI_REGION}
            mapType="standard"
            onPress={handleMapPress}
          >
            {artists.map((artist) => (
              <ArtistMarker
                key={artist._id}
                artist={artist}
                isSelected={selectedArtist?._id === artist._id}
                onPress={handleArtistPress}
              />
            ))}
          </MapView>
        )}
      </View>

      {sheetVisible && selectedArtist && (
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetBackdrop} onPress={handleCloseSheet} />
          <View style={styles.sheet}>
            <BottomSheet
              artist={selectedArtist}
              onClose={handleCloseSheet}
              onViewProfile={handleViewProfile}
            />
          </View>
        </View>
      )}
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
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: colors.background.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: moderateScale(36),
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.base,
  },
  markerWrapper: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    borderWidth: 2,
    borderColor: '#5A0C0C',
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
  },
  markerWrapperSelected: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    borderWidth: 3,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.background.surface,
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(16),
    maxHeight: '45%',
  },
  sheetHandleBar: {
    width: '100%',
  },
  sheetHandle: {
    width: moderateScale(40),
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D5D5D5',
    alignSelf: 'center',
    marginBottom: verticalScale(16),
  },
  sheetContent: {
    gap: verticalScale(12),
  },
  sheetHeader: {
    gap: verticalScale(4),
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  sheetArtistName: {
    color: colors.text.primary,
  },
  sheetMeta: {
    color: '#6A6E75',
  },
  sheetRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  sheetRating: {
    color: colors.text.primary,
  },
  sheetLanguages: {
    color: '#6A6E75',
  },
  sheetGallery: {
    gap: scale(10),
    paddingVertical: verticalScale(4),
  },
  sheetGalleryImage: {
    width: scale(100),
    height: verticalScale(100),
    borderRadius: moderateScale(12),
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  viewProfileText: {
    color: colors.text.inverse,
  },
});
