import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { colors, textVariants } from '../../styles/theme';

const ADDRESS_TYPES = [
  { key: 'HOME', label: 'Home' },
  { key: 'WORK', label: 'Work' },
  { key: 'OTHER', label: 'Other' },
  { key: 'TEMPORARY', label: 'Temporary' },
];

const LabeledInput = ({ label, value, onChangeText, placeholder, keyboardType, clearable }) => (
  <View style={styles.fieldWrap}>
    <Text style={[textVariants.body4, styles.fieldLabel]}>{label}</Text>
    <View style={styles.inputWrap}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        keyboardType={keyboardType}
        placeholderTextColor="#9A8080"
      />
      {clearable && value ? (
        <TouchableOpacity style={styles.clearBtn} activeOpacity={0.85} onPress={() => onChangeText('')}>
          <Ionicons name="close" size={moderateScale(13)} color="#232323" />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

export default function AddressFormModal({
  visible,
  onClose,
  title = 'Edit address',
  value,
  onChange,
  onSubmit,
  submitting = false,
}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onClose}>
            <Ionicons name="chevron-back" size={moderateScale(22)} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[textVariants.heading3, styles.headerTitle]}>{title}</Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[textVariants.heading5, styles.sectionLabel]}>Save address as</Text>
          <View style={styles.chipRow}>
            {ADDRESS_TYPES.map((type) => {
              const active = value.addressType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                  activeOpacity={0.85}
                  onPress={() => onChange('addressType', type.key)}
                >
                  <Text style={[textVariants.body3, styles.typeChipText, active && styles.typeChipTextActive]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <LabeledInput
            label="Save address as"
            value={value.saveAs}
            onChangeText={(text) => onChange('saveAs', text)}
            placeholder="Uncle's home"
          />

          <View style={styles.separator} />

          <LabeledInput
            label="House number, Floor"
            value={value.houseFloor}
            onChangeText={(text) => onChange('houseFloor', text)}
            placeholder="303, 3rd floor"
          />
          <LabeledInput
            label="Tower / Block (optional)"
            value={value.towerBlock}
            onChangeText={(text) => onChange('towerBlock', text)}
            placeholder="B2"
          />
          <LabeledInput
            label="Nearby landmark (optional)"
            value={value.landmark}
            onChangeText={(text) => onChange('landmark', text)}
            placeholder="Opposite to India gate"
          />

          <Text style={[textVariants.body4, styles.helperText]}>Enter details for seamless delivery experience</Text>

          <LabeledInput
            label="Your name"
            value={value.recipientName}
            onChangeText={(text) => onChange('recipientName', text)}
            placeholder="Shobhit Jakotra"
            clearable
          />
          <LabeledInput
            label="Your phone number"
            value={value.recipientPhone}
            onChangeText={(text) => onChange('recipientPhone', text)}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            clearable
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={onSubmit}
            disabled={submitting}
          >
            <Text style={[textVariants.button1, styles.submitText]}>{submitting ? 'SAVING...' : 'SAVE & PROCEED'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(10),
  },
  backBtn: {
    width: moderateScale(34),
    height: moderateScale(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(18),
  },
  sectionLabel: {
    color: colors.text.primary,
    marginBottom: verticalScale(10),
  },
  chipRow: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(14),
  },
  typeChip: {
    borderWidth: 1,
    borderColor: '#292929',
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
  },
  typeChipActive: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  typeChipText: {
    color: '#1E1E1E',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
  },
  fieldWrap: {
    marginBottom: verticalScale(12),
  },
  fieldLabel: {
    color: '#7A1B1B',
    marginBottom: verticalScale(5),
    marginLeft: scale(10),
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#7A1B1B',
    borderRadius: moderateScale(8),
    backgroundColor: colors.background.base,
    minHeight: verticalScale(54),
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    color: colors.text.primary,
    fontSize: moderateScale(13.5),
  },
  clearBtn: {
    position: 'absolute',
    right: scale(10),
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    borderTopWidth: 1,
    borderTopColor: '#D8D8D8',
    borderStyle: 'dashed',
    marginVertical: verticalScale(8),
  },
  helperText: {
    color: '#4F4F4F',
    marginTop: verticalScale(2),
    marginBottom: verticalScale(12),
  },
  footer: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  submitBtn: {
    backgroundColor: '#7A0E14',
    borderRadius: moderateScale(26),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(15),
  },
  submitBtnDisabled: {
    backgroundColor: '#B1B4BB',
  },
  submitText: {
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
