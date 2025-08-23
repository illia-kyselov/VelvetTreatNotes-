import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import onboardingBG from '../assets/images/onboardingBG.png';
import TrackSVG from '../assets/svg/TrackSVG';
import KeepSVG from '../assets/svg/KeepSVG';
import RecordSVG from '../assets/svg/RecordSVG';
import NextButtonSVG from '../assets/svg/NextButtonSVG';

const OnboardingScreen2 = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <TrackSVG width={280} height={80} />
                        </View>

                        <View style={styles.keepWrapper}>
                            <KeepSVG width={300} height={60} />
                        </View>

                        <View style={styles.recordWrapper}>
                            <RecordSVG width={260} height={90} />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Pressable onPress={() => navigation.navigate('Onboarding3')} hitSlop={12}>
                                <NextButtonSVG width={200} height={60} />
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    background: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    content: { alignItems: 'center' },
    title: { marginTop: 40, alignItems: 'center' },
    keepWrapper: { marginTop: 150, alignItems: 'center' },
    recordWrapper: { marginTop: 20, alignItems: 'center' },
    buttonWrapper: { marginTop: 33, alignItems: 'center' },
});

export default OnboardingScreen2;
