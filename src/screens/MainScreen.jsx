import React from 'react';
import { SafeAreaView, StyleSheet, ImageBackground, View, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import onboardingBG from '../assets/images/onboardingBG.png';
import EncyclopediaSVG from '../assets/svg/EncyclopediaSVG';
import TouchBar from '../components/TouchBar';

import DessertCard from '../components/DessertCard';
import { DESSERTS } from '../data/desserts';

const ROUTE_BY_TAB = {
    encyclopedia: 'Main',
    journal: 'MyTasting',
    collections: 'Collections',
    favorites: 'Favorites',
    game: 'Game',
    settings: 'Settings',
};

const TAB_BY_ROUTE = {
    Main: 'encyclopedia',
    MyTasting: 'journal',
    Collections: 'collections',
    Favorites: 'favorites',
    Game: 'game',
    Settings: 'settings',
};

const BOTTOM_GAP_ABOVE_TOUCHBAR = 200;

const MainScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const activeTab = TAB_BY_ROUTE[route.name] ?? 'encyclopedia';

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <View style={styles.content}>

                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.header}>
                            <EncyclopediaSVG width={260} height={80} />
                        </View>

                        {DESSERTS.map((d) => (
                            <DessertCard
                                key={d.id}
                                item={d}
                                onPress={() => navigation.navigate('DessertDetails', { dessertId: d.id })}
                            />
                        ))}


                        <View style={{ height: BOTTOM_GAP_ABOVE_TOUCHBAR }} />
                    </ScrollView>


                    <TouchBar
                        active={activeTab}
                        style={styles.touchBarAbs}
                        onTabPress={(key) => {
                            const target = ROUTE_BY_TAB[key];
                            if (target) navigation.navigate(target);
                        }}
                    />
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    background: { flex: 1, justifyContent: 'flex-start' },

    content: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
    scroll: { flex: 1, width: '100%' },
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },
    header: { marginTop: 40, alignItems: 'center', marginBottom: 12 },
    touchBarAbs: {
        position: 'absolute',
        top: 720,
        left: 52,
        zIndex: 10,
        elevation: 10,
    },
});

export default MainScreen;
