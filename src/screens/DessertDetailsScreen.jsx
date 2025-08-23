import React, { useMemo, useCallback } from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Text,
    ScrollView,
    Switch,
    Image,
    Dimensions,
    StatusBar,
    Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { toggleFavorite, selectIsFavorite } from '../redux/favoritesSlice';
import { selectTryWant, setTried, setWant } from '../redux/tryWantSlice';

import onboardingBG from '../assets/images/onboardingBG.png';
import { getDessertById } from '../data/desserts';
import EncyclopediaSVG from '../assets/svg/EncyclopediaSVG';
import BackArrowSVG from '../assets/svg/BackArrowSVG';
import HeartIconSVG from '../assets/svg/HeartIconSVG';
import HeartIconSVGOnPress from '../assets/svg/HeartIconSVGOnPress';

const { width } = Dimensions.get('window');
const ARROW_SIZE = 36;

export default function DessertDetailsScreen({ route }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const dessertId = route?.params?.dessertId;
    const dessert = useMemo(() => getDessertById(dessertId), [dessertId]);

    const isFav = useSelector(selectIsFavorite(dessertId || ''));
    const { tried, want } = useSelector(selectTryWant(dessertId || ''));

    const onToggleTried = useCallback(
        (value) => {
            dispatch(setTried({ id: dessertId, value }));
        },
        [dispatch, dessertId]
    );
    const onToggleWant = useCallback(
        (value) => {
            dispatch(setWant({ id: dessertId, value }));
        },
        [dispatch, dessertId]
    );

    if (!dessert) {
        return (
            <ImageBackground source={onboardingBG} style={styles.bg} resizeMode="cover">
                <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['left', 'right']}>
                    <View style={{ padding: 16, paddingTop: insets.top + 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Dessert not found</Text>
                        <Text style={{ color: '#fff' }}>Проверь параметр {'{ dessertId }'} при навигации.</Text>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground source={onboardingBG} style={styles.bg} resizeMode="cover">
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['left', 'right']}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.pageContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* HEADER */}
                    <View style={[styles.headerRow]}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                        </Pressable>

                        <View style={styles.headerCenter}>
                            <EncyclopediaSVG
                                width={Math.min(320, width - 32)}
                                height={90}
                                pointerEvents="none"
                                style={{ marginLeft: -10 }}
                            />
                        </View>

                        <View style={{ width: 34, height: 56 }} />
                    </View>


                    <View style={styles.card}>
                        <View style={styles.heroWrap}>
                            <Image source={dessert.image} style={styles.heroImg} />
                        </View>


                        <View style={styles.titleRow}>
                            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                                {dessert.title}
                            </Text>

                            <Pressable
                                style={styles.heartBtn}
                                hitSlop={8}
                                onPress={() => dispatch(toggleFavorite(dessert.id))}
                            >
                                <View style={styles.heartInner}>
                                    {isFav ? <HeartIconSVGOnPress width={28} height={28} /> : <HeartIconSVG width={28} height={28} />}
                                </View>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionBody}>{dessert.description}</Text>


                        <View style={styles.likeBlock}>
                            <View style={styles.likeRow}>
                                <Text style={styles.likeText}>I have tried it</Text>
                                <Switch
                                    value={tried}
                                    onValueChange={onToggleTried}
                                    trackColor={{ false: '#C7C7C7', true: '#00C389' }}
                                    thumbColor="#FFFFFF"
                                    ios_backgroundColor="#C7C7C7"
                                />
                            </View>
                            <View style={styles.likeRow}>
                                <Text style={styles.likeText}>I want to try it</Text>
                                <Switch
                                    value={want}
                                    onValueChange={onToggleWant}
                                    trackColor={{ false: '#C7C7C7', true: '#00C389' }}
                                    thumbColor="#FFFFFF"
                                    ios_backgroundColor="#C7C7C7"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1, paddingHorizontal: 16 },
    pageContent: { alignItems: 'center', justifyContent: 'flex-start' },

    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        position: 'relative',
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

    card: {
        width: 350,
        height: 1020,
        borderRadius: 40,
        backgroundColor: '#FFCC00',
        paddingTop: 30,
        paddingRight: 20,
        paddingBottom: 30,
        paddingLeft: 20,
        gap: 20,
        marginTop: 10,
        alignSelf: 'center',
    },

    heroWrap: { height: 220, borderRadius: 28, overflow: 'hidden' },
    heroImg: { width: '100%', height: '100%' },

    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 40,
        lineHeight: 44,
        color: '#4800FF',
        flexShrink: 1,
        marginRight: 12,
        maxWidth: 260,
    },
    heartBtn: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    heartInner: { alignItems: 'center', justifyContent: 'center' },

    sectionBody: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.32,
        color: '#7766A3',
    },

    likeBlock: {
        width: '100%',
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#AF02B2',
        borderRadius: 20,
        backgroundColor: '#FFD900',
        minHeight: 112,
    },
    likeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    likeText: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 20,
        color: '#AF02B2',
        lineHeight: 40,
    },
});
