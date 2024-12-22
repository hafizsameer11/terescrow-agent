import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons } from "@/constants";
import { transactionsData, usersData } from "@/utils/usersData";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import FilterModal from "@/components/FilterModal";
import RNPickerSelect from "react-native-picker-select";
import Box from "@/components/DashboardBox";
import { Route, router } from "expo-router";
import FullTransactionModal from "@/components/TransactionDetailModal";
import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  getCustomerTransactions,
} from "@/utils/queries/adminQueries";

import { token } from "@/utils/apiConfig";
import { useAuth } from "@/contexts/authContext";
import { getTransactionForAgent } from "@/utils/queries/agentQueries";
import { Transaction } from "@/utils/queries/datainterfaces";
const getRandomStatus = () => {
  const statuses = ["successfull", "failed", "pending"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const Transactions: React.FC<{ isShown: boolean; customerId?: string }> = ({
  isShown = true,
  customerId,
}) => {
  console.log("Inside the Transaction Part", customerId);

  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);

  const [selectedOption, setSelectedOption] = useState("Last 30 days");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [query, setQuery] = useState("");
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const { userData, token } = useAuth();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const {
    data: customerTransactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: customerId
      ? ["customerDetails", customerId]
      : ["customerTransactions"],
    queryFn: () =>
      customerId
        ? getCustomerTransactions({ token, id: customerId })
        : getTransactions({ token }),
    enabled: !!token && (!!customerId || !customerId),
  });
  const {
    data: agentTransactions,
    isLoadingAgentTransactions,
    isErrorAgentTransactions,
  } = useQuery({
    queryKey: ["agentTransactions"],
    queryFn: () => getTransactionForAgent(token),
    enabled: !!token,
  });

  // Update State on Data Fetch
  useEffect(() => {
    if (userData?.role == "admin") {
      setFilteredData(customerTransactions?.data || []);
    } else {
      setFilteredData(agentTransactions?.data || []);
      console.log("Agent Transactions", agentTransactions);
    }
  }, [customerTransactions, agentTransactions]);

  // Search Filter Function
  const handleSearch = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      // Reset to the full list when search query is empty
      if (activeBtn === "All") {
        if (userData?.role === "admin") {
          setFilteredData(customerTransactions?.data || []);
        } else {
          setFilteredData(agentTransactions?.data || []);
        }
      } else {
        const filtered = (
          userData?.role === "admin"
            ? customerTransactions?.data
            : agentTransactions?.data
        )?.filter(
          (item) =>
            item.department?.niche.toLowerCase() === activeBtn.toLowerCase()
        );
        setFilteredData(filtered || []);
      }
      return;
    }

    const filtered = filteredData?.filter((item) =>
      item.customer.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered || []);
  };
  const handlePressModal = () => {
    setIsModalVisible(!isModalVisible);
    setMenuVisible(null);
  };

  const handlePress = (btn: string) => {
    setActiveBtn(btn);

    if (btn === "All") {
      if (userData?.role === "admin") {
        setFilteredData(customerTransactions?.data || []);
      } else {
        setFilteredData(agentTransactions?.data || []);
      }
    } else {
      const filtered = (
        userData?.role === "admin"
          ? customerTransactions?.data
          : agentTransactions?.data
      )?.filter(
        (item) => item.department?.niche.toLowerCase() === btn.toLowerCase()
      );
      setFilteredData(filtered || []);
    }
  };

  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleTransactionModal = (transactionId: string) => {
    setTransactionModalVisible(!transactionModalVisible);
    setMenuVisible(null);
  };

  // Render Each Row
  const renderRow = ({ item, index }: { item: Transaction; index: number }) => {
    const getStatusBgColor = (status: string) => {
      if (status === "pending") return COLORS.warning;
      if (status === "successfull") return COLORS.primary;
      if (status === "failed") return COLORS.red;
      return COLORS.transparentWhite;
    };

    const handleCustomerDetails = () => {
      router.push(`/profile?id=${item.customer?.id.toString()}`);
      setMenuVisible(null);
    };

    const handleTransactionDetails = (id: number, item: Transaction) => {
      handleTransactionModal(id.toString());
      setSelectedTransaction(item);
      setMenuVisible(null);
    };

    return (
      <View style={tableHeader.row} key={index}>
        <View style={tableHeader.nameLocationCell}>
          <Text style={[tableHeader.cell, textColor]}>
            {item.customer?.username}
          </Text>
        </View>

        <View style={[tableHeader.cell, { alignItems: "flex-start" }]}>
          <Text
            style={[
              {
                backgroundColor: getStatusBgColor(item.status),
                borderRadius: 5,
                padding: 4,
                height: 30,
                color: COLORS.white,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
        <Text
          style={[tableHeader.cell, textColor, { textTransform: "capitalize" }]}
        >
          {" "}
          {item.department?.niche} {item.department?.Type}
        </Text>
        <Text style={[tableHeader.cell, textColor]}>{item.amount}</Text>
        <Text style={[tableHeader.cell, textColor]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        <View style={tableHeader.actionCell}>
          <TouchableOpacity onPress={() => handleMenuToggle(index)}>
            <Image
              source={icons.threeDots}
              style={{
                width: 20,
                height: 20,
                tintColor: dark ? COLORS.white : COLORS.black,
              }}
            />
          </TouchableOpacity>
          {menuVisible === index && (
            <View
              style={[
                tableHeader.dropdownMenu,
                { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
              ]}
            >
              {isShown && userData?.role === "admin" && (
                <TouchableOpacity style={[tableHeader.dropdownItem]}>
                  <Text style={textColor} onPress={handleCustomerDetails}>
                    View Customer Details
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[tableHeader.dropdownItem]}
                onPress={() => handleTransactionDetails(item.id, item)}
              >
                <Text style={textColor}>View Transaction Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Transactions
          </Text>
          {/* <View
            style={[
              styles.pickerContainer,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <RNPickerSelect
              onValueChange={(value) => setSelectedOption(value)}
              value={selectedOption}
              items={[
                { label: "Last 30 days", value: "Last 30 days" },
                { label: "Last 60 days", value: "Last 60 days" },
                { label: "Last 90 days", value: "Last 90 days" },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Role", value: null }}
              Icon={() => (
                <Image
                  source={icons.arrowDown}
                  style={{
                    width: 20,
                    height: 20,
                    padding: 10,
                    position: "absolute",
                    right: -5,
                    top: 8,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              )}
            />
          </View> */}
        </View>
        <View style={{ padding: 10 }}>
          <View style={styles.row}>
            <Box title="Total Income" value="$1,000" percentage={7} condition />
            <Box title="Total Inflow" value="$500" percentage={5} condition />
          </View>
        </View>
        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress("All")}
            style={[styles.button, activeBtn === "All" && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "All"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("giftCard")}
            style={[
              styles.button,
              activeBtn === "giftCard" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "giftCard"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Gift Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("crypto")}
            style={[
              styles.button,
              activeBtn === "crypto" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "crypto"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Crypto
            </Text>
          </TouchableOpacity>
        </View>
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
            placeholder="Search Transactions"
            placeholderTextColor={dark ? COLORS.white : COLORS.black}
            value={query}
            onChangeText={handleSearch}
          />
        </View>
        <FilterModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />

        <ScrollView horizontal style={{ minHeight: 300 }}>
          <View style={{ width: 800 }}>
            <View
              style={[
                tableHeader.headerRow,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale200,
                  borderColor: dark ? COLORS.dark2 : "#ccc",
                  padding: 10,
                },
              ]}
            >
              <Text style={[tableHeader.headerCell, textColor]}>Name</Text>
              <Text style={[tableHeader.headerCell, textColor]}>Status</Text>
              <Text style={[tableHeader.headerCell, textColor]}>
                Department
              </Text>
              <Text style={[tableHeader.headerCell, textColor]}>
                Amount (₦)
              </Text>
              <Text style={[tableHeader.headerCell, textColor]}>Date</Text>
              <Text style={[tableHeader.headerCell, textColor]}></Text>
            </View>
            <FlatList
              data={filteredData}
              renderItem={renderRow}
              keyExtractor={(_, index) => index.toString()}
              style={{ maxHeight: 300 }}
            />
          </View>
        </ScrollView>

        <FullTransactionModal
          transactionId=""
          visible={transactionModalVisible}
          onClose={() => setTransactionModalVisible(false)}
          transactionData={selectedTransaction}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    width: "80%",
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  searchBar: {
    height: 40,
    width: "80%",
  },
  scrollContainer: {
    paddingHorizontal: 13,
    marginBottom: 40,
  },
  iconContainer: {
    position: "absolute",
    left: 15,
    top: 12,
    paddingRight: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    borderRadius: 10,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  customBtn: {
    borderRadius: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterIconContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});

const tableHeader = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: "bold",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableBody: {
    maxHeight: "85%",
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  actionCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  location: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    textAlign: "center",
  },
  nameLocationCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  userInitialContainer: {
    justifyContent: "center",
    backgroundColor: COLORS.gray,
    height: 30,
    width: 30,
    borderRadius: 50,
    alignItems: "center",
  },

  nameSubTitleContainer: {
    flex: 1,
    flexDirection: "column",
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
  dropdownItem: {
    padding: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: "center",
  },
  inputAndroid: {
    color: COLORS.grayscale400,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 18,
  },
});
