import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, ImageBackground, StatusBar, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setScores } from '../redux/scoresSlice';


import GameOver1SVG from '../assets/svg/gameIcons/GameOver1SVG';
import GameOver2SVG from '../assets/svg/gameIcons/GameOver2SVG';
import CascadeSVG from '../assets/svg/gameIcons/CascadeSVG';
import Clue1SVG from '../assets/svg/gameIcons/Clue1SVG';
import Clue2SVG from '../assets/svg/gameIcons/Clue2SVG';
import Point1SVG from '../assets/svg/gameIcons/Point1SVG';
import Point2SVG from '../assets/svg/gameIcons/Point2SVG';

const GAME_BG = require('../assets/images/gameBG.png');


const GRID_SIZE = 6;
const CELL_GAP = 4;

const BOARD_SIZE = 350;
const BOARD_BORDER = 7;
const BOARD_RADIUS = 40;
const BOARD_PADDING = 12;

const INNER = BOARD_SIZE - 2 * (BOARD_PADDING + BOARD_BORDER);
const CELL_SIZE = (INNER - CELL_GAP * (GRID_SIZE - 1)) / GRID_SIZE;

const TRAP_ICON_SCALE = 0.7;

const TRAP_COUNT = 6;
const SWEET_COUNT = 8;
const STORAGE_KEY_BEST = '@miner_best_score';

const idxToRC = (idx) => ({ r: Math.floor(idx / GRID_SIZE), c: idx % GRID_SIZE });
const rcToIdx = (r, c) => r * GRID_SIZE + c;
const neighbors = (r, c) => {
    const res = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) res.push({ r: nr, c: nc });
        }
    }
    return res;
};

