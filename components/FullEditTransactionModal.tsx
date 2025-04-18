import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { usersData, transactionsData } from "@/utils/usersData";
import { useTheme } from "@/contexts/themeContext";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import Button from "./Button";

interface KYCModalProps {
  visible: boolean;
  onClose: () => void;
  transactionId: string | null;
}

const FullEditTransactionModal: React.FC<KYCModalProps> = ({
  visible,
  transactionId,
  onClose,
}) => {
  const { id } = useLocalSearchParams();
  const { dark } = useTheme();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  const [formData, setFormData] = useState({
    amount: "",
    serviceType: "",
    giftCardType: "",
    giftCardSubType: "",
    quantity: "",
    code: "",
    transactionId: "",
    assignedAgent: "",
    status: "",
  });

  useEffect(() => {
    if (transactionId) {
      const transaction = transactionsData.find(
        (item) => item.id === transactionId
      );
      if (transaction) {
        setFormData({
          amount: transaction.amount || "",
          serviceType: transaction.serviceType || "",
          giftCardType: transaction.giftCardType || "",
          giftCardSubType: transaction.giftCardSubType || "",
          quantity: transaction.quantity || "",
          code: transaction.code || "",
          transactionId: transaction.id || "",
          assignedAgent: transaction.assignedAgent || "",
          status: transaction.status || "",
        });
      }
    }
  }, [transactionId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
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
            <View>
              <Text
                style={[
                  styles.modalTitle,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Full Transaction Details
              </Text>
              <TouchableOpacity style={[styles.closeButton]} onPress={onClose}>
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
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.transparentAccount,
                width: 80,
                height: 80,
                borderRadius: 50,
                margin: "auto",
              }}
            >
              <Image
                source={icons.check}
                style={{ width: 30, height: 30, tintColor: COLORS.primary }}
              />
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Amount - Dollar
              </Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.amount}
                onChangeText={(text) => handleChange("amount", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Service Type
              </Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.serviceType}
                onChangeText={(text) => handleChange("serviceType", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Gift Card Type
              </Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.giftCardType}
                onChangeText={(text) => handleChange("giftCardType", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                Gift Card Sub Type
              </Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.giftCardSubType}
                onChangeText={(text) => handleChange("giftCardSubType", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, textColor]}>Quantity</Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.quantity}
                onChangeText={(text) => handleChange("quantity", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, textColor]}>Code</Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.code}
                onChangeText={(text) => handleChange("code", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, textColor]}>Transaction Id</Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.transactionId}
                onChangeText={(text) => handleChange("transactionId", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, textColor]}>Assigned Agent</Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.assignedAgent}
                onChangeText={(text) => handleChange("assignedAgent", text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, textColor]}>Status</Text>
              <TextInput
                style={[styles.input, textColor, { borderColor: "#ccc" }]}
                value={formData.status}
                onChangeText={(text) => handleChange("status", text)}
              />
            </View>
            <View>
              <Button
                title="Complete"
                onPress={onClose}
                style={{ borderRadius: 10 }}
              />
            </View>
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
  modalContainer: {
    width: "90%",
    borderRadius: 10,
    height: 600,
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
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 40,
    justifyContent: "center",
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
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default FullEditTransactionModal;
