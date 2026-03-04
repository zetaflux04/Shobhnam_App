import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { otherServices } from '../../constants/otherServices';
import { colors, textVariants } from '../../styles/theme';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function OtherServicesPackages() {
  const router = useRouter();

  const handleServicePress = (item) => {
    router.push({
      pathname: '/other-services/artists',
      params: { serviceId: item.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>Other services</Text>
          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
            <Ionicons name="search" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[textVariants.body1, styles.subheading]}>Select the services you need.</Text>

        <View style={styles.cardList}>
          {otherServices.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.cardWrapper}
              onPress={() => handleServicePress(item)}
            >
              <ImageBackground
                source={item.image}
                style={styles.cardBg}
                imageStyle={styles.cardImg}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={item.gradient}
                  style={styles.cardOverlay}
                />
                <View style={styles.cardContent}>
                  <Text style={[textVariants.heading4, styles.cardTitle]}>{item.title}</Text>
                  <Text style={[textVariants.body2, styles.cardDescription]}>{item.description}</Text>
                  <Text style={[textVariants.heading4, styles.cardPrice]}>{formatCurrency(item.price)}</Text>
                </View>
              </ImageBackground>
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
  cardList: {
    gap: verticalScale(12),
  },
  cardWrapper: {
    width: '100%',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    minHeight: verticalScale(160),
  },
  cardBg: {
    flex: 1,
    minHeight: verticalScale(160),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  cardImg: {
    borderRadius: moderateScale(16),
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    gap: verticalScale(4),
  },
  cardTitle: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.95)',
  },
  cardPrice: {
    color: colors.text.inverse,
    marginTop: verticalScale(6),
    fontWeight: '600',
  },
});
