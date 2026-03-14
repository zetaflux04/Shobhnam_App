import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
} from "react-native-size-matters";

import api, { getAuthToken } from "../../lib/api";
import { API_BASE_URL, getNetworkErrorMessage } from "../../config/api";
import { colors, textVariants } from "../../styles/theme";

const genderOptions = ["Male", "Female", "Other"];
const expertiseOptions = [
  "Ramleela artist",
  "Classical singer",
  "Instrumentalist",
];
const ramleelaCharacters = ["Ram", "Sita", "Hanuman", "Laxman"];
const experienceOptions = [
  "1 year",
  "3 years",
  "5 years",
  "10 years",
  "15 years",
];

// Map app expertise to backend category
const expertiseToCategory = {
  "Ramleela artist": "Ramleela",
  "Classical singer": "Other",
  Instrumentalist: "Other",
};

export default function ArtistDetailsScreen() {
  const params = useLocalSearchParams();

  const [fullName, setFullName] = useState(params.name ?? "");
  const [gender, setGender] = useState("");
  const [expertise, setExpertise] = useState("");
  const [character, setCharacter] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null); // { asset, url }
  const [aadharCard, setAadharCard] = useState(null); // { asset, url }
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [uploadingAadharCard, setUploadingAadharCard] = useState(false);
  const [profilePhotoError, setProfilePhotoError] = useState(null);
  const [aadharCardError, setAadharCardError] = useState(null);
  const [serviceLocation, setServiceLocation] = useState(
    params.serviceLocation ?? "",
  );
  const [youtubeLink, setYoutubeLink] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [pickerVisible, setPickerVisible] = useState(null);
  const [locationSheet, setLocationSheet] = useState(false);

  useEffect(() => {
    if (params.serviceLocation && params.serviceLocation !== serviceLocation) {
      setServiceLocation(params.serviceLocation);
    }
  }, [params.serviceLocation, serviceLocation]);

  const requireCharacter = expertise.toLowerCase().includes("ramleela");

  const canSubmit = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      gender &&
      expertise &&
      experience &&
      serviceLocation &&
      profilePhoto?.url &&
      aadharCard?.url &&
      (!requireCharacter || character) &&
      agreed
    );
  }, [
    agreed,
    character,
    experience,
    expertise,
    fullName,
    gender,
    profilePhoto,
    aadharCard,
    requireCharacter,
    serviceLocation,
  ]);

  const openPicker = (key) => setPickerVisible(key);

  const handlePickerSelect = (key, value) => {
    setPickerVisible(null);
    if (key === "gender") setGender(value);
    if (key === "expertise") {
      setExpertise(value);
      if (!value.toLowerCase().includes("ramleela")) {
        setCharacter("");
      }
    }
    if (key === "character") setCharacter(value);
    if (key === "experience") setExperience(value);
  };

  const uploadFileWithFileSystem = async (fileUri, fieldName, endpoint) => {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}/api/v1${endpoint}`;
    let result;
    try {
      result = await FileSystem.uploadAsync(url, fileUri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      err.code = err.code ?? "ERR_NETWORK";
      throw err;
    }
    let data;
    try {
      data = JSON.parse(result.body);
    } catch {
      throw new Error("Invalid response from server");
    }
    if (result.status >= 200 && result.status < 300) {
      return data?.data?.fileSavedUrl;
    }
    throw new Error(data?.message ?? "Upload failed");
  };

  const isNetworkError = (err) =>
    !err.response &&
    (err.message === "Network Error" ||
      err.code === "ERR_NETWORK" ||
      err.message?.includes("Network request failed"));

  const pickProfilePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setProfilePhoto({ asset });
      setProfilePhotoError(null);
      setUploadingProfilePhoto(true);
      try {
        const url = await uploadFileWithFileSystem(
          asset.uri,
          "profilePhoto",
          "/admin/upload-artist-profile-photo"
        );
        if (url) {
          setProfilePhoto((prev) => (prev ? { ...prev, url } : { asset, url }));
        }
      } catch (err) {
        setProfilePhotoError(err);
        setProfilePhoto(null);
        if (__DEV__) {
          console.warn("[ArtistDetails] Profile photo upload error:", err?.message, err);
        }
        const msg = isNetworkError(err)
          ? getNetworkErrorMessage()
          : err.message ?? "Failed to upload photo. Try again.";
        Alert.alert("Upload failed", msg);
      } finally {
        setUploadingProfilePhoto(false);
      }
    }
  };

  const pickAadharCard = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setAadharCard({ asset });
      setAadharCardError(null);
      setUploadingAadharCard(true);
      try {
        const url = await uploadFileWithFileSystem(
          asset.uri,
          "aadharCard",
          "/admin/upload-artist-aadhar"
        );
        if (url) {
          setAadharCard((prev) => (prev ? { ...prev, url } : { asset, url }));
        }
      } catch (err) {
        setAadharCardError(err);
        setAadharCard(null);
        if (__DEV__) {
          console.warn("[ArtistDetails] Aadhar upload error:", err?.message, err);
        }
        const msg = isNetworkError(err)
          ? getNetworkErrorMessage()
          : err.message ?? "Failed to upload Aadhar card. Try again.";
        Alert.alert("Upload failed", msg);
      } finally {
        setUploadingAadharCard(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await api.get("/health", { timeout: 10000 });

      const payload = {
        fullName: fullName.trim(),
        gender,
        expertise,
        experience,
        serviceLocation,
        agreedToTerms: agreed ? "true" : "false",
        category: expertiseToCategory[expertise] || "Other",
        profilePhoto: profilePhoto?.url,
        aadharCard: aadharCard?.url,
      };
      if (character) payload.ramleelaCharacter = character;
      if (youtubeLink.trim()) payload.youtubeLink = youtubeLink.trim();

      await api.patch("/artists/me", payload, { timeout: 30000 });
      router.push("/artist/success");
    } catch (err) {
      // Debug logging for network issues
      if (!err.response) {
        console.warn("[ArtistDetails] Network/upload error:", {
          code: err.code,
          message: err.message,
          cause: err.cause?.message,
        });
      }
      const isTimeout =
        err.code === "ECONNABORTED" || err.code === "ETIMEDOUT";
      const isNetworkError =
        !err.response &&
        (err.message === "Network Error" || err.code === "ERR_NETWORK");
      const msg = isTimeout
        ? "Request timed out. Your connection may be slow — try Wi-Fi and try again."
        : isNetworkError
          ? getNetworkErrorMessage()
          : (err.response?.data?.message ??
            err.message ??
            "Failed to submit profile");
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[textVariants.heading1, styles.title]}>
          Join as Artist
        </Text>
        <Text style={[textVariants.body1, styles.subtitle]}>
          Help us know you better by entering your registration details.
        </Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Enter your full name"
            placeholderTextColor="#7A201A"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <DropdownField
            label="Select your gender"
            value={gender}
            onPress={() => openPicker("gender")}
            placeholder="Select your gender"
          />

          <DropdownField
            label="Select your experties"
            value={expertise}
            onPress={() => openPicker("expertise")}
            placeholder="Select your experties"
          />

          {requireCharacter ? (
            <DropdownField
              label="Select your ramleela character"
              value={character}
              onPress={() => openPicker("character")}
              placeholder="Select your ramleela character"
            />
          ) : null}

          <DropdownField
            label="Select your experience"
            value={experience}
            onPress={() => openPicker("experience")}
            placeholder="Select your experience"
          />

          <UploadField
            label="Upload your photo"
            uploaded={!!profilePhoto?.url}
            displayName={profilePhoto?.asset?.fileName}
            onPress={pickProfilePhoto}
            loading={uploadingProfilePhoto}
            error={!!profilePhotoError}
          />
          <UploadField
            label="Upload your aadhar card"
            uploaded={!!aadharCard?.url}
            displayName={aadharCard?.asset?.name}
            onPress={pickAadharCard}
            loading={uploadingAadharCard}
            error={!!aadharCardError}
          />

          <UploadField
            label={
              serviceLocation ? serviceLocation : "Enter your service location"
            }
            uploaded={!!serviceLocation}
            onPress={() => setLocationSheet(true)}
            icon="location-outline"
          />

          <TextInput
            placeholder="Enter your youtube link (optional)"
            placeholderTextColor="#7A201A"
            style={styles.input}
            value={youtubeLink}
            onChangeText={setYoutubeLink}
          />

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed((prev) => !prev)}
            activeOpacity={0.85}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed ? (
                <Ionicons
                  name="checkmark"
                  size={moderateScale(14)}
                  color={colors.text.inverse}
                />
              ) : null}
            </View>
            <Text style={[textVariants.body2, styles.checkboxText]}>
              I agree with <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={canSubmit && !loading ? 0.9 : 1}
          style={[
            styles.button,
            canSubmit && !loading
              ? styles.buttonPrimary
              : styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text.inverse} />
          ) : (
            <Text
              style={[
                textVariants.button1,
                canSubmit ? styles.buttonText : styles.buttonDisabledText,
              ]}
            >
              SUBMIT & CONTINUE
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <PickerModal
        visible={pickerVisible === "gender"}
        title="Select gender"
        options={genderOptions}
        onClose={() => setPickerVisible(null)}
        onSelect={(v) => handlePickerSelect("gender", v)}
      />
      <PickerModal
        visible={pickerVisible === "expertise"}
        title="Select your experties"
        options={expertiseOptions}
        onClose={() => setPickerVisible(null)}
        onSelect={(v) => handlePickerSelect("expertise", v)}
      />
      <PickerModal
        visible={pickerVisible === "character"}
        title="Select your ramleela character"
        options={ramleelaCharacters}
        onClose={() => setPickerVisible(null)}
        onSelect={(v) => handlePickerSelect("character", v)}
      />
      <PickerModal
        visible={pickerVisible === "experience"}
        title="Select your experience"
        options={experienceOptions}
        onClose={() => setPickerVisible(null)}
        onSelect={(v) => handlePickerSelect("experience", v)}
      />

      <LocationSheet
        visible={locationSheet}
        onClose={() => setLocationSheet(false)}
        onAnother={() => {
          setLocationSheet(false);
          router.push("/artist/location-search");
        }}
        onCurrent={() => {
          setLocationSheet(false);
          setServiceLocation("Current location");
        }}
      />
    </SafeAreaView>
  );
}

/**
 * @param {{ label: string; value: string; onPress: () => void; placeholder: string }} props
 */
function DropdownField({ label, value, onPress, placeholder }) {
  return (
    <TouchableOpacity
      style={styles.dropdown}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text
        style={[
          textVariants.body2,
          value ? styles.dropdownValue : styles.placeholder,
        ]}
      >
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={moderateScale(18)} color="#5A0C0C" />
    </TouchableOpacity>
  );
}

/**
 * @param {{ label: string; uploaded: boolean; displayName?: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; loading?: boolean; error?: boolean }} props
 */
function UploadField({
  label,
  uploaded,
  displayName,
  onPress,
  icon = "add",
  loading = false,
  error = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.uploadRow,
        error && styles.uploadRowError,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={loading}
    >
      <Text
        style={[
          styles.uploadLabel,
          textVariants.body2,
          uploaded ? styles.uploadedText : styles.placeholder,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {loading ? "Uploading..." : uploaded && displayName ? displayName : label}
      </Text>
      <View style={styles.uploadIconWrap}>
        <View
          style={[
            styles.circle,
            uploaded ? styles.circleSuccess : styles.circleNeutral,
            error && styles.circleError,
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#5A0C0C" />
          ) : (
            <Ionicons
              name={uploaded ? "checkmark" : icon}
              size={moderateScale(uploaded ? 16 : 18)}
              color={uploaded ? colors.text.inverse : error ? "#C62828" : "#5A0C0C"}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * @param {{ visible: boolean; title: string; options: string[]; onSelect: (value: string) => void; onClose: () => void }} props
 */
function PickerModal({ visible, title, options, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={[textVariants.heading3, styles.modalTitle]}>
            {title}
          </Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.modalItem}
              onPress={() => onSelect(option)}
              activeOpacity={0.85}
            >
              <Text style={[textVariants.body1, styles.modalItemText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalClose}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={[textVariants.button2, styles.modalCloseText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * @param {{ visible: boolean; onClose: () => void; onAnother: () => void; onCurrent: () => void }} props
 */
function LocationSheet({ visible, onClose, onAnother, onCurrent }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheetCard}>
          <TouchableOpacity
            style={styles.sheetClose}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Ionicons
              name="close"
              size={moderateScale(16)}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={[textVariants.heading4, styles.sheetTitle]}>
            Enter your service location
          </Text>
          <Text style={[textVariants.body2, styles.sheetSubtitle]}>
            This helps us find relevant bookings for you
          </Text>

          <TouchableOpacity
            style={styles.sheetButtonPrimary}
            onPress={onAnother}
            activeOpacity={0.9}
          >
            <Text style={[textVariants.button1, styles.sheetButtonText]}>
              ANOTHER LOCATION
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetButtonSecondary}
            onPress={onCurrent}
            activeOpacity={0.9}
          >
            <Ionicons
              name="location-outline"
              size={moderateScale(18)}
              color="#5A0C0C"
            />
            <Text style={[textVariants.button2, styles.sheetSecondaryText]}>
              USE CURRENT LOCATION
            </Text>
          </TouchableOpacity>

          <View style={styles.sheetIllustrationWrap}>
            <View style={styles.sheetIllustrationBg} />
            <Image
              source={require("../../assets/images/Vector.png")}
              style={styles.sheetIllustrationImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  container: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(28),
    gap: verticalScale(14),
  },
  title: {
    color: colors.text.primary,
  },
  subtitle: {
    color: colors.text.primary,
  },
  form: {
    gap: verticalScale(12),
  },
  input: {
    borderWidth: scale(1),
    borderColor: "#7A201A",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(15),
    color: colors.text.primary,
    backgroundColor: colors.neutral.white,
  },
  dropdown: {
    borderWidth: scale(1),
    borderColor: "#7A201A",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral.white,
  },
  dropdownValue: {
    color: colors.text.primary,
  },
  placeholder: {
    color: "#7A201A",
  },
  uploadRow: {
    borderWidth: scale(1),
    borderColor: "#7A201A",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral.white,
  },
  uploadRowError: {
    borderColor: "#C62828",
  },
  uploadedText: {
    color: colors.text.primary,
  },
  uploadLabel: {
    flex: 1,
    minWidth: 0,
    paddingRight: scale(10),
  },
  uploadIconWrap: {
    flexShrink: 0,
  },
  circle: {
    width: moderateScale(26),
    height: moderateScale(26),
    borderRadius: moderateScale(13),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: scale(1),
  },
  circleNeutral: {
    borderColor: "#5A0C0C",
  },
  circleError: {
    borderColor: "#C62828",
  },
  circleSuccess: {
    backgroundColor: colors.secondary.green,
    borderColor: colors.secondary.green,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginTop: verticalScale(6),
  },
  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(4),
    borderWidth: scale(1),
    borderColor: "#7A201A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.base,
  },
  checkboxChecked: {
    backgroundColor: "#7A201A",
  },
  checkboxText: {
    color: colors.text.primary,
  },
  link: {
    color: "#0D63C7",
    fontFamily: "Inter_600SemiBold",
  },
  button: {
    height: verticalScale(56),
    borderRadius: moderateScale(28),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#5A0C0C",
  },
  buttonDisabled: {
    backgroundColor: "#DADADA",
  },
  buttonText: {
    color: colors.text.inverse,
  },
  buttonDisabledText: {
    color: "#9EA3A9",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(20),
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.neutral.white,
    borderRadius: moderateScale(14),
    padding: scale(16),
    gap: verticalScale(10),
  },
  modalTitle: {
    color: colors.text.primary,
  },
  modalItem: {
    paddingVertical: verticalScale(10),
  },
  modalItemText: {
    color: colors.text.primary,
  },
  modalClose: {
    alignSelf: "flex-end",
  },
  modalCloseText: {
    color: "#0D63C7",
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    flex: 1,
  },
  sheetCard: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: moderateScale(22),
    borderTopRightRadius: moderateScale(22),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(28),
    alignItems: "center",
    gap: verticalScale(10),
  },
  sheetClose: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    borderWidth: scale(1),
    borderColor: "#D6D6D6",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    color: "#5A0C0C",
  },
  sheetSubtitle: {
    color: colors.text.primary,
  },
  sheetButtonPrimary: {
    marginTop: verticalScale(10),
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#5A0C0C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(18),
    width: "100%",
  },
  sheetButtonText: {
    color: colors.text.inverse,
  },
  sheetButtonSecondary: {
    marginTop: verticalScale(6),
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    borderWidth: scale(1),
    borderColor: "#5A0C0C",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(18),
    width: "100%",
    flexDirection: "row",
    gap: scale(8),
  },
  sheetSecondaryText: {
    color: "#5A0C0C",
  },
  sheetIllustrationWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  sheetIllustrationBg: {
    width: "100%",
    height: verticalScale(70),
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
    backgroundColor: "#F3DCDC",
  },
  sheetIllustrationImage: {
    position: "absolute",
    bottom: -verticalScale(6),
    width: "90%",
    height: verticalScale(90),
  },
});
