import React, { useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    Dimensions,
    ScrollView,
    Text,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import onboardingBG from '../assets/images/onboardingBG.png';
import HistorySVG from '../assets/svg/HistorySVG';
import BackArrowSVG from '../assets/svg/BackArrowSVG';


import { clearTastings } from '../redux/tastingsSlice';
import { clearFavorites } from '../redux/favoritesSlice';
import { clearAll as clearTryWant } from '../redux/tryWantSlice';
import { clearCollections } from '../redux/collectionsSlice';
import { resetScores } from '../redux/scoresSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ARROW_SIZE = 36;


const STORAGE_KEY_BEST = '@miner_best_score';

export default function HistoryScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();


    const clearAllData = useCallback(async () => {
        dispatch(clearTastings());
        dispatch(clearFavorites());
        dispatch(clearTryWant());
        dispatch(clearCollections());
        dispatch(resetScores());
        try {
            await AsyncStorage.removeItem(STORAGE_KEY_BEST);
        } catch { }
    }, [dispatch]);

    const showDeletedAlert = useCallback(() => {
        Alert.alert(
            'History was deleted',
            'You are no longer able to see your tasting and collection history.',
            [
                { text: 'Ok' },
                { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
            ]
        );
    }, [navigation]);

    const handleClearPress = useCallback(() => {
        Alert.alert(
            'You will delete history forever',
            'Are you sure you want to delete your tasting and collection history?',
            [
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        showDeletedAlert();
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }, [clearAllData, showDeletedAlert]);

    return (
        <ImageBackground source={onboardingBG} style={styles.bg} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['left', 'right']}>

                <View style={[styles.headerRow, { paddingTop: 22 }]}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <HistorySVG
                            width={Math.min(320, width - 32)}
                            height={90}
                            pointerEvents="none"
                            style={{ transform: [{ translateX: -16 }] }}
                        />
                    </View>

                    <View style={{ width: 54, height: 56 }} />
                </View>


                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Pressable style={styles.purpleCard} onPress={handleClearPress}>
                        <Text style={styles.cardTitle}>Tasting and Collection History</Text>
                        <Pressable onPress={handleClearPress} hitSlop={8}>
                            <Text style={styles.clearText}>Clear</Text>
                        </Pressable>
                    </Pressable>

                    <View style={{ height: 40 }} />
                </ScrollView>
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
        fontSize: 20,
        lineHeight: 32,
        color: '#000',
        flexShrink: 1,
    },

    clearText: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 20,
        lineHeight: 32,
        color: '#FFEE00',
    },
});

