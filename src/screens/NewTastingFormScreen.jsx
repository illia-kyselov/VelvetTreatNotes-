import React, { useState, useRef } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    View,
    ScrollView,
    Dimensions,
    Text,
    Pressable,
    Image,
    TextInput,
    Platform,
    Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
    addTasting,
    updateTasting,
    selectTastingById,
} from "../redux/tastingsSlice";

import MyTastingSVG from "../assets/svg/MyTastingSVG";
import BackArrowSVG from "../assets/svg/BackArrowSVG";
import SaveButtonSVG from "../assets/svg/SaveButtonSVG";

const BG = require("../assets/images/onboardingBG.png");
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const VISIBLE_CARD_HEIGHT = Math.max(560, Math.min(640, SCREEN_HEIGHT - 220));
const HEADER_TOP = 80;
const ARROW_LEFT = 5;
const ARROW_SIZE = 36;

const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
};


const parseYMD = (s) => {
    if (!s) return null;
    const [y, m, d] = s.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
};

const PLACE_FONT_SIZE = 18;
const PLACE_LINE_HEIGHT = 22;
const PLACE_MAX_HEIGHT = PLACE_LINE_HEIGHT * 2;
const NAME_LINE_HEIGHT = 34;
const NAME_MAX_HEIGHT = NAME_LINE_HEIGHT * 3;
const IMP_LINE_HEIGHT = 22;
const IMP_MIN_HEIGHT = 255;