export default function MinerGameScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [grid, setGrid] = useState(() =>
        Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({ type: 'empty', adj: 0, isRevealed: false }))
    );
    const firstTapDoneRef = useRef(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);


    const [hintMsg, setHintMsg] = useState('Oops, 0 points');

    const [showInfoCard, setShowInfoCard] = useState(false);


    const goTimerRef = useRef(null);


    useEffect(() => {
        (async () => {
            const v = await AsyncStorage.getItem(STORAGE_KEY_BEST);
            if (v != null) setBestScore(Number(v));
        })();
        return () => {
            if (goTimerRef.current) {
                clearTimeout(goTimerRef.current);
                goTimerRef.current = null;
            }
        };
    }, []);

    const saveBestIfNeeded = useCallback(async (s) => {
        if (s > bestScore) {
            setBestScore(s);
            await AsyncStorage.setItem(STORAGE_KEY_BEST, String(s));
        }
    }, [bestScore]);

    const hardResetGrid = () =>
        Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({ type: 'empty', adj: 0, isRevealed: false }));

    const resetGame = useCallback(() => {
        firstTapDoneRef.current = false;
        setGrid(hardResetGrid());
        setScore(0);
        setGameOver(false);
        setHintMsg('Oops, 0 points');
        setShowInfoCard(false);
        if (goTimerRef.current) {
            clearTimeout(goTimerRef.current);
            goTimerRef.current = null;
        }
    }, []);

    const generateBoard = useCallback((safeIndex) => {
        const total = GRID_SIZE * GRID_SIZE;
        const taken = new Set([safeIndex]);

        const traps = new Set();
        while (traps.size < TRAP_COUNT) {
            const idx = Math.floor(Math.random() * total);
            if (!taken.has(idx)) { traps.add(idx); taken.add(idx); }
        }

        const sweets = new Set();
        while (sweets.size < SWEET_COUNT) {
            const idx = Math.floor(Math.random() * total);
            if (!taken.has(idx)) { sweets.add(idx); taken.add(idx); }
        }

        const next = Array.from({ length: total }, (_, i) => {
            if (traps.has(i)) return { type: 'trap', adj: 0, isRevealed: false };
            if (sweets.has(i)) return { type: 'sweet', adj: 0, isRevealed: false };
            return { type: 'empty', adj: 0, isRevealed: false };
        });


        for (let i = 0; i < total; i++) {
            if (next[i].type === 'trap') continue;
            const { r, c } = idxToRC(i);
            let cnt = 0;
            for (const { r: nr, c: nc } of neighbors(r, c)) if (traps.has(rcToIdx(nr, nc))) cnt++;
            next[i].adj = cnt;
        }
        return next;
    }, []);

    const floodReveal = useCallback((startIdx, baseGrid) => {
        const out = [...baseGrid];
        const q = [startIdx];
        const seen = new Set([startIdx]);

        while (q.length) {
            const idx = q.shift();
            const cell = out[idx];
            if (cell.isRevealed) continue;

            cell.isRevealed = true;

            if (cell.type === 'empty' && cell.adj === 0) {
                const { r, c } = idxToRC(idx);
                for (const { r: nr, c: nc } of neighbors(r, c)) {
                    const nidx = rcToIdx(nr, nc);
                    if (seen.has(nidx)) continue;
                    const ncell = out[nidx];

                    if (ncell.type === 'trap') continue;

                    if (ncell.type === 'empty' && ncell.adj === 0) {
                        seen.add(nidx);
                        q.push(nidx);
                    } else if (ncell.type === 'empty' && ncell.adj > 0) {
                        ncell.isRevealed = true;
                        seen.add(nidx);
                    }
                }
            }
        }
        return out;
    }, []);

    const showGameOver = useCallback(async (finalGrid, finalScore) => {
        const next = finalGrid.map((c) => (c.type === 'trap' ? { ...c, isRevealed: true } : c));
        setGrid(next);
        setGameOver(true);
        setHintMsg('Oops! Game over');
        setShowInfoCard(true);
        await saveBestIfNeeded(finalScore);


        const newBest = finalScore > bestScore ? finalScore : bestScore;


        dispatch(setScores({ last: finalScore, best: newBest }));


        if (goTimerRef.current) clearTimeout(goTimerRef.current);
        goTimerRef.current = setTimeout(() => {
            navigation.navigate('GameResult', {
                score: finalScore,
                bestScore: newBest,
            });
        }, 3000);
    }, [saveBestIfNeeded, navigation, bestScore, dispatch]);

    const handleCellPress = useCallback((index) => {
        if (gameOver) return;

        setGrid((prev) => {
            let board = prev;

            if (!firstTapDoneRef.current) {
                board = generateBoard(index);
                firstTapDoneRef.current = true;
            } else {
                board = [...prev];
            }

            const cell = board[index];
            if (cell.isRevealed) return board;

            setShowInfoCard(true);

            if (cell.type === 'trap') { showGameOver(board, score); return board; }

            if (cell.type === 'sweet') {
                cell.isRevealed = true;
                setScore((s) => {
                    const ns = s + 1;
                    setHintMsg(ns % 3 === 0 ? 'WOW! Keep going!' : 'Great! +1 point');
                    return ns;
                });
                return board;
            }

            if (cell.type === 'empty') {
                if (cell.adj === 0) {
                    board = floodReveal(index, board);
                    setHintMsg('There might be something on the left…');
                } else {
                    cell.isRevealed = true;
                    setHintMsg(`Hmm… ${cell.adj} traps nearby`);
                }
                return board;
            }

            return board;
        });
    }, [floodReveal, showGameOver, score, gameOver, generateBoard]);


    useEffect(() => {
        if (gameOver || !firstTapDoneRef.current) return;
        const cleared = grid.every((cell) => cell.type === 'trap' || cell.isRevealed);
        if (cleared) {
            setGameOver(true);
            setHintMsg('Sweet! You cleared the board!');
            setShowInfoCard(true);
            (async () => {
                await saveBestIfNeeded(score);
                const winBest = score > bestScore ? score : bestScore;
                dispatch(setScores({ last: score, best: winBest }));
            })();
        }
    }, [grid, gameOver, score, saveBestIfNeeded, bestScore, dispatch]);

    const cells = useMemo(() => {
        return grid.map((cell, idx) => {
            const isEndOfRow = idx % GRID_SIZE === GRID_SIZE - 1;
            let inner = null;

            if (cell.isRevealed) {
                if (cell.type === 'trap') {
                    const Icon = idx % 2 === 0 ? GameOver1SVG : GameOver2SVG;
                    const size = CELL_SIZE * TRAP_ICON_SCALE;
                    inner = (
                        <View style={styles.iconWrap}>
                            <Icon width={size} height={size} />
                        </View>
                    );
                } else if (cell.type === 'sweet') {
                    const Icon = idx % 2 === 0 ? Point1SVG : Point2SVG;
                    const size = CELL_SIZE * TRAP_ICON_SCALE;
                    inner = (
                        <View style={styles.iconWrap}>
                            <Icon width={size} height={size} />
                        </View>
                    );
                } else if (cell.adj > 0) {
                    const Icon = cell.adj % 2 === 0 ? Clue2SVG : Clue1SVG;
                    const size = CELL_SIZE * TRAP_ICON_SCALE;
                    inner = (
                        <View style={styles.iconWrap}>
                            <Icon width={size} height={size} />
                        </View>
                    );
                } else {
                    const size = CELL_SIZE * TRAP_ICON_SCALE;
                    inner = (
                        <View style={styles.iconWrap}>
                            <CascadeSVG width={size} height={size} />
                        </View>
                    );
                }
            }

            return (
                <Pressable
                    key={idx}
                    onPress={() => handleCellPress(idx)}
                    disabled={cell.isRevealed || gameOver}
                    style={[
                        styles.cellBase,
                        cell.isRevealed ? styles.cellRevealed : styles.cellClosed,
                        {
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            marginRight: isEndOfRow ? 0 : CELL_GAP,
                            marginBottom: CELL_GAP,
                        },
                    ]}
                >
                    {inner}
                </Pressable>
            );
        });
    }, [grid, handleCellPress, gameOver]);

    return (
        <SafeAreaView style={styles.root} edges={[]}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" />
            <ImageBackground source={GAME_BG} style={styles.background} resizeMode="stretch">
                <SafeAreaView style={styles.contentWrap} edges={['top', 'bottom']}>
                    <View style={styles.content}>
                        <View style={styles.board}>
                            <View style={styles.gridRowWrap}>{cells}</View>
                        </View>

                        {showInfoCard && (
                            <View style={styles.infoCard}>
                                <View style={styles.infoTextBox}>
                                    <Text
                                        style={styles.infoCardText}
                                        numberOfLines={3}
                                        adjustsFontSizeToFit
                                        minimumFontScale={0.65}
                                        allowFontScaling
                                    >
                                        {hintMsg}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: 'black' },
    background: { flex: 1 },
    contentWrap: { flex: 1, backgroundColor: 'transparent' },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        paddingHorizontal: 16,
    },

    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        padding: BOARD_PADDING,
        borderWidth: BOARD_BORDER,
        borderRadius: BOARD_RADIUS,
        borderColor: '#7D4F4F',
        backgroundColor: '#FEB942',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    gridRowWrap: {
        width: INNER,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
    },

    cellBase: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#7C2403',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellClosed: { backgroundColor: '#FF8C63' },
    cellRevealed: { backgroundColor: '#E7B179' },

    iconWrap: {
        width: '92%',
        height: '92%',
        alignItems: 'center',
        justifyContent: 'center',
    },


    infoCard: {
        width: 273,
        height: 120,
        borderWidth: 5,
        borderRadius: 30,
        backgroundColor: '#FF8C63',
        borderColor: '#FFCC00',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    infoTextBox: {
        width: '86%',
        paddingHorizontal: 6,
    },
    infoCardText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'BagelFatOne-Regular',
        fontWeight: '400',
        fontSize: 28,
        letterSpacing: -0.32,
        color: '#462149',
        includeFontPadding: false,
    },
});
