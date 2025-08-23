import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    Text,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import onboardingBG from '../assets/images/onboardingBG.png';
import DeveloperInfoSVG from '../assets/svg/DeveloperInfoSVG';
import BackArrowSVG from '../assets/svg/BackArrowSVG';

export default function DeveloperInfoScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground source={onboardingBG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>

                <View style={[styles.headerRow, { paddingTop: 12 }]}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={styles.backBtn}
                    >
                        <BackArrowSVG width={40} height={40} />
                    </Pressable>

                    <View style={styles.titleWrap}>
                        <DeveloperInfoSVG width={260} height={76} />
                    </View>

                    <View style={styles.rightSpacer} />
                </View>


                <View style={styles.yellowCard}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.textContainer}
                    >
                        <Text style={styles.cardText}>
                            Velvet Treat Notes was lovingly crafted by a team of dessert enthusiasts, designers,
                            and developers who believe in the joy of sweet experiences. With backgrounds in culinary
                            arts, design, and mobile development, we set out to create an app that feels like walking
                            into your favorite candy shop — warm, delightful, and full of discovery.
                        </Text>
                        <Text style={[styles.cardText, { marginTop: 16 }]}>
                            Our goal is to celebrate the world’s dessert culture while giving you a cozy space to
                            collect, remember, and enjoy your sweetest moments. We hope Velvet Treat Notes inspires
                            you to try something new, document what you love, and play with flavor — one bite at a time.
                        </Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    background: { flex: 1, justifyContent: 'flex-start' },

    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
        marginTop: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightSpacer: { width: 14, height: 44 },

    yellowCard: {
        width: 350,
        height: 573,
        backgroundColor: '#FFCC00',
        borderWidth: 5,
        borderColor: '#462149',
        borderRadius: 40,
        alignSelf: 'center',
        marginLeft: 20,
        padding: 20,
    },
    textContainer: {
        paddingBottom: 12,
    },
    cardText: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 19,
        lineHeight: 25,
        letterSpacing: -0.32,
        color: '#462149',
    },
});
