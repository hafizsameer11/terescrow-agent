import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/themeContext";
import { COLORS, icons } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import { validationEditProfile, validationNewNotification } from "./Validation";
import Input from "./CustomInput";
import Button from "./Button";
import NewNotificationModal from "./NewNotification";
import { useAuth } from "@/contexts/authContext";

const dummyNotifications = [
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
  {
    description:
      "Your trade has been successfully placed, you are welcome to try out our new offers on Bitcoin and Ethereum",
    date: "Nov 7, 2024 - 10:22 am",
    sendingBy: "Send by Alucard",
    isDelivered: "Delivered",
  },
];

const EditProfileModal = ({
  visible,
  onClose,
  userName,
  onImageSelect,
  mode,
  setMode = () => {},
}: any) => {
  const { dark } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isNewNotificationVisible, setIsNewNotificationVisible] =
    useState(false);
    const {userData} = useAuth();

  const handleNewNotificationPress = () => {
    onClose();
    setMode("newNotification");
    setIsNewNotificationVisible(true);
  };
  const [formData, setFormData] = useState({
    firstname: userData?.firstname || "",
    username: userData?.username || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    gender: userData?.gender || "",
    country: userData?.country || "",
    profilePicture: userData?.profilePicture || null,
  });

  console.log(mode);
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setFormData({ ...formData, profilePicture: result.assets[0].uri });
      }
    }
  };

  const styleContent: ViewStyle = {
    width: mode === "editProfile" ? "90%" : "100%",
    position: mode === "editProfile" ? "absolute" : "relative",
    bottom: mode === "editProfile" ? undefined : 0,
    borderRadius: mode === "editProfile" ? 20 : "",
    height: mode === "editProfile" ? 600 : "80%",
    flex: 1,
    marginTop: mode === "editProfile" ? 0 : 60,
    borderTopLeftRadius: mode === "editProfile" ? 10 : 15,
    borderTopRightRadius: mode === "editProfile" ? 10 : 15,
  };

  return (
    <>
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
              styleContent,
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

            <Text
              style={[
                styles.modalTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              {mode === "editProfile"
                ? "Edit Profile"
                : mode === "notifications"
                ? "Notifications"
                : "New Notification"}
            </Text>

            {mode === "editProfile" && (
              <>
                {!selectedImage && (
                  <View
                    style={[
                      styles.profileAvatar,
                      {
                        backgroundColor: dark
                          ? COLORS.dark3
                          : COLORS.grayscale200,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.profileAvatarText,
                        { color: dark ? COLORS.white : COLORS.black },
                      ]}
                    >
                      {userName}
                    </Text>
                  </View>
                )}

                {selectedImage && (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleImagePicker}
                >
                  <Text style={styles.buttonText}>Change</Text>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <Formik
                    initialValues={{
                      name: userData?.firstname,
                      userName: userData?.username,
                      email: userData?.email,
                      phoneNumber: userData?.phoneNumber,
                      gender: userData?.gender,
                      // password:,
                      country: userData?.country,
                    }}
                    validationSchema={validationEditProfile}
                    onSubmit={() => {
                      onClose();
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
                          id="name"
                          label="Name"
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
                          value={values.name}
                          errorText={
                            errors.name && touched.name ? errors.name : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="userName"
                          label="User Name"
                          onChangeText={handleChange("userName")}
                          onBlur={handleBlur("userName")}
                          value={values.userName}
                          errorText={
                            errors.userName && touched.userName
                              ? errors.userName
                              : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="email"
                          label="Email"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          errorText={
                            errors.email && touched.email ? errors.email : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="phoneNumber"
                          label="Phone Number"
                          onChangeText={handleChange("phoneNumber")}
                          onBlur={handleBlur("phoneNumber")}
                          value={values.phoneNumber}
                          errorText={
                            errors.phoneNumber && touched.phoneNumber
                              ? errors.phoneNumber
                              : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="gender"
                          label="Gender"
                          onChangeText={handleChange("gender")}
                          onBlur={handleBlur("gender")}
                          value={values.gender}
                          errorText={
                            errors.gender && touched.gender ? errors.gender : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="password"
                          label="Password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          errorText={
                            errors.password && touched.password
                              ? errors.password
                              : ""
                          }
                          showCheckbox={false}
                        />

                        <Input
                          id="country"
                          label="Country"
                          onChangeText={handleChange("country")}
                          onBlur={handleBlur("country")}
                          value={values.country}
                          errorText={
                            errors.country && touched.country
                              ? errors.country
                              : ""
                          }
                          showCheckbox={false}
                        />
                        <Button title="Login" onPress={() => handleSubmit()} />
                      </View>
                    )}
                  </Formik>
                </ScrollView>
              </>
            )}

            {/* {mode === "notifications" && (
              <>
                <View style={{ alignItems: "flex-start", width: "100%" }}>
                  <Button
                    title="New Notification"
                    style={{ borderRadius: 10 }}
                    onPress={handleNewNotificationPress}
                  />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <View style={{ marginTop: 20 }}>
                    {dummyNotifications.map((notification, index) => (
                      <View
                        key={index}
                        style={[
                          {
                            padding: 10,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            {
                              color: dark ? COLORS.white : COLORS.black,
                              fontSize: 13,
                              marginBottom: 8,
                            },
                          ]}
                        >
                          {notification.description}
                        </Text>

                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text
                            style={[
                              {
                                color: dark ? COLORS.white : COLORS.black,
                                fontSize: 10,
                                marginRight: 10,
                              },
                            ]}
                          >
                            {notification.date}
                          </Text>
                          <Text
                            style={[
                              {
                                color: dark ? COLORS.white : COLORS.black,
                                fontSize: 10,
                                marginRight: 10,
                              },
                            ]}
                          >
                            {notification.sendingBy}
                          </Text>
                          <Text
                            style={[
                              {
                                color: dark ? COLORS.white : COLORS.black,
                                fontSize: 10,
                              },
                            ]}
                          >
                            {notification.isDelivered}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </>
            )} */}
          </View>
        </View>
      </Modal>
      <NewNotificationModal
        visible={isNewNotificationVisible}
        onClose={() => setIsNewNotificationVisible(false)}
      />
    </>
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
    position: "absolute",
    bottom: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userName: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
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
