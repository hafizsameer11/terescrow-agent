import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  GestureResponderEvent,
} from "react-native";
import { COLORS, icons } from "@/constants";
import { useTheme } from "@/contexts/themeContext";
import { useState, useRef } from "react";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import FilterModal from "./FilterModal";
import RNPickerSelect from "react-native-picker-select";
import EditProfileModal from "./EditProfileModal";

const data = [
  {
    id: "1",
    name: "Qamardeen malik",
    username: "Alucard",
    status: "Failed",
  },
  { id: "2", name: "Adam Sandler", username: "Adam", status: "Successful" },
  { id: "3", name: "Sasha Sloan", username: "Sasha", status: "Successful" },
  { id: "4", name: "John Doe", username: "john", status: "Failed" },
  { id: "5", name: "Jane Smith", username: "jane", status: "Successful" },
  { id: "6", name: "Michael Clark", username: "mike", status: "Failed" },
  { id: "7", name: "Emily Davis", username: "emily", status: "Successful" },
];

const RecentChats: React.FC<{ indexChats: boolean }> = ({ indexChats }) => {
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState<{ [key: string]: boolean }>({});
  const { dark } = useTheme();

  const handleTogglePicker = (itemId: string, value: string) => {
    setShowPicker((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };
  const handleSearch = (text: string) => {
    setQuery(text);
    if (query === "") {
      setFilteredData(data);
    } else {
      const filterData = data.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filterData);
    }
  };

  const handleFilterPress = () => {
    setIsModalVisible(true);
  };

  const handleSelection = (value: any) => {
    setSelectedOption(value);
    if (value === "notifications") {
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={[
            styles.searchContainer,
            {
              borderColor: dark ? COLORS.dark3 : COLORS.gray,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Image
              source={icons.search}
              style={[
                styles.icon,
                { tintColor: dark ? COLORS.white : COLORS.black },
              ]}
            />
          </View>
          <TextInput
            style={[
              styles.searchBar,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
            placeholder="Search"
            placeholderTextColor={dark ? COLORS.white : COLORS.black}
            value={query}
            onChangeText={handleSearch}
          />
        </View>

        <View
          style={[
            styles.filterIconContainer,
            {
              borderColor: dark ? COLORS.dark3 : COLORS.gray,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          ]}
        >
          <TouchableOpacity onPress={handleFilterPress}>
            <Image
              source={icons.filter}
              style={[
                styles.filterIcon,
                { tintColor: dark ? COLORS.white : COLORS.black },
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        style={{ borderRadius: 10 }}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.itemContainer,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <View
              style={[
                styles.dpContainer,
                { backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200 },
              ]}
            >
              <Text
                style={[
                  styles.dpText,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {item.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.name,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {item.name}
              </Text>
              <Text style={styles.username}>{item.username}</Text>
            </View>
            {indexChats ? (
              <View style={styles.statusContainer}>
                <Text
                  style={
                    item.status === "Failed"
                      ? styles.failedStatus
                      : styles.successfulStatus
                  }
                >
                  {item.status}
                </Text>
              </View>
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Text
                  style={[
                    styles.statusCircle,
                    {
                      backgroundColor:
                        item.status === "Failed" ? COLORS.red : COLORS.primary,
                    },
                  ]}
                >
                  {" "}
                </Text>

                <TouchableOpacity
                  onPress={() => handleTogglePicker(item.id, "")}
                >
                  <Image
                    source={icons.threeDots}
                    style={[
                      styles.dotsImage,
                      { tintColor: dark ? COLORS.white : COLORS.black },
                    ]}
                  />
                </TouchableOpacity>

                {showPicker[item.id] && (
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={handleSelection}
                      key={item.id}
                      value={""}
                      items={[
                        {
                          label: "View Customer Details",
                          value: "customerDetails",
                        },
                        {
                          label: "View Transaction Details",
                          value: "transactionDetails",
                        },
                        { label: "Notifications", value: "notifications" },
                      ]}
                      placeholder={{ label: "Select an option", value: null }}
                      useNativeAndroidPickerStyle={false}
                      style={{
                        inputAndroid: {
                          color: dark ? COLORS.white : COLORS.black,
                          padding: 10,
                          borderRadius: 8,
                          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        },
                        inputIOS: {
                          color: dark ? COLORS.white : COLORS.black,
                          padding: 10,
                          borderRadius: 8,
                          backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                        },
                        iconContainer: {
                          top: 10,
                          right: 10,
                        },
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      />

      <FilterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode="notifications"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dotsImage: {
    width: 20,
    height: 20,
  },
  pickerContainer: {
    position: "absolute",
    right: 20,
    width: 200,
    top: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    top: 5,
    paddingRight: 10,
  },
  filterIconContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 13,
  },

  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },

  searchContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: "85%",
  },
  searchBar: {
    height: 40,
    width: "80%",
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  icon: {
    marginTop: 5,
    width: 20,
    height: 20,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    alignItems: "center",
  },
  dpContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dpText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#888",
  },
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successfulStatus: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: COLORS.transparentAccount,
    padding: 5,
    borderRadius: 8,
  },
  failedStatus: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: COLORS.transparentRed,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 8,
  },
});

export default RecentChats;
