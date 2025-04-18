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
import { transactionDetails, usersData } from "../utils/usersData";
import { transactionsData } from "../utils/usersData";
import FullTransactionModal from "./TransactionDetailModal";
import { gettAllCustomerss, getTransactions } from "@/utils/queries/adminQueries";
import { useQuery } from "@tanstack/react-query";
// import { token } from "@/utils/apiConfig";
// import { token } from "@/utils/apiConfig";
import { Transaction, Customer } from "@/utils/queries/datainterfaces";
import { useAuth } from "@/contexts/authContext";

const RecentChats: React.FC<{ indexChats: boolean }> = ({ indexChats }) => {
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { token } = useAuth();
  // const { token } = useAuth();
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

  const { data: customerTransactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ["customerDetails"],
    queryFn: () => getTransactions({ token }),
    enabled: indexChats && !!token,
  });
  const { data: getAllCustomerss, isLoading: loadingCustomers } = useQuery({
    queryKey: ["getCustomers"],
    queryFn: () => gettAllCustomerss({ token }),
    enabled: !indexChats && !!token, // Only enabled if indexChats is false
  });

  // Loading Placeholder
  if (loadingTransactions || loadingCustomers) {
    return <Text>Loading...</Text>;
  }

  // Data to Display
  const dataToRender = indexChats ? customerTransactions?.data : getAllCustomerss?.data;

  console.log("gettAllCustomerss", dataToRender);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text === "") {
      setFilteredData(getAllCustomerss?.data || []);
    } else {
      const filterData = usersData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filterData);
    }
  };

  const handleModalVisible = () => {
    setModalVisible(!modalVisible);
    setMenuVisible(null)
  };

  const handleTransactionModal = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsTransactionModalVisible(true);
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
    setMenuVisible(null);
  };

  const handleViewCustomerDetails = (customerId: number) => {
    // Search in both sources
    const customer =
      getAllCustomerss?.data.find(
        (item: Customer) => item.id === customerId
      ) ||
      customerTransactions?.data.find(
        (item: Transaction) => item.customer?.id === customerId
      )?.customer;

    console.log("The Details", customer);
    setMenuVisible(null);

    if (customer) {
    push(`/profile?id=${customer.id}`);
    } else {
      console.error("Customer not found");
    }
  };



  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const handleViewTransactionDetails = (transactionId: string) => {
    const transaction = transactionsData.find((item) => item.id === transactionId);
    if (transaction) {
      setSelectedTransactionId(transaction.id);
      setIsTransactionModalVisible(true);
      setMenuVisible(null);
    }
  };
  console.log(customerTransactions);

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

        {/* <View
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
        </View> */}
      </View>
      <FlatList
        data={dataToRender}
        scrollEnabled={false}
        keyExtractor={(item: Transaction | Customer) => item.id.toString()}
        renderItem={({ item }: { item: Transaction | Customer }) => (
          <View
            style={[
              styles.itemContainer,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            {/* Profile Initial */}
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
                {indexChats && "customer" in item
                  ? item.customer?.firstname?.charAt(0).toUpperCase() || "N"
                  : (item as Customer).firstname?.charAt(0).toUpperCase() || "N"}
              </Text>
            </View>

            {/* Profile Details */}
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.name,
                  { color: dark ? COLORS.white : COLORS.black },
                ]}
              >
                {indexChats && "customer" in item
                  ? item.customer?.firstname || "N/A"
                  : (item as Customer).firstname || "N/A"}
              </Text>
              <Text style={styles.username}>
                {indexChats && "customer" in item
                  ? item.customer?.username || "N/A"
                  : (item as Customer).username || "N/A"}
              </Text>
            </View>

            {/* Status or Menu Section */}
            {indexChats && "status" in item ? (
              <View style={[styles.statusContainer, { flexDirection: "row" }]}>
                <Text
                  style={
                    item.status === "Failed"
                      ? styles.failedStatus
                      : styles.successfulStatus
                  }
                >
                  {item.status || "Unknown"}
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
                        onPress={() =>
                          handleViewCustomerDetails((item as Transaction).customerId)
                        }
                      >
                        <Text style={[styles.dropdownItem, textColor]}>
                          View Customer Details
                        </Text>
                      </TouchableOpacity>

                    
                    </View>
                  )}
                </View>
              </View>
            ) : (
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
    width: "100%",
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
    top: 0,
    right: 20,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    width: 200,
    zIndex: 300,
  },
});

export default RecentChats;
