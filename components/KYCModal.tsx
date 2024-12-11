import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { usersData } from "@/utils/usersData";
import { useTheme } from "@/contexts/themeContext";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { useLocalSearchParams } from "expo-router";

interface KYCModalProps {
  visible: boolean;
  onClose: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ visible, onClose }) => {
  const { id } = useLocalSearchParams(); // Get user ID from route params
  const user = usersData.find((item) => item.id === id);

  const { dark } = useTheme();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  if (!user) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.errorText}>User not found!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image source={icons.close2} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const [formData, setFormData] = useState({
    surname: user.surname || "",
    firstName: user.firstName || "",
    bvn: user.bvn || "",
    dateOfBirth: user.dateOfBirth || "",
    updateStatus: user.updateStatus || "Successful",
  });

  useEffect(() => {
    setFormData({
      surname: user.surname || "",
      firstName: user.firstName || "",
      bvn: user.bvn || "",
      dateOfBirth: user.dateOfBirth || "",
      updateStatus: user.updateStatus || "Successful",
    });
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image
                source={icons.close2}
                style={{
                  width: 25,
                  padding: 10,
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
              KYC Details
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Surname
            </Text>
            <TextInput
              style={[styles.input, textColor]}
              value={formData.surname}
              onChangeText={(value) => handleChange("surname", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              First Name
            </Text>
            <TextInput
              style={[styles.input, textColor]}
              value={formData.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              BVN
            </Text>
            <TextInput
              style={[styles.input, textColor]}
              value={formData.bvn}
              onChangeText={(value) => handleChange("bvn", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.label,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Date of Birth
            </Text>
            <TextInput
              style={[styles.input, textColor]}
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange("dateOfBirth", value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, textColor]}>Update Status</Text>
            <TextInput
              style={[styles.input, textColor]}
              value={formData.updateStatus}
              onChangeText={(value) => handleChange("updateStatus", value)}
            />
          </View>
          <TouchableOpacity style={styles.updateButton} onPress={onClose}>
            <Text style={[styles.buttonText]}>Update</Text>
          </TouchableOpacity>
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
  modalContainer: {
    width: "90%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeIconCnntainer: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: COLORS.grayscale400,
  },
  closeIcon: { width: 18, height: 18, tintColor: COLORS.white },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
    zIndex: 3,
    right: 0,
    bottom: 0,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default KYCModal;
