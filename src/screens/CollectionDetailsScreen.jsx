import React, { useMemo } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    StatusBar,
    ScrollView,
    View,
    Text,
    Pressable,
    useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    selectCollections,
    addSetToCollection,
    makeSelectSetsForCollection,
    updateSetInCollection,
} from "../redux/collectionsSlice";

import BackArrowSVG from "../assets/svg/BackArrowSVG";
import PlusButtonSVG from "../assets/svg/PlusButtonSVG";
import RightArrowSVG from "../assets/svg/RightArrowSVG";

const BG = require("../assets/images/onboardingBG.png");
const ARROW_SIZE = 36;
const BASE_FONT_SIZE = 44;
const AVG_CHAR_FACTOR = 0.60;

function StrokedText({
    children,
    stroke = 5,
    strokeColor = "#B20228",
    fillColor = "#FFEE00",
    style,
    width,
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
        style: [style, { width, textAlign: "center" }],
    };
    return (
        <View style={[styles.strokeWrap, { width }]}>
            <Text {...baseProps} style={[baseProps.style, { color: fillColor, opacity: 0 }]}>{children}</Text>
            {offsets.map(([x, y], i) => (
                <Text
                    key={i}
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
            <Text {...baseProps} style={[baseProps.style, styles.strokeLayer, { color: fillColor }]}>
                {children}
            </Text>
        </View>
    );
}

function buildLinesByWords(title, approxCharsPerLine) {
    const words = (title || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const lines = [];
    let current = "";
    for (const w of words) {
        const next = current ? `${current} ${w}` : w;
        if (next.length <= approxCharsPerLine) {
            current = next;
        } else {
            if (current) {
                lines.push(current);
                current = w;
            } else {
                lines.push(w);
                current = "";
            }
        }
    }
    if (current) lines.push(current);
    return lines;
}

export default function CollectionDetailsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    const { params } = useRoute();
    const { id } = params;

    const collections = useSelector(selectCollections);
    const collection = collections.find((c) => c.id === id);
    const title = (collection?.name ?? "").trim();

    const horizontalPadding = 16 * 2;
    const leftZone = 64;
    const rightZone = 54;
    const maxTitleWidth = Math.max(180, screenWidth - horizontalPadding - leftZone - rightZone);
    const approxCharsPerLine = Math.max(
        4,
        Math.floor(maxTitleWidth / (BASE_FONT_SIZE * AVG_CHAR_FACTOR))
    );
    const lines = useMemo(
        () => buildLinesByWords(title, approxCharsPerLine),
        [title, approxCharsPerLine]
    );

    const selectSets = useMemo(() => makeSelectSetsForCollection(id), [id]);
    const sets = useSelector(selectSets);

    const goBack = () =>
        navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Collections");

    const handleAdd = () => {
        dispatch(addSetToCollection({ collectionId: id, title: "Enter Set Title" }));
    };

    const handleOpenSet = (setId) => {
        const current = sets.find((s) => s.id === setId);
        navigation.navigate("NewCollectionForm", {
            collectionId: id,
            setId,
            parentTitle: title,
            initial: {
                title: current?.title || "",
                description: current?.description || "",
                imageUri: current?.imageUri || null,
            },
            onSave: (payload, meta) => {
                dispatch(
                    updateSetInCollection({
                        collectionId: meta.collectionId,
                        setId: meta.setId,
                        changes: payload,
                    })
                );
            },
        });
    };

    return (
        <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImage}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['left', 'right']}>

                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 140 },
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={[styles.headerRow, { paddingTop: 22 }]}>
                        <Pressable
                            style={styles.backButton}
                            onPress={goBack}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                        </Pressable>

                        <View style={styles.headerCenter}>
                            <View style={styles.titleStack}>
                                {lines.map((line, idx) => (
                                    <StrokedText
                                        key={`${idx}-${line}`}
                                        width={maxTitleWidth}
                                        stroke={5}
                                        style={styles.title}
                                    >
                                        {line}
                                    </StrokedText>
                                ))}
                            </View>
                        </View>

                        <View style={{ width: 54, height: 56 }} />
                    </View>


                    <View style={styles.setsList}>
                        {sets.length === 0 ? (
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>No sets yet</Text>
                            </View>
                        ) : (
                            sets.map((s) => (
                                <Pressable
                                    key={s.id}
                                    onPress={() => handleOpenSet(s.id)}
                                    style={styles.greenCard}
                                >
                                    <Text style={styles.greenCardTitle} numberOfLines={2}>
                                        {s.title}
                                    </Text>
                                    <View style={styles.greenCardRight}>
                                        <RightArrowSVG width={16} height={16} />
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </ScrollView>


                <Pressable
                    style={[styles.plusBtn, { bottom: insets.bottom + 32 }]}
                    onPress={handleAdd}
                    hitSlop={8}
                >
                    <PlusButtonSVG width={80} height={80} />
                </Pressable>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1, paddingHorizontal: 16 },
    bgImage: { resizeMode: "cover" },

    headerRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    backButton: {
        width: 64,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        elevation: 10,
    },
    headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
    titleStack: { alignItems: "center", justifyContent: "center", gap: 2 },

    title: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 44,
        lineHeight: 44,
        letterSpacing: -0.32,
        textAlign: "center",
    },

    scrollContent: {
        alignItems: "center",
        justifyContent: "flex-start",
    },


    setsList: {
        alignSelf: "stretch",
        alignItems: "center",
        paddingTop: 8,
    },


    greenCard: {
        width: 350,
        height: 88,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#00FF4D",
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "#361933",
        paddingTop: 24,
        paddingRight: 22,
        paddingBottom: 24,
        paddingLeft: 22,
        marginBottom: 10,
    },
    greenCardTitle: {
        flex: 1,
        marginRight: 23,
        fontFamily: "BagelFatOne-Regular",
        fontSize: 18,
        lineHeight: 26,
        color: "#361933",
    },
    greenCardRight: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#00FF4D",
        borderWidth: 3,
        borderColor: "#361933",
    },

    emptyWrap: {
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 30,
    },
    emptyText: { fontFamily: "BagelFatOne-Regular", color: "#fff", fontSize: 18 },

    strokeWrap: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    strokeLayer: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
    },

    plusBtn: {
        position: "absolute",
        right: 32,
        zIndex: 20,
        elevation: 20,
    },
});
