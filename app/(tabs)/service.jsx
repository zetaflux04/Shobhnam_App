import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScaledSheet, moderateScale, scale, verticalScale } from 'react-native-size-matters';

import api from '../../lib/api';
import { colors, textVariants } from '../../styles/theme';

const PLACEHOLDER_ARTIST_IMAGE = require('../../assets/service/artist 1.png');

const serviceCards = [
  {
    title: 'Ramleela',
    image: require('../../assets/service/card-1.png'),
    gradient: ['rgba(255,167,38,0.72)', 'rgba(255,167,38,0.35)'],
  },
  {
    title: 'Sunderkand',
    image: require('../../assets/service/card-2.png'),
    gradient: ['rgba(237,122,39,0.7)', 'rgba(237,122,39,0.35)'],
  },
  {
    title: 'Bhajan sandhya',
    image: require('../../assets/service/card-3.png'),
    gradient: ['rgba(51,153,117,0.7)', 'rgba(51,153,117,0.35)'],
  },
  {
    title: 'Bhagwat katha',
    image: require('../../assets/service/card-4.png'),
    gradient: ['rgba(69,119,170,0.7)', 'rgba(69,119,170,0.35)'],
  },
  {
    title: 'Rudrabhishek',
    image: require('../../assets/service/card-5.png'),
    gradient: ['rgba(0,126,137,0.7)', 'rgba(0,126,137,0.35)'],
  },
  {
    title: 'Other services',
    image: require('../../assets/service/card-6.png'),
    gradient: ['rgba(165,52,102,0.7)', 'rgba(165,52,102,0.35)'],
  },
];

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function ServiceScreen() {
  const router = useRouter();
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get('/artists', { params: { limit: 6 } });
        const list = res.data?.data?.artists ?? [];
        setFeaturedArtists(
          list.map((a) => ({
            id: a._id,
            name: a.name,
            tag: a.category ?? 'Artist',
            image: a.profilePhoto ? { uri: a.profilePhoto } : PLACEHOLDER_ARTIST_IMAGE,
          }))
        );
      } catch {
        setFeaturedArtists([]);
      } finally {
        setLoadingArtists(false);
      }
    };
    fetchArtists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const [bookingsRes, ordersRes] = await Promise.all([
            api.get('/bookings/user').catch(() => ({ data: { data: [] } })),
            api.get('/orders/user').catch(() => ({ data: { data: [] } })),
          ]);
          if (cancelled) return;
          const bookings = bookingsRes.data?.data ?? [];
          const orders = (ordersRes.data?.data ?? []).filter((o) => o.paymentStatus === 'PAID');
          const merged = [
            ...bookings.map((b) => ({
              id: b._id,
              type: 'booking',
              title: b.eventDetails?.type ?? 'Event',
              artist: b.artist?.name ?? 'Artist',
              date: b.eventDetails?.date ? new Date(b.eventDetails.date) : new Date(0),
              amount: b.pricing?.agreedPrice ?? 0,
            })),
            ...orders.map((o) => ({
              id: o._id,
              type: 'order',
              title: o.items?.[0]?.serviceName ?? 'Order',
              artist: o.items?.[0]?.packageTitle ?? '',
              date: o.createdAt ? new Date(o.createdAt) : new Date(0),
              amount: o.grandTotal ?? 0,
            })),
          ];
          merged.sort((a, b) => b.date - a.date);
          setRecentOrders(merged.slice(0, 5));
        } catch {
          if (!cancelled) setRecentOrders([]);
        } finally {
          if (!cancelled) setLoadingOrders(false);
        }
      };
      fetchOrders();
      return () => { cancelled = true; };
    }, [])
  );

  const serviceRoutes = {
    ramleela: '/ramleela',
    sunderkand: '/sunderkand',
    'bhajan sandhya': '/bhajan',
    rudrabhishek: '/rudra',
    'bhagwat katha': '/bhagwat-katha',
    'other services': '/other-services',
  };

  /**
   * Navigate to detail screens for selectable services.
   * @param {string} title
   */
  const handleServicePress = (title) => {
    const route = serviceRoutes[title.toLowerCase()];
    if (route) {
      router.push(route);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="flower-outline" size={moderateScale(18)} color="#5A0C0C" />
            <TextInput
              placeholder="Search for Jagrata..."
              placeholderTextColor="#B1B4BB"
              style={styles.searchInput}
            />
            <Ionicons name="search" size={moderateScale(18)} color="#5A0C0C" />
          </View>
          <TouchableOpacity activeOpacity={0.85} style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={moderateScale(20)} color="#20222C" />
          </TouchableOpacity>
        </View>

        <Text style={[textVariants.heading4, styles.sectionTitle]}>Our services</Text>
        <View style={styles.serviceGrid}>
          {serviceCards.map((card) => {
            const isNavigable = Boolean(serviceRoutes[card.title.toLowerCase()]);
            return (
              <TouchableOpacity
                key={card.title}
                activeOpacity={isNavigable ? 0.9 : 1}
                disabled={!isNavigable}
                onPress={() => handleServicePress(card.title)}
                style={styles.serviceCard}
              >
                <ImageBackground
                  source={card.image}
                  style={[styles.serviceCardBg, { backgroundColor: card.gradient[0] }]}
                  imageStyle={styles.serviceImg}
                  resizeMode="cover"
                >
                  <LinearGradient colors={card.gradient} style={styles.serviceOverlay} />
                  <LinearGradient
                    colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.05)']}
                    style={styles.serviceOverlay}
                  />
                  <Text style={[textVariants.heading4, styles.serviceText]}>{card.title}</Text>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[textVariants.heading4, styles.sectionTitle]}>Search artist nearby</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.mapCardWrapper}
          onPress={() => router.push('/discover')}
        >
          <ImageBackground source={require('../../assets/service/Map.png')} style={styles.mapCard} imageStyle={styles.mapImg}>
            <LinearGradient colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.05)']} style={styles.mapOverlay} />
            <Text style={[textVariants.heading4, styles.mapText]}>Discover artist in New Delhi</Text>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={[textVariants.heading4, styles.sectionTitle]}>Featured artists</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.pillButton}
            onPress={() => router.push('/discover')}
          >
            <Ionicons name="chevron-forward" size={moderateScale(16)} color="#20222C" />
          </TouchableOpacity>
        </View>
        {loadingArtists ? (
          <View style={styles.artistsLoading}>
            <ActivityIndicator size="small" color="#5A0C0C" />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowCards}>
            {featuredArtists.map((artist, idx) => (
              <TouchableOpacity
                key={artist.id ?? `${artist.name}-${idx}`}
                style={styles.artistCard}
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: '/discover/profile', params: { artistId: artist.id } })}
              >
                <Image source={artist.image} style={styles.artistImage} />
                <Text style={[textVariants.body1, styles.artistName]}>{artist.name}</Text>
                <Text style={[textVariants.body3, styles.artistTag]}>{artist.tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {(loadingOrders || recentOrders.length > 0) ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[textVariants.heading4, styles.sectionTitle]}>Recent orders</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.pillButton}
                onPress={() => router.push('/(tabs)/orders')}
              >
                <Ionicons name="chevron-forward" size={moderateScale(16)} color="#20222C" />
              </TouchableOpacity>
            </View>
            {loadingOrders ? (
              <View style={styles.artistsLoading}>
                <ActivityIndicator size="small" color="#5A0C0C" />
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rowCards}>
                {recentOrders.map((order, idx) => (
                  <TouchableOpacity
                    key={`${order.id}-${idx}`}
                    style={styles.orderCard}
                    activeOpacity={0.9}
                    onPress={() => router.push('/(tabs)/orders')}
                  >
                    <View style={styles.orderCardContent}>
                      <Text style={[textVariants.body1, styles.orderCardTitle]} numberOfLines={1}>
                        {order.title}
                      </Text>
                      {order.artist ? (
                        <Text style={[textVariants.body3, styles.orderCardArtist]} numberOfLines={1}>
                          {order.artist}
                        </Text>
                      ) : null}
                      <Text style={[textVariants.body4, styles.orderCardDate]}>
                        {order.date.getTime() > 0 ? order.date.toLocaleDateString() : '—'}
                      </Text>
                      <Text style={[textVariants.heading5, styles.orderCardAmount]}>{formatCurrency(order.amount)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        ) : null}

        <View style={styles.footerNoteRow}>
          <Text style={[textVariants.body4, styles.footerNoteLight]}>India&apos;s first</Text>
          <Text style={[textVariants.heading5, styles.footerNoteStrong]}> spiritual artist app </Text>
          <Ionicons name="flower-outline" size={moderateScale(16)} color="#5A0C0C" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.base,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(30),
    gap: verticalScale(14),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(24),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    gap: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
  },
  bellButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    color: colors.text.primary,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    aspectRatio: 1.55,
    minHeight: verticalScale(110),
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    marginBottom: verticalScale(12),
  },
  serviceCardBg: {
    flex: 1,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
  },
  serviceImg: {
    borderRadius: moderateScale(14),
  },
  serviceOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  serviceText: {
    position: 'absolute',
    bottom: verticalScale(10),
    left: scale(10),
    color: colors.text.inverse,
  },
  mapCardWrapper: {
    aspectRatio: 2.7,
    minHeight: verticalScale(120),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  mapCard: {
    flex: 1,
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  mapImg: {
    borderRadius: moderateScale(16),
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  mapText: {
    position: 'absolute',
    bottom: verticalScale(12),
    left: scale(12),
    color: colors.text.inverse,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillButton: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#E3E5E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCards: {
    gap: scale(12),
    paddingVertical: verticalScale(4),
  },
  artistCard: {
    width: scale(140),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE8E8',
  },
  artistImage: {
    width: '100%',
    height: verticalScale(120),
  },
  artistName: {
    color: colors.text.primary,
    paddingHorizontal: scale(10),
    paddingTop: verticalScale(8),
  },
  artistTag: {
    color: '#6A6E75',
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(10),
  },
  orderCard: {
    width: scale(140),
    backgroundColor: colors.background.surface,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE8E8',
    padding: scale(10),
  },
  orderCardContent: {
    gap: verticalScale(4),
  },
  orderCardTitle: {
    color: colors.text.primary,
  },
  orderCardArtist: {
    color: '#6A6E75',
  },
  orderCardDate: {
    color: '#9EA3A9',
  },
  orderCardAmount: {
    color: '#5A0C0C',
    marginTop: verticalScale(4),
  },
  emptyOrders: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
    gap: verticalScale(4),
  },
  emptyOrdersText: {
    color: '#6A6E75',
  },
  emptyOrdersLink: {
    color: '#5A0C0C',
  },
  artistsLoading: {
    height: verticalScale(180),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: scale(4),
    marginTop: verticalScale(6),
  },
  footerNoteLight: {
    color: '#6A6E75',
  },
  footerNoteStrong: {
    color: '#5A0C0C',
  },
});
