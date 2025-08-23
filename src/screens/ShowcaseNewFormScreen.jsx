import React, { useState } from "react";
import {
    StyleSheet,
    ImageBackground,
    StatusBar,
    View,
    ScrollView,
    Text,
    Pressable,
    Image,
    TextInput,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { addCollection } from "../redux/collectionsSlice";
import ShowcaseSVG from "../assets/svg/ShowcaseSVG";
import CreateButtonSVG from "../assets/svg/CreateButtonSVG";

const BG = require("../assets/images/onboardingBG.png");

export default function ShowcaseNewFormScreen() {
    const [photoUri, setPhotoUri] = useState(null);
    const [collectionName, setCollectionName] = useState("");

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handlePickImage = () => {
        launchImageLibrary({ mediaType: "photo", quality: 1 }, (res) => {
            if (res?.didCancel || res?.errorCode) return;
            const uri = res?.assets?.[0]?.uri || null;
            setPhotoUri(uri);
        });
    };

    const handleCreate = () => {
        const name = (collectionName || "").trim();
        dispatch(addCollection({ name, photoUri }));
        Keyboard.dismiss();

        navigation.navigate("Collections");
    };

    return (
        <ImageBackground source={BG} style={styles.bg} resizeMode="cover" imageStyle={styles.bgImage}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.header}>
                        <ShowcaseSVG width={260} height={80} />
                    </View>


                    <View style={styles.yellowCard}>

                        <Pressable style={styles.addPictureBox} onPress={handlePickImage} hitSlop={8}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.addedImage} />
                            ) : (
                                <Text style={styles.addPictureText}>Add picture</Text>
                            )}
                        </Pressable>


                        <View style={styles.nameField}>
                            <TextInput
                                value={collectionName}
                                onChangeText={setCollectionName}
                                placeholder="Enter Name"
                                placeholderTextColor="#4800FF"
                                style={styles.nameInput}
                                maxLength={40}
                                returnKeyType="done"
                                blurOnSubmit
                                onSubmitEditing={Keyboard.dismiss}
                                multiline={false}
                            />
                        </View>
                    </View>


                    <Pressable style={styles.createWrapper} onPress={handleCreate} hitSlop={8}>
                        <CreateButtonSVG width={314} height={64} />
                    </Pressable>

                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: { flex: 1 },
    bgImage: { width: "100%", height: "100%" },
    container: { flex: 1, justifyContent: "flex-start" },

    scroll: { flex: 1, width: "100%" },
    scrollContent: { alignItems: "center", justifyContent: "flex-start", width: "100%" },

    header: { marginTop: 20, alignItems: "center", marginBottom: 20 },

    yellowCard: {
        width: 350,
        height: 460,
        borderRadius: 40,
        paddingTop: 37,
        paddingRight: 14,
        paddingBottom: 37,
        paddingLeft: 14,
        backgroundColor: "#FFCC00",
        alignSelf: "flex-start",
        marginTop: 10,
        marginLeft: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        rowGap: 34,
    },

    addPictureBox: {
        width: 262,
        height: 304,
        borderRadius: 40,
        backgroundColor: "#FFEA97",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    addedImage: { width: "100%", height: "100%", resizeMode: "cover" },

    addPictureText: {
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 22,
        lineHeight: 44,
        letterSpacing: -0.32,
        textAlign: "center",
        color: "#F679FF",
        marginRight: 120,
    },

    nameField: { width: 262, minHeight: 44, alignItems: "center", justifyContent: "center" },
    nameInput: {
        width: "100%",
        height: 44,
        textAlign: "center",
        fontFamily: "BagelFatOne-Regular",
        fontWeight: "400",
        fontSize: 34,
        lineHeight: 44,
        letterSpacing: -0.32,
        color: "#4800FF",
        paddingVertical: 0,
        paddingHorizontal: 0,
        includeFontPadding: false,
        backgroundColor: "transparent",
    },

    createWrapper: { marginTop: 40, alignSelf: "center" },
});
