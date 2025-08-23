import React, { useRef, useState, useMemo } from "react";
import {
    SafeAreaView,
    StyleSheet,
    ImageBackground,
    StatusBar,
    ScrollView,
    View,
    Pressable,
    Dimensions,
    Text,
    Image,
    TextInput,
    Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import { makeSelectSetsForCollection } from "../redux/collectionsSlice";

import BackArrowSVG from "../assets/svg/BackArrowSVG";
import NewCollectionSVG from "../assets/svg/NewCollectionSVG";
import EditIconSVG from "../assets/svg/EditIconSVG";
import SaveButtonGreenSVG from "../assets/svg/SaveButtonGreenSVG";

import BackArrowNASVG from "../assets/svg/BackArrowNASVG";
import ForwardArrowSVG from "../assets/svg/ForwardArrowSVG";
import ForwardArrowNASVG from "../assets/svg/ForwardArrowNASVG";

const BG = require("../assets/images/onboardingBG.png");
const { width } = Dimensions.get("window");
const ARROW_SIZE = 36;
const DEFAULT_SET_TITLE = "Enter Set Title";


function StrokedText({
    children,
    stroke = 5,
    strokeColor = "#B20228",
    fillColor = "#FFEE00",
    style,
    maxWidth,
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
        style: [style, { width: maxWidth, textAlign: "center" }],
    };
    return (
        <View style={{ width: maxWidth, alignItems: "center", justifyContent: "center" }}>
            <Text {...baseProps} style={[baseProps.style, { color: fillColor, opacity: 0 }]}>{children}</Text>
            {offsets.map(([x, y], i) => (
                <Text
                    key={i}
                    {...baseProps}
                    style={[
                        baseProps.style,
                        { position: "absolute", left: 0, right: 0, color: strokeColor, transform: [{ translateX: x }, { translateY: y }] },
                    ]}
                >
                    {children}
                </Text>
            ))}
            <Text {...baseProps} style={[baseProps.style, { position: "absolute", left: 0, right: 0, color: fillColor }]}>{children}</Text>
        </View>
    );
}

export default function NewCollectionFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();


    const onSaveParam = route?.params?.onSave;
    const collectionId = route?.params?.collectionId;
    const setId = route?.params?.setId;
    const initial = route?.params?.initial || {};
    const parentTitle = (route?.params?.parentTitle || "").trim();


    const isFirstOpenUnsaved =
        (!initial.title || initial.title.trim() === DEFAULT_SET_TITLE) &&
        !initial.description &&
        !initial.imageUri;


    const initialTitle =
        typeof initial.title === "string" && initial.title.trim() !== DEFAULT_SET_TITLE
            ? initial.title.trim()
            : "";


    const [photoUri, setPhotoUri] = useState(initial.imageUri || null);
    const [name, setName] = useState(initialTitle);
    const nameInputRef = useRef(null);
    const [description, setDescription] = useState(initial.description || "");
    const [descHeight, setDescHeight] = useState(40);


    const selectSets = useMemo(() => makeSelectSetsForCollection(collectionId), [collectionId]);
    const sets = useSelector(selectSets);
    const currentIndex = useMemo(
        () => Math.max(0, sets.findIndex((s) => s.id === setId)),
        [sets, setId]
    );
    const prevDisabled = currentIndex <= 0;
    const nextDisabled = currentIndex >= sets.length - 1 || currentIndex === -1;

    const goToSet = (targetIndex) => {
        if (targetIndex < 0 || targetIndex > sets.length - 1) return;
        const target = sets[targetIndex];
        if (!target) return;


        navigation.replace("NewCollectionForm", {
            collectionId,
            setId: target.id,
            parentTitle,
            initial: {
                title: target.title || "",
                description: target.description || "",
                imageUri: target.imageUri || null,
            },
            onSave: onSaveParam,
        });
    };
    const handlePrev = () => !prevDisabled && goToSet(currentIndex - 1);
    const handleNext = () => !nextDisabled && goToSet(currentIndex + 1);


    const handlePickImage = () => {
        launchImageLibrary(
            { mediaType: "photo", selectionLimit: 1, quality: 0.9 },
            (res) => {
                const uri = res?.assets?.[0]?.uri;
                if (uri) setPhotoUri(uri);
            }
        );
    };

    const handleSave = () => {
        const title = name.trim();
        if (!title) {
            Alert.alert("Enter name", "Please enter a name for the collection item.");
            return;
        }
        const payload = { title, description: description.trim(), imageUri: photoUri || null };
        const meta = { collectionId, setId };
        if (typeof onSaveParam === "function") onSaveParam(payload, meta);
        navigation.goBack();
    };

    return (
        <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={["left", "right"]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.pageContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={[styles.headerRow, { paddingTop: 8 }]}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                            <BackArrowSVG width={ARROW_SIZE} height={ARROW_SIZE} />
                        </Pressable>

                        <View style={styles.headerCenter}>

                            {!isFirstOpenUnsaved && parentTitle ? (
                                <StrokedText maxWidth={Math.min(320, width - 32)} stroke={5} style={styles.headerTitle}>
                                    {parentTitle}
                                </StrokedText>
                            ) : (
                                <NewCollectionSVG width={Math.min(320, width - 32)} height={90} pointerEvents="none" />
                            )}
                        </View>

                        <View style={{ width: 34, height: 56 }} />
                    </View>


                    <View style={styles.card}>

                        <Pressable style={styles.addPicture} onPress={handlePickImage}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.addPictureImage} resizeMode="cover" />
                            ) : (
                                <Text style={styles.addPictureText}>Add picture</Text>
                            )}
                        </Pressable>


                        <View style={styles.nameRow}>
                            <View style={styles.sideSpacer} />
                            <View style={styles.nameTextBox}>
                                <TextInput
                                    ref={nameInputRef}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter Name"
                                    placeholderTextColor="#4800FF"
                                    style={styles.nameInput}
                                    multiline
                                    numberOfLines={2}
                                    maxLength={48}
                                    textAlignVertical="center"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            <View style={styles.editIconWrap} pointerEvents="none">
                                <EditIconSVG width={22} height={22} />
                            </View>
                        </View>


                        <View style={styles.descWrap}>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Enter Description"
                                placeholderTextColor="#7D4F4F"
                                style={[styles.descInput, { height: Math.max(40, descHeight) }]}
                                multiline
                                onContentSizeChange={(e) => setDescHeight(e.nativeEvent.contentSize.height)}
                                textAlign="center"
                                textAlignVertical="center"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>


                    {sets.length > 0 && (
                        <View style={styles.arrowsRowOuter}>
                            <Pressable onPress={handlePrev} disabled={prevDisabled} hitSlop={10}>
                                {prevDisabled ? (
                                    <BackArrowNASVG width={48} height={48} />
                                ) : (
                                    <BackArrowSVG width={48} height={48} />
                                )}
                            </Pressable>

                            <Pressable onPress={handleNext} disabled={nextDisabled} hitSlop={10}>
                                {nextDisabled ? (
                                    <ForwardArrowNASVG width={48} height={48} />
                                ) : (
                                    <ForwardArrowSVG width={48} height={48} />
                                )}
                            </Pressable>
                        </View>
                    )}


                    <Pressable style={styles.saveBtn} onPress={handleSave} hitSlop={8}>
                        <SaveButtonGreenSVG width={Math.min(330, width - 32)} height={64} />
                    </Pressable>

                    <View style={{ height: 16 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const ROW_HEIGHT = 76;

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%', height: '100%' },
    bg: { flex: 1, paddingHorizontal: 16 },
    pageContent: { alignItems: "center", justifyContent: "flex-start" },

    headerRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        marginRight: 20,
        position: "relative",
    },
    backButton: {
        width: 64,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        elevation: 10,
        marginRight: -10,
    },
    headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

    headerTitle: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 44,
        lineHeight: 44,
        letterSpacing: -0.32,
        textAlign: "center",
    },


    card: {
        width: 350,
        minHeight: 663,
        backgroundColor: "#FFCC00",
        borderRadius: 40,
        paddingTop: 27,
        paddingRight: 14,
        paddingBottom: 27,
        paddingLeft: 14,
        gap: 24,
        marginTop: 25,
        alignSelf: "center",
    },


    addPicture: {
        width: 262,
        height: 304,
        backgroundColor: "#FFEA97",
        borderRadius: 40,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    addPictureText: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 20,
        lineHeight: 21,
        letterSpacing: -0.32,
        textAlign: "center",
        color: "#7D4F4F",
        marginRight: 120,
    },
    addPictureImage: { width: "100%", height: "100%", borderRadius: 40 },


    nameRow: {
        width: "100%",
        minHeight: ROW_HEIGHT,
        paddingHorizontal: 6,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    sideSpacer: { width: 32, height: ROW_HEIGHT },
    nameTextBox: { flex: 1, justifyContent: "center", minHeight: ROW_HEIGHT },
    nameInput: {
        textAlign: "center",
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 34,
        lineHeight: 36,
        letterSpacing: -0.32,
        color: "#4800FF",
        paddingVertical: 4,
    },
    editIconWrap: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },


    descWrap: { width: "100%", paddingHorizontal: 6 },
    descInput: {
        width: "100%",
        borderRadius: 12,
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 18,
        lineHeight: 22,
        letterSpacing: -0.32,
        color: "#7D4F4F",
        paddingVertical: 6,
        textAlign: "center",
        textAlignVertical: "center",
    },


    arrowsRowOuter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        marginTop: 16,
        marginBottom: 8,
    },


    saveBtn: { marginTop: 18, alignSelf: "center" },
});
