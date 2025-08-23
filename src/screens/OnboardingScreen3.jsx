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
import { useOnboarding } from '../hooks/useOnboarding';
import onboardingBG from '../assets/images/onboardingBG.png';
import PlaySVG from '../assets/svg/PlaySVG';
import PlayTheSVG from '../assets/svg/PlayTheSVG';
import BuildSVG from '../assets/svg/BuildSVG';
import GetStartedButtonSVG from '../assets/svg/GetStartedButtonSVG';

const OnboardingScreen3 = () => {
    const navigation = useNavigation();
    const { markOnboardingAsCompleted } = useOnboarding();

    const handleGetStarted = async () => {
        await markOnboardingAsCompleted();
        navigation.navigate('Main');
    };

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <PlaySVG width={280} height={80} />
                        </View>

                        <View style={styles.playTheWrapper}>
                            <PlayTheSVG width={300} height={60} />
                        </View>

                        <View style={styles.buildWrapper}>
                            <BuildSVG width={260} height={90} />
                        </View>

                        <View style={styles.buttonWrapper}>
                            <Pressable onPress={handleGetStarted} hitSlop={12}>
                                <GetStartedButtonSVG width={240} height={64} />
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
    playTheWrapper: { marginTop: 190, alignItems: 'center' },
    buildWrapper: { marginTop: 20, alignItems: 'center' },
    buttonWrapper: { marginTop: 65, alignItems: 'center' },
});

export default OnboardingScreen3;
