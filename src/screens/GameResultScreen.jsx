import React from 'react';
import { StyleSheet, ImageBackground, StatusBar, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectScores } from '../redux/scoresSlice';

import TryAgainButtonSVG from '../assets/svg/TryAgainButtonSVG';
import LeaveButtonSVG from '../assets/svg/LeaveButtonSVG';

const GAME_BG = require('../assets/images/gameBG.png');


function StrokedText({
    children,
    stroke = 5,
    strokeColor = '#B20228',
    fillColor = '#FFF78B',
    style,
    width,
    height,
}) {
    const offsets = [
        [-stroke, 0], [stroke, 0], [0, -stroke], [0, stroke],
        [-stroke, -stroke], [stroke, -stroke], [-stroke, stroke], [stroke, stroke],
    ];
    const baseProps = {
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.6,
        allowFontScaling: true,
        style: [style, { width, textAlign: 'center' }],
    };
    return (
        <View style={[styles.strokeWrap, { width, height }]}>
            <Text {...baseProps} style={[baseProps.style, { color: '#000', opacity: 0 }]}>{children}</Text>
            {offsets.map(([x, y], i) => (
                <Text key={i}
                    {...baseProps}
                    style={[
                        baseProps.style,
                        styles.strokeLayer,
                        { color: strokeColor, transform: [{ translateX: x }, { translateY: y }] },
                    ]}
                >
                    {children}
                </Text>
            ))}
            <Text {...baseProps} style={[baseProps.style, styles.strokeLayer, { color: fillColor }]}>{children}</Text>
        </View>
    );
}

export default function GameResultScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { last, best } = useSelector(selectScores);
    const score = route.params?.score ?? last;
    const bestScore = route.params?.bestScore ?? best;

    return (
        <SafeAreaView style={styles.root} edges={[]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ImageBackground source={GAME_BG} style={styles.bg} resizeMode="cover">
                <SafeAreaView style={styles.content} edges={['top', 'bottom', 'left', 'right']}>


                    <View style={styles.titleWrap}>
                        <StrokedText
                            width={323}
                            height={65}
                            stroke={5}
                            strokeColor="#B20228"
                            fillColor="#FFF78B"
                            style={styles.titleText}
                        >
                            YOUR SCORE
                        </StrokedText>
                    </View>


                    <View style={styles.scoreWrap}>
                        <StrokedText
                            width={323}
                            height={65}
                            stroke={5}
                            strokeColor="#B20228"
                            fillColor="#00FFDD"
                            style={styles.scoreText}
                        >
                            {String(score ?? 0)}
                        </StrokedText>
                    </View>


                    <View style={styles.recordWrap}>
                        <StrokedText
                            width={323}
                            height={65}
                            stroke={5}
                            strokeColor="#B20228"
                            fillColor="#FFEE00"
                            style={styles.recordText}
                        >
                            {`RECORD ${String(bestScore ?? 0)}`}
                        </StrokedText>
                    </View>


                    <View style={styles.buttonsWrap}>
                        <Pressable onPress={() => navigation.replace('MinerGame')} style={styles.btn}>
                            <TryAgainButtonSVG width={260} height={80} />
                        </Pressable>
                        <Pressable onPress={() => navigation.navigate('Game')} style={styles.btn}>
                            <LeaveButtonSVG width={260} height={80} />
                        </Pressable>
                    </View>


                </SafeAreaView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },
    bg: { flex: 1 },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },


    titleWrap: {
        width: 323,
        height: 65,
        marginTop: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 30,
        lineHeight: 65,
        letterSpacing: -0.32,
        textAlign: 'center',
    },


    scoreWrap: {
        width: 323,
        height: 65,
        marginTop: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 60,
        lineHeight: 65,
        letterSpacing: -0.32,
        textAlign: 'center',
    },


    recordWrap: {
        width: 323,
        height: 65,
        marginTop: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordText: {
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 40,
        lineHeight: 65,
        letterSpacing: -0.32,
        textAlign: 'center',
    },


    buttonsWrap: {
        marginTop: 'auto',
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
    },


    strokeWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    strokeLayer: {
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
});
