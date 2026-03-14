import { Image, View } from 'react-native';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const LOGO_SIZE_DEFAULT = 200;
const LOGO_SIZE_COMPACT = 120;

export default function LoginBrandHeader({ keyboardVisible = false }) {
  const size = keyboardVisible ? moderateScale(LOGO_SIZE_COMPACT) : moderateScale(LOGO_SIZE_DEFAULT);

  return (
    <View style={styles.brand}>
      <View style={[styles.logoCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image
          source={require('../assets/images/Logo mark.png')}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
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
