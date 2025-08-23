import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    ImageBackground,
    View,
    ScrollView,
    Pressable,
    Image,
    Text,
    StatusBar,
    SafeAreaView,
    Share,
    Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectCollections } from "../redux/collectionsSlice";

import TouchBar from "../components/TouchBar";
import ShowcaseSVG from "../assets/svg/ShowcaseSVG";
import AddNewCollectionButtonSVG from "../assets/svg/AddNewCollectionButtonSVG";
import SeeCollectionButtonSVG from "../assets/svg/SeeCollectionButtonSVG";
import ShareColButtonSVG from "../assets/svg/ShareColButtonSVG";

import BackArrowSVG from "../assets/svg/BackArrowSVG";
import BackArrowNASVG from "../assets/svg/BackArrowNASVG";
import ForwardArrowSVG from "../assets/svg/ForwardArrowSVG";
import ForwardArrowNASVG from "../assets/svg/ForwardArrowNASVG";

const BG = require("../assets/images/onboardingBG.png");

const ROUTE_BY_TAB = {
    encyclopedia: "Main",
    journal: "MyTasting",
    collections: "Collections",
    favorites: "Favorites",
    game: "Game",
    settings: "Settings",
};

const TAB_BY_ROUTE = {
    Main: "encyclopedia",
    MyTasting: "journal",
    Collections: "collections",
    Favorites: "favorites",
    Game: "game",
    Settings: "settings",
};

const BOTTOM_GAP_ABOVE_TOUCHBAR = 200;

export default function CollectionsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const activeTab = TAB_BY_ROUTE[route.name] ?? "collections";

    const collections = useSelector(selectCollections);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => currentIndex > 0 && setCurrentIndex((i) => i - 1);
    const handleNext = () =>
        currentIndex < collections.length - 1 && setCurrentIndex((i) => i + 1);

    useEffect(() => {
        if (collections.length === 0) setCurrentIndex(0);
        else if (currentIndex > collections.length - 1)
            setCurrentIndex(collections.length - 1);
    }, [collections, currentIndex]);

    const currentCollection = collections[currentIndex];

    const handleSeeCollection = () => {
        if (!currentCollection?.id) return;
        navigation.navigate("CollectionDetails", { id: currentCollection.id });
    };

    const handleShareCollection = async () => {
        if (!currentCollection) return;
        const name = (currentCollection.name || "мою коллекцию").trim();
        const message = `Hi! Check out my collection "${name}"`;

        try {
            await Share.share(
                {
                    message,
                    title: `Коллекция: ${name}`,
                    ...(Platform.OS === "ios" ? { subject: `Коллекция: ${name}` } : {}),
                }
            );
        } catch (e) {
            console.warn("Share error:", e);
        }
    };

    return (
        <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImage}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.header}>
                        <ShowcaseSVG width={260} height={80} />
                    </View>


                    <View style={styles.list}>
                        {collections.length === 0 ? (
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>No collections yet</Text>
                            </View>
                        ) : (
                            <>

                                <View style={styles.card}>
                                    <View style={styles.cardImageWrap}>
                                        {currentCollection?.photoUri ? (
                                            <Image
                                                source={{ uri: currentCollection.photoUri }}
                                                style={styles.cardImage}
                                            />
                                        ) : (
                                            <View style={styles.cardImagePlaceholder} />
                                        )}
                                    </View>

                                    <Text style={styles.cardTitle} numberOfLines={1}>
                                        {currentCollection?.name}
                                    </Text>
                                </View>


                                <View style={styles.arrowsRowOuter}>
                                    <Pressable onPress={handlePrev} disabled={currentIndex === 0} hitSlop={10}>
                                        {currentIndex === 0 ? (
                                            <BackArrowNASVG width={48} height={48} />
                                        ) : (
                                            <BackArrowSVG width={48} height={48} />
                                        )}
                                    </Pressable>

                                    <Pressable
                                        onPress={handleNext}
                                        disabled={currentIndex === collections.length - 1}
                                        hitSlop={10}
                                    >
                                        {currentIndex === collections.length - 1 ? (
                                            <ForwardArrowNASVG width={48} height={48} />
                                        ) : (
                                            <ForwardArrowSVG width={48} height={48} />
                                        )}
                                    </Pressable>
                                </View>


                                <Pressable style={styles.seeBtnWrap} onPress={handleSeeCollection} hitSlop={8}>
                                    <SeeCollectionButtonSVG width={300} height={70} />
                                </Pressable>


                                <Pressable style={styles.shareBtnWrap} onPress={handleShareCollection} hitSlop={8}>
                                    <ShareColButtonSVG width={300} height={70} />
                                </Pressable>
                            </>
                        )}
                    </View>


                    <Pressable
                        style={styles.addButtonWrapper}
                        onPress={() => navigation.navigate("ShowcaseNewForm")}
                    >
                        <AddNewCollectionButtonSVG width={280} height={70} />
                    </Pressable>

                    <View style={{ height: BOTTOM_GAP_ABOVE_TOUCHBAR }} />
                </ScrollView>


                <TouchBar
                    active={activeTab}
                    style={styles.touchBarAbs}
                    onTabPress={(key) => {
                        const target = ROUTE_BY_TAB[key];
                        if (target) navigation.navigate(target);
                    }}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    bg: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        paddingHorizontal: 16,
        paddingTop: 0,
    },
    bgImage: { resizeMode: "cover" },

    scroll: { flex: 1, width: "100%" },
    scrollContent: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
    },

    header: { marginTop: 40, alignItems: "center", marginBottom: 12 },

    list: {
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
    },

    card: {
        width: 350,
        height: 472,
        borderRadius: 40,
        backgroundColor: "#FFCC00",
        paddingTop: 37,
        paddingRight: 14,
        paddingBottom: 37,
        paddingLeft: 14,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 10,
    },
    cardImageWrap: {
        width: 262,
        height: 304,
        borderRadius: 40,
        overflow: "hidden",
        backgroundColor: "#FFEA97",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 34,
    },
    cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
    cardImagePlaceholder: { width: "100%", height: "100%" },
    cardTitle: {
        textAlign: "center",
        fontFamily: "BagelFatOne-Regular",
        fontSize: 34,
        lineHeight: 38,
        color: "#4800FF",
    },

    arrowsRowOuter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        marginTop: 26,
        marginBottom: 12,
    },

    seeBtnWrap: { alignItems: "center", marginTop: 16 },
    shareBtnWrap: { alignItems: "center", marginTop: 12 },

    emptyWrap: {
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 30,
    },
    emptyText: { fontFamily: "BagelFatOne-Regular", color: "#fff", fontSize: 18 },

    addButtonWrapper: { alignItems: "center", marginTop: -5 },

    touchBarAbs: {
        position: "absolute",
        top: 720,
        left: 52,
        zIndex: 10,
        elevation: 10,
    },
});
