import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, icons } from "../constants";
import { useTheme } from "../contexts/themeContext";
import { Image } from "expo-image";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { dark, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedTime, setSelectedTime] = useState<string>("Last 30 days");

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Image
              source={icons.close2}
              style={{
                width: 25,
                height: 25,
                tintColor: dark ? COLORS.white : COLORS.black,
              }}
            />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, { color: dark ? COLORS.white : COLORS.black }]}>Filters</Text>

          <View style={styles.filterSection}>
            <View style={styles.buttonContainer}>
              {["All", "Gift Cards", "Crypto"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    [styles.filterButton],
                    selectedCategory === category && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterButtonText, {color: dark ? COLORS.white : COLORS.black},
                      selectedCategory === category &&
                        styles.selectedButtonText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.buttonContainer}>
              {["All", "Successful", "Pending", "Failed"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterButton,
                    selectedStatus === status && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterButtonText, {color: dark ? COLORS.white : COLORS.black},
                      selectedStatus === status && styles.selectedButtonText,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={[
              styles.filterSection,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                flexWrap: "wrap",
              },
            ]}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={[styles.buttonContainer, { width: "50%" }]}>
                {["All", "Buy", "Sell"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      selectedType === type && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText, {color: dark ? COLORS.white : COLORS.black},
                        selectedType === type && styles.selectedButtonText,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={{
                  paddingHorizontal: 5,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                }}
              >
                <RNPickerSelect
                  placeholder={{ label: "Select Time", value: null, color: dark ? COLORS.white : COLORS.black }}
                  onValueChange={(value: string) => setSelectedTime(value)}
                  value={selectedTime}
                  useNativeAndroidPickerStyle={false}
                  items={[
                    { label: "Last 30 days", value: "Last 30 days" },
                    { label: "Last 60 days", value: "Last 60 days" },
                    { label: "Last 90 days", value: "Last 90 days" },
                  ]}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    padding: 20,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
  },
  selectedButtonText: {
    color: "white",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    textAlign: "left",
  },
  inputAndroid: {
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    textAlign: "left",
    color: '#ccc',
  },
});

export default FilterModal;
