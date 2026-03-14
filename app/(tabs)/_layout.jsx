import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

import { colors, textVariants } from '../../styles/theme';

const TAB_CONFIG = {
  service: { label: 'Service' },
  orders: { label: 'Orders' },
  profile: { label: 'Profile' },
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
              <View style={[styles.iconBadge, isFocused ? styles.iconBadgeActive : null]}>
                <TabIcon routeName={route.name} color={isFocused ? '#FFFFFF' : '#2C2C2C'} />
              </View>
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

function TabIcon({ routeName, color }) {
  if (routeName === 'service') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.0164 11.9669C16.1119 11.9669 16.9999 11.0789 16.9999 9.98347C16.9999 8.88803 16.1119 8 15.0164 8C13.921 8 13.033 8.88803 13.033 9.98347C13.033 11.0789 13.921 11.9669 15.0164 11.9669Z"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.98348 11.9669C10.0789 11.9669 10.9669 11.0789 10.9669 9.98347C10.9669 8.88803 10.0789 8 8.98348 8C7.88804 8 7 8.88803 7 9.98347C7 11.0789 7.88804 11.9669 8.98348 11.9669Z"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M15.0164 18.0001C16.1119 18.0001 16.9999 17.1121 16.9999 16.0167C16.9999 14.9212 16.1119 14.0332 15.0164 14.0332C13.921 14.0332 13.033 14.9212 13.033 16.0167C13.033 17.1121 13.921 18.0001 15.0164 18.0001Z"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.98348 18.0001C10.0789 18.0001 10.9669 17.1121 10.9669 16.0167C10.9669 14.9212 10.0789 14.0332 8.98348 14.0332C7.88804 14.0332 7 14.9212 7 16.0167C7 17.1121 7.88804 18.0001 8.98348 18.0001Z"
          stroke={color}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (routeName === 'orders') {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M8.40002 6.5H15.6C19 6.5 19.34 8.09 19.57 10.03L20.47 17.53C20.76 19.99 20 22 16.5 22H7.51003C4.00003 22 3.24002 19.99 3.54002 17.53L4.44003 10.03C4.66003 8.09 5.00002 6.5 8.40002 6.5Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8 8V4.5C8 3 9 2 10.5 2H13.5C15 2 16 3 16 4.5V8"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20.41 17.0303H8"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12.8804V11.1204C2 10.0804 2.85 9.22043 3.9 9.22043C5.71 9.22043 6.45 7.94042 5.54 6.37042C5.02 5.47042 5.33 4.30042 6.24 3.78042L7.97 2.79042C8.76 2.32042 9.78 2.60042 10.25 3.39042L10.36 3.58042C11.26 5.15042 12.74 5.15042 13.65 3.58042L13.76 3.39042C14.23 2.60042 15.25 2.32042 16.04 2.79042L17.77 3.78042C18.68 4.30042 18.99 5.47042 18.47 6.37042C17.56 7.94042 18.3 9.22043 20.11 9.22043C21.15 9.22043 22.01 10.0704 22.01 11.1204V12.8804C22.01 13.9204 21.16 14.7804 20.11 14.7804C18.3 14.7804 17.56 16.0604 18.47 17.6304C18.99 18.5404 18.68 19.7004 17.77 20.2204L16.04 21.2104C15.25 21.6804 14.23 21.4004 13.76 20.6104L13.65 20.4204C12.75 18.8504 11.27 18.8504 10.36 20.4204L10.25 20.6104C9.78 21.4004 8.76 21.6804 7.97 21.2104L6.24 20.2204C5.33 19.7004 5.02 18.5304 5.54 17.6304C6.45 16.0604 5.71 14.7804 3.9 14.7804C2.85 14.7804 2 13.9204 2 12.8804Z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
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
  iconBadge: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeActive: {
    backgroundColor: '#5A0C0C',
  },
  tabLabel: {
    color: '#2C2C2C',
  },
  tabLabelActive: {
    color: '#5A0C0C',
    fontFamily: 'Inter_600SemiBold',
  },
};
