import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    ScrollView,
    Pressable,
    Text,
    Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import onboardingBG from '../assets/images/onboardingBG.png';
import SettingsSVG from '../assets/svg/SettingsSVG';
import RightArrowSVG from '../assets/svg/RightArrowSVG';
import TouchBar from '../components/TouchBar';

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

export default function SettingsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const activeTab = TAB_BY_ROUTE[route.name] ?? 'settings';

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
                            <SettingsSVG width={260} height={80} />
                        </View>


                        <View style={styles.purpleCard}>
                            <Text style={styles.cardTitle}>Notifications</Text>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#C7C7C7', true: '#00C389' }}
                                thumbColor="#FFFFFF"
                                ios_backgroundColor="#C7C7C7"
                                accessibilityLabel="Toggle notifications"
                            />
                        </View>


                        <Pressable style={styles.purpleCard} onPress={() => navigation.navigate('History')}>
                            <Text style={styles.cardTitle}>History</Text>
                            <RightArrowSVG width={28} height={28} />
                        </Pressable>


                        <View style={styles.purpleCard}>
                            <Text style={styles.cardTitle}>Privacy & Security</Text>
                            <RightArrowSVG width={28} height={28} />
                        </View>


                        <Pressable
                            style={styles.purpleCard}
                            onPress={() => navigation.navigate('DeveloperInfo')}
                        >
                            <Text style={styles.cardTitle}>Developer Info</Text>
                            <RightArrowSVG width={28} height={28} />
                        </Pressable>

                        <Pressable
                            style={styles.purpleCard}
                            onPress={() => navigation.navigate('ResetOnboarding')}
                        >
                            <Text style={styles.cardTitle}>Reset Onboarding</Text>
                            <RightArrowSVG width={28} height={28} />
                        </Pressable>


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
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    background: { flex: 1, justifyContent: 'flex-start' },
    content: { flex: 1, alignItems: 'center', marginHorizontal: 16 },

    scroll: { flex: 1, width: '100%' },
    scrollContent: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
    },

    header: { marginTop: 80, alignItems: 'center', marginBottom: 24 },

    purpleCard: {
        width: 350,
        height: 88,
        backgroundColor: '#F390FA',
        borderWidth: 3,
        borderColor: '#000',
        borderRadius: 40,
        marginBottom: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardTitle: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 22,
        lineHeight: 38,
        letterSpacing: -0.32,
        color: '#000000',
    },

    touchBarAbs: {
        position: 'absolute',
        top: 720,
        left: 52,
        zIndex: 10,
        elevation: 10,
    },
});
