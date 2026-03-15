import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";

import { KeyboardVisibleContext } from "../context/KeyboardContext";
import LoginBrandHeader from "./LoginBrandHeader";

export default function LoginScreenLayout({ children }) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.container}>
        <View style={[styles.topSection, keyboardVisible && styles.topSectionCompact]}>
          <LoginBrandHeader keyboardVisible={keyboardVisible} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, keyboardVisible && styles.scrollContentCompact]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <KeyboardVisibleContext.Provider value={keyboardVisible}>
            {children}
          </KeyboardVisibleContext.Provider>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = ScaledSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  topSection: {
    flex: 0.38,
    minHeight: verticalScale(140),
    paddingTop: verticalScale(50),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topSectionCompact: {
    flex: 0.34,
    minHeight: verticalScale(130),
    paddingTop: verticalScale(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(0),
  },
  scrollContentCompact: {
    justifyContent: "flex-start",
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
});
