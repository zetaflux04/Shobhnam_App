import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

export default function BhajanLocationSearch() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading4, styles.headerTitle]}>Add address</Text>
          <View style={styles.iconButton} />
        </View>

        <ImageBackground
          source={require('../../assets/service/Map.png')}
          style={styles.map}
          imageStyle={styles.mapImg}
        >
          <View style={styles.searchBar}>
            <Ionicons name="search" size={moderateScale(16)} color="#5A0C0C" />
            <TextInput placeholder="Search for area, street name..." style={styles.searchInput} />
          </View>
          <View style={styles.marker}>
            <Ionicons name="location" size={moderateScale(20)} color="#5A0C0C" />
          </View>
        </ImageBackground>

        <View style={styles.venueCard}>
          <Text style={[textVariants.body2, styles.venueLabel]}>Your event venue</Text>
          <Text style={[textVariants.heading5, styles.venueText]}>Vikaspuri 110037, New delhi</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.outlineButton}
            onPress={() => router.push('/bhajan/address-form')}
          >
            <Text style={[textVariants.button2, styles.outlineButtonText]}>Add more address details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  content: {
    paddingBottom: verticalScale(20),
    gap: verticalScale(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
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
  map: {
    marginHorizontal: scale(16),
    height: verticalScale(420),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  mapImg: {
    borderRadius: moderateScale(20),
  },
  searchBar: {
    margin: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    backgroundColor: colors.background.base,
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -moderateScale(18),
    marginTop: -moderateScale(18),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  venueCard: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(-30),
    backgroundColor: colors.background.base,
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    gap: verticalScale(8),
  },
  venueLabel: {
    color: '#6A6E75',
  },
  venueText: {
    color: colors.text.primary,
  },
  outlineButton: {
    marginTop: verticalScale(6),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: '#5A0C0C',
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#5A0C0C',
  },
});
