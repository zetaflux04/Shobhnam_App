import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const LOGO_SIZE_DEFAULT = moderateScale(200);
const LOGO_SIZE_COMPACT = moderateScale(150);
const ANIMATION_DURATION = 250;

export default function LoginBrandHeader({ keyboardVisible = false }) {
  const sizeAnim = useRef(new Animated.Value(keyboardVisible ? LOGO_SIZE_COMPACT : LOGO_SIZE_DEFAULT)).current;

  useEffect(() => {
    Animated.timing(sizeAnim, {
      toValue: keyboardVisible ? LOGO_SIZE_COMPACT : LOGO_SIZE_DEFAULT,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [keyboardVisible, sizeAnim]);

  return (
    <View style={styles.brand}>
      <Animated.View
        style={[
          styles.logoCircle,
          {
            width: sizeAnim,
            height: sizeAnim,
            borderRadius: sizeAnim.interpolate({
              inputRange: [LOGO_SIZE_COMPACT, LOGO_SIZE_DEFAULT],
              outputRange: [LOGO_SIZE_COMPACT / 2, LOGO_SIZE_DEFAULT / 2],
            }),
          },
        ]}
      >
        <Animated.Image
          source={require('../assets/images/main_logo.png')}
          style={{ width: sizeAnim, height: sizeAnim }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = ScaledSheet.create({
  brand: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    overflow: 'hidden',
  },
});
