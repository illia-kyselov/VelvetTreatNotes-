import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    Text,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOnboarding } from '../hooks/useOnboarding';
import onboardingBG from '../assets/images/onboardingBG.png';
import BackArrowSVG from '../assets/svg/BackArrowSVG';

export default function ResetOnboardingScreen() {
    const navigation = useNavigation();
    const { resetOnboarding } = useOnboarding();

    const handleReset = async () => {
        await resetOnboarding();
        navigation.navigate('OnboardingCheck');
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <BackArrowSVG width={36} height={36} />
                        </Pressable>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.title}>Reset Onboarding</Text>
                        <Text style={styles.description}>
                            Are you sure you want to reset the onboarding? This will show the welcome screens again on the next app launch.
                        </Text>

                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.cancelButton} onPress={handleCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.resetButton} onPress={handleReset}>
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    background: { flex: 1, justifyContent: 'flex-start' },
    content: { flex: 1, alignItems: 'center', marginHorizontal: 16 },

    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },

    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    card: {
        width: 350,
        backgroundColor: '#FFCC00',
        borderWidth: 5,
        borderColor: '#462149',
        borderRadius: 40,
        padding: 30,
        alignItems: 'center',
    },

    title: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 32,
        color: '#462149',
        marginBottom: 20,
        textAlign: 'center',
    },

    description: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 18,
        color: '#462149',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },

    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
    },

    cancelButton: {
        backgroundColor: '#C7C7C7',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#462149',
    },

    cancelButtonText: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 18,
        color: '#462149',
    },

    resetButton: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#462149',
    },

    resetButtonText: {
        fontFamily: 'BagelFatOne-Regular',
        fontSize: 18,
        color: '#462149',
    },
});
