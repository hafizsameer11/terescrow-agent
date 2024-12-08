import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/themeContext";
import { COLORS, icons } from "@/constants";
import { Formik } from "formik";
import { validationNewNotification } from "./Validation";
import Input from "./CustomInput";
import Button from "./Button";
const NewNotificationModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const { dark } = useTheme();
  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
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

          <Text
            style={[
              styles.modalTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            New Notification
          </Text>
          <View>
            <Formik
              initialValues={{ title: "", message: "" }}
              validationSchema={validationNewNotification}
              onSubmit={onClose}
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
                    id="title"
                    label="Title"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    errorText={
                      errors.title && touched.title ? errors.title : ""
                    }
                    showCheckbox={false}
                  />

                  <Input
                    id="message"
                    label="Message"
                    onChangeText={handleChange("message")}
                    onBlur={handleBlur("message")}
                    value={values.message}
                    errorText={
                      errors.message && touched.message ? errors.message : ""
                    }
                    showCheckbox={false}
                  />

                  <TouchableOpacity
                    style={[
                      styles.imageCont,
                      { borderColor: dark ? COLORS.white : COLORS.gray },
                    ]}
                  >
                    <Image
                      source={icons.gallery}
                      style={[
                        styles.image,
                        { tintColor: dark ? COLORS.white : COLORS.black },
                      ]}
                    />
                  </TouchableOpacity>

                  <Button
                    title="Send"
                    onPress={() => handleSubmit()}
                    style={{ borderRadius: 10 }}
                  />
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewNotificationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  imageCont: {
    borderWidth: 1,
    borderRadius: 10,
    width: "17%",
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