export default function NewTastingFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();


    const { mode, id } = route.params ?? {};
    const existing = useSelector(
        selectTastingById(typeof id === "string" ? id : "")
    );

    const [photo, setPhoto] = useState(null);
    const [dessertName, setDessertName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInputHeight, setNameInputHeight] = useState(NAME_LINE_HEIGHT);
    const [date, setDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [place, setPlace] = useState("");
    const [placeInputHeight, setPlaceInputHeight] = useState(PLACE_LINE_HEIGHT);
    const [impression, setImpression] = useState("");
    const [impressionHeight, setImpressionHeight] = useState(IMP_LINE_HEIGHT);
    const [activeRate, setActiveRate] = useState(null);
    const [taste, setTaste] = useState(null);


    React.useEffect(() => {
        if (mode === "edit" && existing) {
            setPhoto(existing.photoUri ?? null);
            setDessertName(existing.title ?? "");
            setDate(existing.date ? parseYMD(existing.date) : null);
            setPlace(existing.place ?? "");
            setImpression(existing.impression ?? "");
            setActiveRate(existing.rate ?? null);
            if (existing.liked) setTaste("liked");
            else if (existing.notMyTaste) setTaste("not");
            else setTaste(null);
        }
    }, [mode, existing]);


    const impressionRef = useRef(null);

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: "photo", quality: 1 }, (r) => {
            if (r?.didCancel || r?.errorCode) return;
            if (r?.assets?.length) setPhoto(r.assets[0].uri || null);
        });
    };

    const openDatePicker = () => setShowDatePicker(true);

    const onChangeDate = (_e, selected) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (selected) setDate(selected);
    };


    const handleSave = () => {
        const idToUse =
            mode === "edit" && existing ? existing.id : Date.now().toString();

        const tasting = {
            id: idToUse,
            title: (dessertName || "").trim() || "Untitled dessert",
            date: date ? fmt(date) : fmt(new Date()),
            place: (place || "").trim(),
            impression: (impression || "").trim(),
            rate: activeRate,
            liked: taste === "liked",
            notMyTaste: taste === "not",
            tags: existing?.tags ?? [],
            photoUri: photo || null,
            createdAt:
                mode === "edit" && existing?.createdAt
                    ? existing.createdAt
                    : new Date().toISOString(),
        };

        if (mode === "edit" && existing) {
            dispatch(updateTasting(tasting));
        } else {
            dispatch(addTasting(tasting));
        }

        navigation.navigate("MyTasting");
    };

    return (
        <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImage}>
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={["left", "right"]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.pageContent}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.headerRow} pointerEvents="box-none">
                        <Pressable
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 12, bottom: 12, left: 8, right: 28 }}
                            android_disableSound
                            pointerEvents="box-only"
                        >
                            <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                        </Pressable>

                        <View style={styles.headerCenter} pointerEvents="none">
                            <MyTastingSVG width={260} height={80} />
                        </View>

                        <View style={{ width: 64 + ARROW_LEFT }} pointerEvents="none" />
                    </View>


                    <View style={styles.formCard}>
                        <Pressable style={styles.addPictureBlock} onPress={handlePickImage}>
                            {photo ? (
                                <Image source={{ uri: photo }} style={styles.addedImage} />
                            ) : (
                                <Text style={styles.addPictureText}>Add picture</Text>
                            )}
                        </Pressable>

                        <View style={styles.nameContainer}>
                            {isEditingName ? (
                                <TextInput
                                    style={[
                                        styles.nameInput,
                                        {
                                            height: Math.min(
                                                Math.max(NAME_LINE_HEIGHT, nameInputHeight),
                                                NAME_MAX_HEIGHT
                                            ),
                                        },
                                    ]}
                                    value={dessertName}
                                    onChangeText={setDessertName}
                                    placeholder="Enter the dessert"
                                    placeholderTextColor="#4800FF"
                                    autoFocus
                                    multiline
                                    numberOfLines={3}
                                    maxLength={60}
                                    returnKeyType="done"
                                    blurOnSubmit
                                    underlineColorAndroid="transparent"
                                    textAlignVertical="top"
                                    onContentSizeChange={(e) =>
                                        setNameInputHeight(e.nativeEvent.contentSize.height)
                                    }
                                    onSubmitEditing={() => setIsEditingName(false)}
                                    onBlur={() => setIsEditingName(false)}
                                />
                            ) : (
                                <Pressable onPress={() => setIsEditingName(true)} hitSlop={8}>
                                    <Text style={styles.nameDisplay} numberOfLines={3}>
                                        {dessertName || "Enter the dessert"}
                                    </Text>
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.dateBlock}>
                            <Text style={styles.dateLabel}>Date</Text>
                            <Pressable style={styles.dateField} onPress={openDatePicker}>
                                <Text style={date ? styles.dateValue : styles.datePlaceholder}>
                                    {date ? fmt(date) : "Add text"}
                                </Text>
                            </Pressable>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={date || new Date()}
                                    mode="date"
                                    display={Platform.OS === "ios" ? "spinner" : "default"}
                                    onChange={onChangeDate}
                                />
                            )}
                        </View>

                        <View style={styles.placeBlock}>
                            <Text style={styles.placeLabel}>Place</Text>
                            <View style={[styles.placeField, { minHeight: 51, paddingVertical: 8 }]}>
                                <TextInput
                                    value={place}
                                    onChangeText={setPlace}
                                    placeholder="Add text"
                                    placeholderTextColor="#AF02B2"
                                    style={[
                                        styles.placeInput,
                                        {
                                            height: Math.min(
                                                Math.max(PLACE_LINE_HEIGHT, placeInputHeight),
                                                PLACE_MAX_HEIGHT
                                            ),
                                        },
                                    ]}
                                    maxLength={120}
                                    returnKeyType="done"
                                    multiline
                                    numberOfLines={2}
                                    textAlignVertical="top"
                                    onContentSizeChange={(e) =>
                                        setPlaceInputHeight(e.nativeEvent.contentSize.height)
                                    }
                                />
                            </View>
                        </View>


                        <View style={styles.impressionBlock}>
                            <Text style={styles.impressionLabel}>Impression</Text>

                            <Pressable
                                style={styles.impressionField}
                                onPress={() => impressionRef.current?.focus()}
                            >
                                <TextInput
                                    ref={impressionRef}
                                    value={impression}
                                    onChangeText={setImpression}
                                    placeholder="Add text"
                                    placeholderTextColor="#AF02B2"
                                    style={[
                                        styles.impressionInput,
                                        { height: Math.max(IMP_LINE_HEIGHT, impressionHeight) },
                                    ]}
                                    multiline
                                    textAlignVertical="top"
                                    maxLength={2000}
                                    returnKeyType="default"
                                    underlineColorAndroid="transparent"
                                    onContentSizeChange={(e) =>
                                        setImpressionHeight(e.nativeEvent.contentSize.height)
                                    }
                                />
                            </Pressable>
                        </View>

                        <View style={styles.rateBlock}>
                            <Text style={styles.rateLabel}>Rate</Text>
                            <View style={styles.rateRow}>
                                <Pressable
                                    style={[
                                        styles.rateBtn,
                                        activeRate === "sweetness" && styles.rateBtnActive,
                                    ]}
                                    onPress={() => setActiveRate("sweetness")}
                                >
                                    <Text
                                        style={[
                                            styles.rateText,
                                            activeRate === "sweetness" && styles.rateTextActive,
                                        ]}
                                    >
                                        Sweetness
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.rateBtn,
                                        activeRate === "aesthetics" && styles.rateBtnActive,
                                    ]}
                                    onPress={() => setActiveRate("aesthetics")}
                                >
                                    <Text
                                        style={[
                                            styles.rateText,
                                            activeRate === "aesthetics" && styles.rateTextActive,
                                        ]}
                                    >
                                        Aesthetics
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.rateBtn,
                                        activeRate === "emotions" && styles.rateBtnActive,
                                    ]}
                                    onPress={() => setActiveRate("emotions")}
                                >
                                    <Text
                                        style={[
                                            styles.rateText,
                                            activeRate === "emotions" && styles.rateTextActive,
                                        ]}
                                    >
                                        Emotions
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.likeBlock}>
                            <View style={styles.likeRow}>
                                <Text style={styles.likeText}>I liked it</Text>
                                <Switch
                                    value={taste === "liked"}
                                    onValueChange={(v) => setTaste(v ? "liked" : null)}
                                    trackColor={{ false: "#C7C7C7", true: "#00C389" }}
                                    thumbColor="#FFFFFF"
                                    ios_backgroundColor="#C7C7C7"
                                />
                            </View>
                            <View style={styles.likeRow}>
                                <Text style={styles.likeText}>Not my taste</Text>
                                <Switch
                                    value={taste === "not"}
                                    onValueChange={(v) => setTaste(v ? "not" : null)}
                                    trackColor={{ false: "#C7C7C7", true: "#00C389" }}
                                    thumbColor="#FFFFFF"
                                    ios_backgroundColor="#C7C7C7"
                                />
                            </View>
                        </View>
                    </View>

                    <Pressable style={styles.saveWrapper} onPress={handleSave}>
                        <SaveButtonSVG width={314} height={64} />
                    </Pressable>

                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1, paddingHorizontal: 16 },
    bgImage: { resizeMode: "cover" },
    pageContent: { alignItems: "center", justifyContent: "flex-start" },

    headerRow: {
        marginTop: HEADER_TOP,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    backButton: {
        width: 64,
        height: 56,
        marginLeft: ARROW_LEFT,
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 10,
        elevation: 10,
    },
    headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

    formCard: {
        width: 350,
        backgroundColor: "#FFCC00",
        borderRadius: 40,
        paddingTop: 30,
        paddingRight: 18,
        paddingBottom: 30,
        paddingLeft: 18,
        marginTop: 10,
    },

    addPictureBlock: {
        width: 314,
        height: 211,
        backgroundColor: "#FFEA97",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    addPictureText: {
        fontSize: 18,
        paddingRight: 180,
        fontFamily: "BagelFatOne-Regular",
        color: "#F679FF",
    },
    addedImage: { width: "100%", height: "100%", resizeMode: "cover" },

    nameContainer: {
        width: 314,
        marginTop: 16,
        marginBottom: 4,
        justifyContent: "flex-start",
    },
    nameDisplay: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 34,
        lineHeight: 44,
        letterSpacing: -0.32,
        color: "#4800FF",
    },
    nameInput: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 34,
        lineHeight: 44,
        letterSpacing: -0.32,
        color: "#4800FF",
        backgroundColor: "transparent",
        paddingVertical: 0,
        paddingHorizontal: 0,
        includeFontPadding: false,
        textAlignVertical: "top",
    },

    dateBlock: { width: 314, marginTop: 8 },
    dateLabel: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.32,
        color: "#7766A3",
        marginBottom: 6,
    },
    dateField: {
        width: 314,
        height: 51,
        borderRadius: 20,
        backgroundColor: "#FFEA97",
        borderWidth: 1,
        borderColor: "#7766A3",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    datePlaceholder: { fontFamily: "BagelFatOne-Regular", fontSize: 18, color: "#AF02B2" },
    dateValue: { fontFamily: "BagelFatOne-Regular", fontSize: 18, color: "#AF02B2" },

    placeBlock: { width: 314, marginTop: 16 },
    placeLabel: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.32,
        color: "#7766A3",
        marginBottom: 6,
    },
    placeField: {
        width: 314,
        borderRadius: 20,
        backgroundColor: "#FFEA97",
        borderWidth: 1,
        borderColor: "#7766A3",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    placeInput: {
        fontFamily: "BagelFatOne-Regular",
        fontSize: PLACE_FONT_SIZE,
        lineHeight: PLACE_LINE_HEIGHT,
        color: "#AF02B2",
        paddingVertical: 0,
    },

    impressionBlock: { width: 314, marginTop: 16 },
    impressionLabel: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.32,
        color: "#7766A3",
        marginBottom: 6,
    },
    impressionField: {
        width: 314,
        minHeight: IMP_MIN_HEIGHT,
        borderRadius: 20,
        backgroundColor: "#FFEA97",
        borderWidth: 1,
        borderColor: "#7766A3",
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: "flex-start",
    },
    impressionInput: {
        fontFamily: "BagelFatOne-Regular",
        fontSize: 18,
        lineHeight: IMP_LINE_HEIGHT,
        color: "#AF02B2",
        includeFontPadding: false,
        padding: 0,
        textAlignVertical: "top",
    },

    rateBlock: { width: 314, marginTop: 16 },
    rateLabel: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 24,
        lineHeight: 30,
        letterSpacing: -0.32,
        color: "#7766A3",
        marginBottom: 8,
    },
    rateRow: { width: 314, flexDirection: "row", justifyContent: "space-between" },
    rateBtn: {
        width: 100,
        height: 40,
        borderRadius: 40,
        backgroundColor: "#FFEA97",
        alignItems: "center",
        justifyContent: "center",
    },
    rateBtnActive: { backgroundColor: "#F679FF" },
    rateText: { fontFamily: "BagelFatOne-Regular", fontSize: 16, color: "#AF02B2" },
    rateTextActive: { color: "#FFFFFF" },

    likeBlock: {
        width: 314,
        marginTop: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: "#AF02B2",
        borderRadius: 20,
        backgroundColor: "#FFD900",
    },
    likeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 6,
    },
    likeText: { fontFamily: "BagelFatOne-Regular", fontSize: 20, color: "#AF02B2" },

    saveWrapper: { marginTop: 20, alignSelf: "center" },
});
