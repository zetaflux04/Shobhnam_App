import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import {
  ramleelaPackages,
  ramleelaArtists,
  ramleelaFees,
  ramleelaServiceName,
} from '../../constants/ramleela';
import { colors, textVariants } from '../../styles/theme';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const TABS = ['Packages', 'Customised'];

export default function RamleelaScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Packages');
  const [selectedPackageId, setSelectedPackageId] = useState(ramleelaPackages[0]?.id ?? '');
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);

  const selectedPackage = useMemo(
    () => ramleelaPackages.find((item) => item.id === selectedPackageId) ?? ramleelaPackages[0],
    [selectedPackageId],
  );

  const selectedCount = selectedArtistIds.length;
  const selectedTotal = useMemo(() => {
    return selectedArtistIds.reduce((sum, id) => {
      const artist = ramleelaArtists.find((a) => a.id === id);
      return artist ? sum + artist.price : sum;
    }, 0);
  }, [selectedArtistIds]);

  const toggleArtist = (id) => {
    setSelectedArtistIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handlePackagePress = (pkg) => {
    setSelectedPackageId(pkg.id);
    router.push({
      pathname: '/ramleela/booking',
      params: { packageTitle: pkg.title, packagePrice: pkg.price.toString() },
    });
  };

  const handleAddCustomToBag = () => {
    const price = selectedTotal > 0 ? selectedTotal : ramleelaFees.base;
    router.push({
      pathname: '/ramleela/booking',
      params: {
        packageTitle: selectedPackage?.title ?? ramleelaServiceName,
        packagePrice: price.toString(),
        selectionCount: selectedCount.toString(),
      },
    });
  };

  const renderPackageCard = (item) => {
    const isSelected = selectedPackageId === item.id;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        style={styles.packageWrapper}
        onPress={() => handlePackagePress(item)}
      >
        <LinearGradient colors={item.gradient} style={[styles.packageCard, isSelected && styles.packageCardSelected]}>
          <View style={styles.packageHeader}>
            <Text style={[textVariants.heading3, styles.packageTitle]}>{item.title}</Text>
            {isSelected ? (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark" size={moderateScale(12)} color={colors.text.inverse} />
              </View>
            ) : null}
          </View>
          <Text style={[textVariants.body2, styles.packageDescription]}>{item.description}</Text>
          <Text style={[textVariants.heading3, styles.packagePrice]}>{formatCurrency(item.price)}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderArtistRow = (artist) => {
    const isSelected = selectedArtistIds.includes(artist.id);
    return (
      <TouchableOpacity
        key={artist.id}
        activeOpacity={0.9}
        style={[styles.artistRow, isSelected && styles.artistRowSelected]}
        onPress={() => toggleArtist(artist.id)}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/ramleela/profile', params: { artistId: artist.id } })}
        >
          <Image source={artist.image} style={styles.artistImage} />
        </TouchableOpacity>
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
            {' '}
            ({artist.reviews}+)
          </Text>
          <Text style={[textVariants.body3, styles.artistMeta]}>Character: Ram</Text>
        </View>
        <View style={styles.artistRight}>
          <Text style={[textVariants.heading5, styles.artistPrice]}>{formatCurrency(artist.price)}</Text>
          <Text style={[textVariants.caption4, styles.artistDistance]}>{artist.distance}</Text>
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={moderateScale(18)}
            color={isSelected ? '#5A0C0C' : '#C4C4C4'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[textVariants.heading3, styles.headerTitle]}>{ramleelaServiceName}</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
          <Ionicons name="search" size={moderateScale(20)} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.9}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  textVariants.button2,
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab}
              </Text>
              {isActive ? <View style={styles.tabUnderline} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[textVariants.body1, styles.subheading]}>
        {activeTab === 'Packages' ? 'Select best package for you.' : 'Add artist to cart'}
      </Text>

      {activeTab === 'Packages' ? (
        <ScrollView contentContainerStyle={styles.packageGrid} showsVerticalScrollIndicator={false}>
          {ramleelaPackages.map(renderPackageCard)}
          <View style={{ height: verticalScale(10) }} />
        </ScrollView>
      ) : (
        <>
          <View style={styles.filterRow}>
            <TouchableOpacity activeOpacity={0.85} style={styles.filterButton}>
              <Ionicons name="options-outline" size={moderateScale(16)} color={colors.text.primary} />
              <Text style={[textVariants.body3, styles.filterText]}>Filters</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.artistList} showsVerticalScrollIndicator={false}>
            {ramleelaArtists.map((artist) => renderArtistRow(artist))}
            <View style={{ height: verticalScale(90) }} />
          </ScrollView>
          <View style={styles.footerBar}>
            <View style={styles.footerLeft}>
              <Text style={[textVariants.heading5, styles.footerPrice]}>
                {formatCurrency(selectedTotal > 0 ? selectedTotal : ramleelaFees.base)}
              </Text>
              <Text style={[textVariants.caption4, styles.footerSub]}>Total{'\n'}Includes all taxes</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerCount}>
              <Text style={[textVariants.caption4, styles.footerCountLabel]}>Count</Text>
              <Text style={[textVariants.heading5, styles.footerCountValue]}>{selectedCount}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.9} style={styles.footerCta} onPress={handleAddCustomToBag}>
              <Text style={[textVariants.button1, styles.footerCtaText]}>Add to bag</Text>
            </TouchableOpacity>
          </View>
        </>
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
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
  },
  headerTitle: {
    color: colors.text.primary,
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginTop: verticalScale(10),
  },
  tabItem: {
    marginRight: scale(18),
    paddingBottom: verticalScale(4),
  },
  tabLabel: {
    textTransform: 'capitalize',
  },
  tabLabelActive: {
    color: '#5A0C0C',
  },
  tabLabelInactive: {
    color: '#6A6E75',
  },
  tabUnderline: {
    marginTop: verticalScale(6),
    height: verticalScale(3),
    borderRadius: moderateScale(2),
    backgroundColor: '#5A0C0C',
    width: '100%',
  },
  subheading: {
    color: '#6A6E75',
    paddingHorizontal: scale(16),
    marginTop: verticalScale(8),
  },
  packageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    rowGap: verticalScale(12),
  },
  packageWrapper: {
    width: '48%',
  },
  packageCard: {
    minHeight: verticalScale(210),
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(14),
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  packageCardSelected: {
    borderWidth: 1,
    borderColor: '#5A0C0C',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packageTitle: {
    color: colors.text.primary,
    flex: 1,
  },
  checkBadge: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageDescription: {
    color: '#4E5461',
    marginTop: verticalScale(6),
  },
  packagePrice: {
    color: colors.text.primary,
  },
  filterRow: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(4),
    alignItems: 'flex-end',
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
    paddingTop: verticalScale(6),
    gap: verticalScale(10),
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  artistRowSelected: {
    borderColor: '#5A0C0C',
  },
  artistImage: {
    width: scale(52),
    height: scale(52),
    borderRadius: moderateScale(10),
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
  artistRight: {
    alignItems: 'flex-end',
    gap: verticalScale(6),
  },
  artistPrice: {
    color: colors.text.primary,
  },
  artistDistance: {
    color: '#B02B2B',
  },
  footerBar: {
    position: 'absolute',
    left: scale(12),
    right: scale(12),
    bottom: verticalScale(12),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(28),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#ECECEC',
    gap: scale(12),
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    flex: 1,
  },
  footerPrice: {
    color: '#5A0C0C',
  },
  footerSub: {
    color: '#6A6E75',
  },
  footerDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ECECEC',
  },
  footerCount: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCountLabel: {
    color: '#6A6E75',
  },
  footerCountValue: {
    color: colors.text.primary,
  },
  footerCta: {
    backgroundColor: '#5A0C0C',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(20),
  },
  footerCtaText: {
    color: colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
