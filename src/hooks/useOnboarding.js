import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

export const useOnboarding = () => {
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkOnboardingStatus();
    }, []);

    const checkOnboardingStatus = async () => {
        try {
            const status = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
            setIsOnboardingCompleted(status === 'true');
        } catch (error) {
            console.error('Error checking onboarding status:', error);
            setIsOnboardingCompleted(false);
        } finally {
            setIsLoading(false);
        }
    };

    const markOnboardingAsCompleted = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
            setIsOnboardingCompleted(true);
        } catch (error) {
            console.error('Error marking onboarding as completed:', error);
        }
    };

    const resetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
            setIsOnboardingCompleted(false);
        } catch (error) {
            console.error('Error resetting onboarding:', error);
        }
    };

    return {
        isOnboardingCompleted,
        isLoading,
        markOnboardingAsCompleted,
        resetOnboarding,
    };
};
