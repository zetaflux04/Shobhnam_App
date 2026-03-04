import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

const TAB_CONFIG = {
  service: { label: 'Service', activeIcon: 'grid', inactiveIcon: 'grid-outline' },
  orders: { label: 'Orders', activeIcon: 'bag', inactiveIcon: 'bag-outline' },
  profile: { label: 'Profile', activeIcon: 'settings', inactiveIcon: 'settings-outline' },
};

/**
 * @param {import('@react-navigation/bottom-tabs').BottomTabBarProps} props
 */
function CustomTabBar({ state, descriptors, navigation }) {
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
        {state.routes.map((route, index) => {
          const isFocused = focusedRouteKey === route.name;
          const config = TAB_CONFIG[route.name];

          // Skip any unexpected routes to avoid crashes
          if (!config) {
            return null;
          }
          const iconName = isFocused ? config.activeIcon : config.inactiveIcon ?? config.activeIcon;

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
              <Ionicons name={iconName} size={moderateScale(20)} color={isFocused ? '#5A0C0C' : '#777B83'} />
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
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(14),
    paddingTop: verticalScale(6),
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(28),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(4),
  },
  tabLabel: {
    color: '#777B83',
  },
  tabLabelActive: {
    color: '#5A0C0C',
    fontFamily: 'Inter_600SemiBold',
  },
};
