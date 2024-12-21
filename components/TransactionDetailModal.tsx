import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "@/contexts/themeContext";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import { Transaction } from "@/utils/queries/datainterfaces";

interface KYCModalProps {
  visible: boolean;
  onClose: () => void;
  transactionId: string | null;
  transactionData: Transaction | null;
}

const FullTransactionModal: React.FC<KYCModalProps> = ({
  visible,
  transactionId,
  onClose,
  transactionData,
}) => {
  const { id } = useLocalSearchParams();
  const { dark } = useTheme();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  const [formData, setFormData] = useState({
    Amount: "",
    Department: "",
    ServiceType: "",
    SubService: "",
    TransactionId: "",
    Customer: "",
    Status: "",
  });

  useEffect(() => {

    console.log('transactionData', transactionData)
      setFormData({
        Amount: transactionData?.amount.toString() || "",
        Department: transactionData?.department?.title || "",
        ServiceType: transactionData?.department?.Type || "",
        SubService: transactionData?.category?.title || "",
        TransactionId: transactionData?.id.toString() || "",
        Customer: transactionData?.customer?.username || "",
        Status: transactionData?.status || "",
      });

  }, []);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <View style={styles.headerContainer}>
            <Text
              style={[
                styles.modalTitle,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              Full Transaction Details
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Image
                source={icons.close2}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {Object.entries(formData).map(([label, value]) => (
              <View key={label} style={styles.dataRow}>
                <Text style={[styles.fieldLabel, textColor]}>{label}</Text>
                <Text style={[styles.fieldValue, textColor]}>{value}</Text>
              </View>
            ))}
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
    height: 530,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: COLORS.black,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: .5,
    borderColor: "#ccc",
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  fieldValue: {
    fontSize: 14,
  },
});

export default FullTransactionModal;
