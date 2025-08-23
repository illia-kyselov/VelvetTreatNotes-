import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    StatusBar,
    View,
    Image,
    Pressable,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectScores } from '../redux/scoresSlice';

import SweetMinerSVG from '../assets/svg/SweetMinerSVG';
import PlayButtonSVG from '../assets/svg/PlayButtonSVG';
import TouchBar from '../components/TouchBar';

const GAME_BG = require('../assets/images/gameBG.png');
const CAKE = require('../assets/images/Cake.png');
const LOLLIPOP = require('../assets/images/Lollipop.png');

const ROUTE_BY_TAB = {
    encyclopedia: 'Main',
    journal: 'MyTasting',
    collections: 'Collections',
    favorites: 'Favorites',
    game: 'Game',
    settings: 'Settings',
};

export default function GameScreen() {
    const navigation = useNavigation();
    const { best } = useSelector(selectScores);

    const handlePlay = () => {
        navigation.navigate('MinerGame');
    };

    return (
        <ImageBackground source={GAME_BG} style={styles.bg} resizeMode="cover">
            <SafeAreaView style={[styles.root, { backgroundColor: 'transparent' }]} edges={[]}>
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <SafeAreaView style={styles.content} edges={['top', 'bottom', 'left', 'right']}>
                        <View style={styles.topRow}>
                            <View style={styles.iconBoxCake}>
                                <Image source={CAKE} style={styles.iconImg} resizeMode="contain" />
                            </View>

                            <View style={styles.iconBoxLollipop}>
                                <Image source={LOLLIPOP} style={styles.iconImg} resizeMode="contain" />
                            </View>
                        </View>

                        <View style={styles.titleWrapper}>
                            <SweetMinerSVG width={260} height={120} />
                        </View>

                        <View style={styles.bestScoreWrap}>
                            <Text
                                style={styles.bestScoreText}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.7}
                                allowFontScaling
                                accessibilityRole="text"
                                accessibilityLabel={`Your best score is ${best ?? 0}`}
                            >
                                {`Your best score is ${best ?? 0}`}
                            </Text>
                        </View>

                        <View style={styles.playWrapper}>
                            <Pressable accessibilityRole="button" onPress={handlePlay} hitSlop={8}>
                                <PlayButtonSVG width={300} height={80} />
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </ScrollView>

                <TouchBar
                    active="game"
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
    root: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1 },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingBottom: 86,
    },

    content: {
        flex: 1,
        alignItems: 'center',
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: 120,
    },

    iconBoxCake: {
        width: 160,
        height: 145,
        marginLeft: -5,
        marginTop: -60,
    },
    iconBoxLollipop: {
        width: 100,
        height: 100,
        marginRight: 5,
        marginTop: -40,
    },

    iconImg: { width: '100%', height: '100%' },

    titleWrapper: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bestScoreWrap: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bestScoreText: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 20,
        letterSpacing: -0.32,
        color: '#6F3CF6',
    },

    playWrapper: {
        marginTop: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    touchBarAbs: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
        elevation: 10,
    },
});
