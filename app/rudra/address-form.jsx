import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { setAddressSaved } from '../../utils/addressSession';
import { colors, textVariants } from '../../styles/theme';

const ADDRESS_TYPES = ['Home', 'Work', 'Other', 'Temporary'];

export default function RudraAddressForm() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={moderateScale(20)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading4, styles.headerTitle]}>Enter complete address</Text>
          <View style={styles.iconButton} />
        </View>

        <Text style={[textVariants.body2, styles.saveLabel]}>Save address as</Text>
        <View style={styles.typeRow}>
          {ADDRESS_TYPES.map((type, idx) => {
            const isActive = idx === 3;
            return (
              <TouchableOpacity
                key={type}
                activeOpacity={0.9}
                style={[styles.typeChip, isActive && styles.typeChipActive]}
              >
                <Text
                  style={[
                    textVariants.button2,
                    styles.typeChipText,
                    isActive && styles.typeChipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>Save address as</Text>
          <TextInput placeholder="Uncle’s home" style={styles.input} placeholderTextColor="#9BA0A7" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>House number, Floor</Text>
          <TextInput placeholder="303, 3rd floor" style={styles.input} placeholderTextColor="#9BA0A7" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>Tower / Block (optional)</Text>
          <TextInput placeholder="B2" style={styles.input} placeholderTextColor="#9BA0A7" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>Nearby landmark (optional)</Text>
          <TextInput placeholder="Opposite to India gate" style={styles.input} placeholderTextColor="#9BA0A7" />
        </View>

        <Text style={[textVariants.body3, styles.sectionTitle]}>Enter details for seamless delivery experience</Text>
        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>Your name</Text>
          <TextInput placeholder="Shobhit Jakotra" style={styles.input} placeholderTextColor="#9BA0A7" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={[textVariants.body3, styles.fieldLabel]}>Your phone number</Text>
          <TextInput placeholder="+91 98765 43210" style={styles.input} keyboardType="phone-pad" placeholderTextColor="#9BA0A7" />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryButton}
          onPress={() => {
            setAddressSaved();
            router.back();
          }}
        >
          <Text style={[textVariants.button1, styles.primaryButtonText]}>Save & proceed</Text>
        </TouchableOpacity>
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
    paddingBottom: verticalScale(28),
    gap: verticalScale(12),
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
  saveLabel: {
    color: colors.text.primary,
  },
  typeRow: {
    flexDirection: 'row',
    gap: scale(8),
  },
  typeChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(18),
    borderWidth: 1,
    borderColor: '#D5D5D5',
    backgroundColor: colors.background.surface,
  },
  typeChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  typeChipText: {
    color: colors.text.primary,
  },
  typeChipTextActive: {
    color: colors.text.inverse,
  },
  fieldGroup: {
    gap: verticalScale(6),
  },
  fieldLabel: {
    color: '#5A0C0C',
  },
  input: {
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    color: colors.text.primary,
    backgroundColor: colors.background.surface,
  },
  sectionTitle: {
    color: colors.text.primary,
    marginTop: verticalScale(4),
  },
  primaryButton: {
    marginTop: verticalScale(6),
    backgroundColor: '#5A0C0C',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.text.inverse,
  },
});
