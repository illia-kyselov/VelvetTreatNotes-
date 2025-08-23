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
import WelcomeSVG from '../assets/svg/WelcomeSVG';
import DiscoverSVG from '../assets/svg/DiscoverSVG';
import FromSVG from '../assets/svg/FromSVG';
import NextButtonSVG from '../assets/svg/NextButtonSVG';

const OnboardingScreen1 = () => {
    const navigation = useNavigation();

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <WelcomeSVG width={280} height={80} />

                        <View style={styles.discoverWrapper}>
                            <DiscoverSVG width={300} height={60} />
                        </View>

                        <View style={styles.fromWrapper}>
                            <FromSVG width={250} height={50} />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Pressable onPress={() => navigation.navigate('Onboarding2')} hitSlop={12}>
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
    background: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    content: {
        alignItems: 'center',
    },
    discoverWrapper: {
        marginTop: 150,
        alignItems: 'center',
    },
    fromWrapper: {
        marginTop: 20,
        alignItems: 'center',
    },
    buttonWrapper: {
        marginTop: 58,
        alignItems: 'center',
    },
});

export default OnboardingScreen1;
