import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingCheck from '../components/OnboardingCheck';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
import OnboardingScreen3 from '../screens/OnboardingScreen3';
import MainScreen from '../screens/MainScreen';
import MyTastingScreen from '../screens/MyTastingScreen';
import NewTastingFormScreen from '../screens/NewTastingFormScreen';
import DessertDetailsScreen from '../screens/DessertDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import ShowcaseNewFormScreen from '../screens/ShowcaseNewFormScreen';
import CollectionDetailsScreen from '../screens/CollectionDetailsScreen';
import NewCollectionFormScreen from '../screens/NewCollectionFormScreen';
import GameScreen from '../screens/GameScreen';
import MinerGameScreen from '../screens/MinerGameScreen';
import GameResultScreen from '../screens/GameResultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import DeveloperInfoScreen from '../screens/DeveloperInfoScreen';
import ResetOnboardingScreen from '../screens/ResetOnboardingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="OnboardingCheck">
                <Stack.Screen name="OnboardingCheck" component={OnboardingCheck} />
                <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
                <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
                <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="MyTasting" component={MyTastingScreen} />
                <Stack.Screen name="NewTastingForm" component={NewTastingFormScreen} />
                <Stack.Screen name="DessertDetails" component={DessertDetailsScreen} />
                <Stack.Screen name="Favorites" component={FavoritesScreen} />
                <Stack.Screen name="Collections" component={CollectionsScreen} />
                <Stack.Screen name="ShowcaseNewForm" component={ShowcaseNewFormScreen} />
                <Stack.Screen name="CollectionDetails" component={CollectionDetailsScreen} />
                <Stack.Screen name="NewCollectionForm" component={NewCollectionFormScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="MinerGame" component={MinerGameScreen} />
                <Stack.Screen name="GameResult" component={GameResultScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="DeveloperInfo" component={DeveloperInfoScreen} />
                <Stack.Screen name="ResetOnboarding" component={ResetOnboardingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
