import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { useTheme } from "@/contexts/themeContext";
import { COLORS, icons } from "@/constants";
import Input from "./CustomInput";
import Button from "./Button";
import { validationEditProfile } from "./Validation";
import { useAuth } from "@/contexts/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getImageUrl, showTopToast } from "@/utils/helpers";
import { editAgentProfile } from "@/utils/mutations/agentMutations";

const EditProfileModal = ({ visible, onClose }: any) => {
  const { dark } = useTheme();
  const { userData, token } = useAuth();

  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const { mutate: editAgentProfileData } = useMutation({
    mutationFn: (data: any) => editAgentProfile(data, token, userData?.id),
    onSuccess: () => {
      showTopToast({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
      // queryClient.invalidateQueries("userProfile");
      onClose();
    },
    onError: (error: any) => {
      showTopToast({
        type: "error",
        text1: "Error",
        text2: error?.message || "Something went wrong",
      });
    },
  });

  const handleImagePicker = async (setFieldValue: any) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Media library access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setFieldValue("profilePicture", imageUri);
    }
  };
  useEffect(() => {

    setSelectedImage(getImageUrl(userData?.profilePicture));

  }, [userData?.profilePicture]);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image
              source={icons.close2}
              style={{
                width: 25,
                height: 25,
                tintColor: dark ? COLORS.white : COLORS.black,
              }}
            />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, { color: dark ? COLORS.white : COLORS.black }]}>
            Edit Profile
          </Text>

          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.profileAvatar,
                { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200 },
              ]}
            >
              <Text
                style={[
                  styles.profileAvatarText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {userData?.username?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePicker(Formik.setFieldValue)}
          >
            <Text style={styles.buttonText}>Change</Text>
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Formik
              initialValues={{
                firstname: userData?.firstname || "",
                lastname: userData?.lastname || "",
                username: userData?.username || "",
                email: userData?.email || "",
                phoneNumber: userData?.phoneNumber || "",
                gender: userData?.gender || "",
                country: userData?.country || "",
                profilePicture: selectedImage || "",
              }}
              // validationSchema={validationEditProfile}
              onSubmit={(values) => {
                const payload = { ...values, profilePicture: selectedImage };
                console.log("payload", payload);
                editAgentProfileData(payload);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <Input
                    id="firstname"
                    label="First Name"
                    onChangeText={handleChange("firstname")}
                    onBlur={handleBlur("firstname")}
                    value={values.firstname}
                    errorText={touched.firstname && errors.firstname}
                  />

                  <Input
                    id="lastname"
                    label="Last Name"
                    onChangeText={handleChange("lastname")}
                    onBlur={handleBlur("lastname")}
                    value={values.lastname}
                    errorText={touched.lastname && errors.lastname}
                  />

                  <Input
                    id="username"
                    label="Username"
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    value={values.username}
                    errorText={touched.username && errors.username}
                  />

                  <Input
                    id="email"
                    label="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    errorText={touched.email && errors.email}
                  />

                  <Input
                    id="phoneNumber"
                    label="Phone Number"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                    errorText={touched.phoneNumber && errors.phoneNumber}
                  />

                  <Input
                    id="gender"
                    label="Gender"
                    onChangeText={handleChange("gender")}
                    onBlur={handleBlur("gender")}
                    value={values.gender}
                    errorText={touched.gender && errors.gender}
                  />

                  <Input
                    id="country"
                    label="Country"
                    onChangeText={handleChange("country")}
                    onBlur={handleBlur("country")}
                    value={values.country}
                    errorText={touched.country && errors.country}
                  />

                  <Button title="Save" onPress={handleSubmit} />
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 16,
    alignItems: "center",
    width: "90%",
    height: 600,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    resizeMode: "cover",
  },
  button: {
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    marginBottom: 15,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default EditProfileModal;
