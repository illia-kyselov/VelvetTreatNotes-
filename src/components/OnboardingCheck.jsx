import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useOnboarding } from '../hooks/useOnboarding';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import MainScreen from '../screens/MainScreen';

export default function OnboardingCheck() {
    const { isOnboardingCompleted, isLoading } = useOnboarding();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6F3CF6" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (isOnboardingCompleted) {
        return <MainScreen />;
    }

    return <OnboardingScreen1 />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingText: {
        marginTop: 16,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'BagelFatOne-Regular',
    },
});
