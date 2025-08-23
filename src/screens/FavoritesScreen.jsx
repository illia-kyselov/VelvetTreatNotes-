import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    Dimensions,
    ScrollView,
    Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import onboardingBG from '../assets/images/onboardingBG.png';
import FavoritesSVG from '../assets/svg/FavoritesSVG';
import BackArrowSVG from '../assets/svg/BackArrowSVG';
import TouchBar from '../components/TouchBar';
import DessertCard from '../components/DessertCard';

import { DESSERTS } from '../data/desserts';
import { selectFavorites } from '../redux/favoritesSlice';

const { width } = Dimensions.get('window');
const ARROW_SIZE = 36;

const ROUTE_BY_TAB = {
    encyclopedia: 'Main',
    journal: 'MyTasting',
    collections: 'Collections',
    favorites: 'Favorites',
    game: 'Game',
    settings: 'Settings',
};

export default function FavoritesScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const favorites = useSelector(selectFavorites);
    const favDesserts = DESSERTS.filter(d => favorites.includes(d.id));

    return (
        <ImageBackground source={onboardingBG} style={styles.bg} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['left', 'right']}>
                <View style={[styles.headerRow, { paddingTop: 22 }]}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.navigate('Main')}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <FavoritesSVG
                            width={Math.min(320, width - 32)}
                            height={90}
                            pointerEvents="none"

                            style={{ transform: [{ translateX: -16 }] }}
                        />
                    </View>

                    <View style={{ width: 54, height: 56 }} />
                </View>


                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {favDesserts.length ? (
                        favDesserts.map(d => (
                            <DessertCard
                                key={d.id}
                                item={d}
                                onPress={() => navigation.navigate('DessertDetails', { dessertId: d.id })}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyText}>No favorites yet</Text>
                        </View>
                    )}


                    <View style={{ height: 180 }} />
                </ScrollView>


                <TouchBar
                    active="favorites"
                    style={styles.touchBarAbs}
                    onTabPress={(key) => {
                        const target = ROUTE_BY_TAB[key];
                        if (target) navigation.navigate(target);
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1, paddingHorizontal: 16 },

    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 40,
    },
    backButton: {
        width: 64,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
    headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    scrollContent: { alignItems: 'center', justifyContent: 'flex-start' },

    emptyWrap: { marginTop: 40, alignItems: 'center' },
    emptyText: { fontFamily: 'BagelFatOne-Regular', fontSize: 20, color: '#fff' },

    touchBarAbs: {
        position: 'absolute',
        top: 720,
        left: 52,
        zIndex: 10,
        elevation: 10,
    },
});
