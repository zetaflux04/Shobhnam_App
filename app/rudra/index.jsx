import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { rudraPackages, rudraServiceName } from '../../constants/rudra';
import { colors, textVariants } from '../../styles/theme';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function RudraPackages() {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState(rudraPackages[0]?.id ?? '');

  const handlePackagePress = (item) => {
    setSelectedPackageId(item.id);
    router.push({
      pathname: '/rudra/booking',
      params: { packageTitle: item.title, packagePrice: item.price.toString() },
    });
  };

  const selectedPackage = useMemo(
    () => rudraPackages.find((pkg) => pkg.id === selectedPackageId) ?? rudraPackages[0],
    [selectedPackageId],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>{rudraServiceName}</Text>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
            <Ionicons name="search" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[textVariants.body1, styles.subheading]}>Get pack of best artist near you.</Text>

        <View style={styles.grid}>
          {rudraPackages.map((item) => {
            const isSelected = selectedPackageId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                style={[styles.cardWrapper, isSelected && styles.cardWrapperSelected]}
                onPress={() => handlePackagePress(item)}
              >
                <LinearGradient colors={item.gradient} style={styles.packageCard}>
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
          })}
        </View>

        <View style={{ height: verticalScale(8) }} />
        {selectedPackage ? (
          <Text style={[textVariants.caption4, styles.helperText]}>
            Selected: {selectedPackage.title.replace('.', '')}
          </Text>
        ) : null}
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
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
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
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checkBadge: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    backgroundColor: '#5A0C0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageTitle: {
    color: colors.text.primary,
    flex: 1,
  },
  packageDescription: {
    color: '#4E5461',
    marginTop: verticalScale(6),
  },
  packagePrice: {
    color: colors.text.primary,
  },
  helperText: {
    color: '#6A6E75',
  },
});
