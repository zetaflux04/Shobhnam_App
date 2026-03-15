import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

const TAB_CONFIG = {
  service: {
    label: 'Service',
    defaultIcon: require('../../assets/tabs/home.png'),
    activeIcon: require('../../assets/tabs/home2.png'),
  },
  orders: {
    label: 'Orders',
    defaultIcon: require('../../assets/tabs/order.png'),
    activeIcon: require('../../assets/tabs/order2.png'),
  },
  profile: {
    label: 'Profile',
    defaultIcon: require('../../assets/tabs/profile.png'),
    activeIcon: require('../../assets/tabs/profile2.png'),
  },
};

/**
 * @param {import('@react-navigation/bottom-tabs').BottomTabBarProps} props
 */
function CustomTabBar({ state, navigation }) {
  const focusedRouteKey = state.routes[state.index].name;

  const shadowStyle = useMemo(
    () => ({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: verticalScale(6) },
      shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.22,
      shadowRadius: moderateScale(10),
      elevation: Platform.OS === 'android' ? moderateScale(8) : 0,
    }),
    [],
  );

  return (
    <View style={[styles.tabWrapper, shadowStyle]}>
      <View style={styles.tabBar}>
        {state.routes.map((route) => {
          const isFocused = focusedRouteKey === route.name;
          const config = TAB_CONFIG[route.name];

          // Skip any unexpected routes to avoid crashes
          if (!config) {
            return null;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.9}
              style={styles.tabItem}
            >
              <Image
                source={isFocused ? config.activeIcon : config.defaultIcon}
                style={styles.tabIcon}
                resizeMode="contain"
              />
              <Text style={[textVariants.caption4, styles.tabLabel, isFocused ? styles.tabLabelActive : undefined]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="service"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="service" options={{ title: 'Service' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = {
  tabWrapper: {
    paddingHorizontal: scale(22),
    paddingBottom: verticalScale(10),
    paddingTop: verticalScale(4),
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(30),
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(8),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(2),
    paddingVertical: verticalScale(2),
  },
  tabIcon: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  tabLabel: {
    color: '#2C2C2C',
  },
  tabLabelActive: {
    color: '#5A0C0C',
    fontFamily: 'Inter_600SemiBold',
  },
};
