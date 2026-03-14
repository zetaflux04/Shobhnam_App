import { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, LayoutAnimation, Platform, ScrollView, UIManager, View } from "react-native";
import { ScaledSheet, scale, verticalScale } from "react-native-size-matters";

import { KeyboardVisibleContext } from "../context/KeyboardContext";
import LoginBrandHeader from "./LoginBrandHeader";

/**
 * Two-part layout: upper 50% for branding (centered), lower 50% for form content (centered).
 * When keyboard opens: logo shrinks, top section compacts, so full form (including submit) fits above keyboard.
 */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LoginScreenLayout({ children }) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const animateAndSet = (visible) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 24}
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
    minHeight: verticalScale(120),
    paddingTop: verticalScale(24),
    paddingVertical: verticalScale(6),
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
    paddingBottom: verticalScale(24),
  },
});
