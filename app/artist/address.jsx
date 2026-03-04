import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

const addressTypes = ['Home', 'Work', 'Other', 'Temporary'];

export default function AddressFormScreen() {
  const params = useLocalSearchParams();
  const venueFromMap = params.venue ?? '';

  const [addressType, setAddressType] = useState('Other');
  const [nickname, setNickname] = useState("Uncle's home");
  const [house, setHouse] = useState('303, 3rd floor');
  const [tower, setTower] = useState('B2');
  const [landmark, setLandmark] = useState('Opposite to India gate');
  const [name, setName] = useState('Shobhit Jakotra');
  const [phone, setPhone] = useState('+91 98765 43210');

  const canSave = useMemo(
    () => nickname.trim() && house.trim() && name.trim() && phone.trim(),
    [house, name, nickname, phone],
  );

  const handleSave = () => {
    if (!canSave) return;
    const parts = [`${nickname} - ${house}`];
    if (tower) parts.push(tower);
    if (landmark) parts.push(landmark);
    if (venueFromMap) parts.push(venueFromMap);
    const summary = parts.join(', ');
    router.replace({
      pathname: '/artist/details',
      params: {
        serviceLocation: summary,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={styles.back}>
            <Ionicons name="chevron-back" size={moderateScale(22)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.title]}>Enter complete address</Text>
        </View>

        <Text style={[textVariants.caption4, styles.label]}>Save address as</Text>
        <View style={styles.chipRow}>
          {addressTypes.map((type) => {
            const active = addressType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                onPress={() => setAddressType(type)}
                activeOpacity={0.9}
              >
                <Text style={[textVariants.button2, active ? styles.chipTextActive : styles.chipTextInactive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          placeholder="Save address as"
          placeholderTextColor="#7A201A"
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
        />

        <View style={styles.divider} />

        <TextInput
          placeholder="House number, Floor"
          placeholderTextColor="#7A201A"
          style={styles.input}
          value={house}
          onChangeText={setHouse}
        />

        <TextInput
          placeholder="Tower / Block (optional)"
          placeholderTextColor="#7A201A"
          style={styles.input}
          value={tower}
          onChangeText={setTower}
        />

        <TextInput
          placeholder="Nearby landmark (optional)"
          placeholderTextColor="#7A201A"
          style={styles.input}
          value={landmark}
          onChangeText={setLandmark}
        />

        <Text style={[textVariants.caption4, styles.helper]}>Enter details for seamless delivery experience</Text>

        <TextInput
          placeholder="Your name"
          placeholderTextColor="#7A201A"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Your phone number"
          placeholderTextColor="#7A201A"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          style={[styles.saveButton, canSave ? styles.saveEnabled : styles.saveDisabled]}
          activeOpacity={canSave ? 0.9 : 1}
          onPress={handleSave}
        >
          <Text style={[textVariants.button1, canSave ? styles.saveText : styles.saveTextDisabled]}>
            SAVE & PROCEED
          </Text>
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
  container: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(22),
    gap: verticalScale(10),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginBottom: verticalScale(10),
  },
  back: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
  },
  label: {
    color: colors.text.primary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: scale(10),
  },
  chip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: scale(1),
  },
  chipActive: {
    backgroundColor: '#5A0C0C',
    borderColor: '#5A0C0C',
  },
  chipInactive: {
    backgroundColor: 'transparent',
    borderColor: '#5A0C0C',
  },
  chipTextActive: {
    color: colors.text.inverse,
  },
  chipTextInactive: {
    color: '#5A0C0C',
  },
  input: {
    borderWidth: scale(1),
    borderColor: '#7A201A',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(15),
    color: colors.text.primary,
    backgroundColor: colors.neutral.white,
  },
  divider: {
    height: verticalScale(1),
    backgroundColor: '#7A201A',
  },
  helper: {
    color: colors.text.primary,
  },
  saveButton: {
    marginTop: verticalScale(8),
    height: verticalScale(52),
    borderRadius: moderateScale(26),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveEnabled: {
    backgroundColor: '#5A0C0C',
  },
  saveDisabled: {
    backgroundColor: '#DADADA',
  },
  saveText: {
    color: colors.text.inverse,
  },
  saveTextDisabled: {
    color: '#9EA3A9',
  },
});
