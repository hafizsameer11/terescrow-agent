import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { COLORS, icons } from "@/constants";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import FilterModal from "./FilterModal";
import EditProfileModal from "./EditProfileModal";
import { usersData } from "../utils/usersData";
import { transactionsData } from "../utils/usersData";
import FullTransactionModal from "./TransactionDetailModal";

const RecentChats: React.FC<{ indexChats: boolean }> = ({ indexChats }) => {
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filteredData, setFilteredData] = useState(usersData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    null
  );
  const { push } = useRouter();
  const { dark } = useTheme();

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text === "") {
      setFilteredData(usersData);
    } else {
      const filterData = usersData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filterData);
    }
  };

  const handleModalVisible = () => {
    setModalVisible(!modalVisible);
  };

  const handleTransactionModal = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsTransactionModalVisible(true);
  };

  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  const handleMenuToggle = (index: string) => {
    if (menuVisible === index) {
      setMenuVisible(null);
    } else {
      setMenuVisible(index);
    }
  };

  const handleFilterPress = () => {
    setIsModalVisible(true);
  };

  const handleViewCustomerDetails = (customerId: string) => {
    const customer = usersData.find((item) => item.id === customerId);
    if (customer) {
      push(`/profile?id=${customer.id}`);
    }
  };

  const handleViewTransactionDetails = (transactionId: string) => {
    const transaction = transactionsData.find((item) => item.id === transactionId);
    if (transaction) {
      setSelectedTransactionId(transaction.id);
      setIsTransactionModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchFilterContainer}>
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
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
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
                {item.name.charAt(0).toUpperCase()}
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
              <View style={[styles.statusContainer, { flexDirection: "row" }]}>
                <Text
                  style={
                    item.status === "Failed"
                      ? styles.failedStatus
                      : styles.successfulStatus
                  }
                >
                  {item.status}
                </Text>
                <View style={styles.menuContainer}>
                  <TouchableOpacity onPress={() => handleMenuToggle(item.id)}>
                    <Image
                      source={icons.threeDots}
                      style={[
                        styles.dotsImage,
                        { tintColor: dark ? COLORS.white : COLORS.black },
                      ]}
                    />
                  </TouchableOpacity>

                  {menuVisible === item.id && (
                    <View
                      style={[
                        styles.dropdownMenu,
                        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => handleViewCustomerDetails(item.id)}
                      >
                        <Text style={[styles.dropdownItem, textColor]}>
                          View Customer Details
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleTransactionModal(item.id)}
                      >
                        <Text style={[styles.dropdownItem, textColor]}>
                          View Transaction Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.menuContainer}>
                <Text
                  style={[
                    styles.statusCircle,
                    {
                      backgroundColor:
                        item.status === "Failed" ? COLORS.red : COLORS.primary,
                    },
                  ]}
                />
                <TouchableOpacity onPress={() => handleMenuToggle(item.id)}>
                  <Image
                    source={icons.threeDots}
                    style={[
                      styles.dotsImage,
                      { tintColor: dark ? COLORS.white : COLORS.black },
                    ]}
                  />
                </TouchableOpacity>

                {menuVisible === item.id && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleViewCustomerDetails(item.id)}
                    >
                      <Text style={[styles.dropdownItem, textColor]}>
                        View Customer Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleTransactionModal(item.id)}
                    >
                      <Text style={[styles.dropdownItem, textColor]}>
                        View Transaction Details
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleModalVisible}>
                      <Text style={[styles.dropdownItem, textColor]}>
                        Notifications
                      </Text>
                    </TouchableOpacity>
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
      <FullTransactionModal
        visible={isTransactionModalVisible}
        onClose={() => setIsTransactionModalVisible(false)}
        transactionId={selectedTransactionId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  dropdownItem: {
    padding: 10,
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
  menuContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  dotsImage: {
    width: 20,
    height: 20,
    zIndex: 2,
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 20,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    width: 200,
    zIndex: 200,
  },
});

export default RecentChats;
