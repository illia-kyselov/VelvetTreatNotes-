import React from "react";
import {
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    Text,
    SectionList,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { selectTastingSections } from "../redux/tastingsSlice";

import TouchBar from "../components/TouchBar";
import MyTastingSVG from "../assets/svg/MyTastingSVG";
import AddNoteButtonSVG from "../assets/svg/AddNoteButtonSVG";
import RightArrowSVG from "../assets/svg/RightArrowSVG";
import { SafeAreaView } from "react-native-safe-area-context";

const BG = require("../assets/images/onboardingBG.png");

const ROUTE_BY_TAB = {
    encyclopedia: "Main",
    journal: "MyTasting",
    collections: "Collections",
    favorites: "Favorites",
    game: "Game",
    settings: "Settings",
};


const BOTTOM_GAP_ABOVE_TOUCHBAR = 164;

export default function MyTastingScreen() {
    const navigation = useNavigation();
    const sections = useSelector(selectTastingSections);

    const handleAddNote = () => navigation.navigate("NewTastingForm");

    const openEdit = (id) => navigation.navigate("NewTastingForm", { mode: "edit", id });

    const renderItem = ({ item }) => (
        <Pressable onPress={() => openEdit(item.id)} style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
            </Text>
            <View style={styles.cardRight}>
                <RightArrowSVG width={16} height={16} />
            </View>
        </Pressable>
    );

    const renderSectionHeader = ({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
    );

    return (
        <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImage}>
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.headerRow}>
                        <View style={{ width: 60 }} />
                        <View style={styles.headerCenter}>
                            <MyTastingSVG width={260} height={80} />
                        </View>
                        <View style={{ width: 60 }} />
                    </View>


                    {sections.length ? (
                        <SectionList
                            sections={sections}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            renderSectionHeader={renderSectionHeader}
                            stickySectionHeadersEnabled={false}
                            contentContainerStyle={styles.listContent}
                            scrollEnabled={false}
                        />
                    ) : (
                        <View style={styles.emptyWrap}>
                            <Text style={styles.emptyText}>No notes yet</Text>
                        </View>
                    )}


                    <View style={styles.addNoteWrap}>
                        <Pressable onPress={handleAddNote} style={{ alignSelf: "center" }}>
                            <AddNoteButtonSVG width={200} height={60} />
                        </Pressable>
                    </View>
                </ScrollView>


                <TouchBar
                    active="journal"
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

    scrollContent: {
        alignItems: "flex-start",
        alignSelf: "stretch",
        paddingBottom: BOTTOM_GAP_ABOVE_TOUCHBAR,
    },

    headerRow: {
        marginTop: 40,
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerCenter: { alignItems: "center", justifyContent: "center", flex: 1 },

    listContent: {
        alignItems: "flex-start",
        alignSelf: "stretch",
        paddingTop: 8,
    },
    sectionTitle: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 30,
        lineHeight: 38,
        letterSpacing: -0.32,
        color: "#FFFFFF",
        marginTop: 8,
        marginBottom: 18,
    },

    card: {
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
    cardTitle: {
        flex: 1,
        marginRight: 23,
        fontFamily: "BagelFatOne-Regular",
        fontSize: 18,
        lineHeight: 26,
        color: "#361933",
    },
    cardRight: {
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
        paddingVertical: 40,
    },
    emptyText: { fontFamily: "BagelFatOne-Regular", color: "#fff", fontSize: 18 },

    addNoteWrap: {
        alignSelf: "stretch",
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: "center",
    },

    touchBarAbs: {
        position: "absolute",
        top: 720,
        left: 52,
        zIndex: 10,
        elevation: 10,
    },
});
