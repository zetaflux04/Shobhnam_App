import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, ScrollView, UIManager, View } from "react-native";
import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";

import { KeyboardVisibleContext } from "../context/KeyboardContext";
import LoginBrandHeader from "./LoginBrandHeader";

const LAYOUT_ANIMATION_CONFIG = LayoutAnimation.create(250, "easeInEaseOut", "opacity");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LoginScreenLayout({ children }) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const animateAndSet = (visible) => {
      LayoutAnimation.configureNext(LAYOUT_ANIMATION_CONFIG);
      setKeyboardVisible(visible);
    };
    const showSub = Keyboard.addListener("keyboardDidShow", () => animateAndSet(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => animateAndSet(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 50}
    >
      <View style={styles.container}>
        <View style={[styles.topSection, keyboardVisible && styles.topSectionCompact]}>
          <LoginBrandHeader keyboardVisible={keyboardVisible} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, keyboardVisible && styles.scrollContentCompact]}
          keyboardShouldPersistTaps="handled"
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
    flex: 0.45,
    minHeight: verticalScale(180),
    paddingTop: verticalScale(80),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topSectionCompact: {
    flex: 0,
    minHeight: verticalScale(100),
    paddingTop: verticalScale(16),
    paddingVertical: verticalScale(8),
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(24),
  },
  scrollContentCompact: {
    justifyContent: "flex-start",
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(48),
  },
});
