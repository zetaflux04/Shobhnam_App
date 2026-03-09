import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

const packages = [
  {
    id: 'diamond',
    title: 'Diamond package.',
    description: 'The most immersive Bahgwat katha experience with best artists.',
    price: 11000,
    gradient: ['#C0A9F5', '#7CA8FF', '#EED487'],
  },
  {
    id: 'platinum',
    title: 'Platinum package.',
    description: 'A rich Bahgwat katha experience with skilled artists.',
    price: 8100,
    gradient: ['#8EE0DE', '#9DE3F1', '#DFF3F8'],
  },
  {
    id: 'gold',
    title: 'Gold package.',
    description: 'A meaningful traditional Bahgwat katha experience.',
    price: 5100,
    gradient: ['#F3D069', '#E2B55B', '#F6E2AC'],
  },
  {
    id: 'silver',
    title: 'Silver package.',
    description: 'A simple and short Bahgwat katha experience.',
    price: 3100,
    gradient: ['#E8E8E8', '#D4D9E1', '#A7B1BD'],
  },
];

export default function BhagwatKathaPackages() {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0]?.id ?? '');

  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const handlePackagePress = (item) => {
    setSelectedPackageId(item.id);
    router.push({
      pathname: '/bhagwat-katha/booking',
      params: {
        packageTitle: item.title,
        packagePrice: item.price.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>Bahgwat katha</Text>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
            <Ionicons name="search" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[textVariants.body1, styles.subheading]}>Get pack of best artist near you.</Text>

        <View style={styles.grid}>
          {packages.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={[styles.cardWrapper, selectedPackageId === item.id && styles.cardWrapperSelected]}
              onPress={() => handlePackagePress(item)}
            >
              <LinearGradient colors={item.gradient} style={styles.packageCard}>
                <Text style={[textVariants.heading3, styles.packageTitle]}>{item.title}</Text>
                <Text style={[textVariants.body2, styles.packageDescription]}>{item.description}</Text>
                <Text style={[textVariants.heading3, styles.packagePrice]}>{formatCurrency(item.price)}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(24),
    gap: verticalScale(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: colors.text.primary,
  },
  iconButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  subheading: {
    color: '#6A6E75',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: verticalScale(12),
  },
  cardWrapper: {
    width: '48%',
  },
  cardWrapperSelected: {
    borderWidth: 1,
    borderColor: '#5A0C0C',
    borderRadius: moderateScale(16),
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
  packageTitle: {
    color: colors.text.primary,
  },
  packageDescription: {
    color: '#4E5461',
  },
  packagePrice: {
    color: colors.text.primary,
  },
});
