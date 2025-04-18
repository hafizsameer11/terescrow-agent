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
import { getTransactions, getCustomerTransactions, getAllTransactions } from "@/utils/queries/adminQueries";
import { useAuth } from "@/contexts/authContext";
import { getTransactionForAgent, getTransactionStatsForAgent } from "@/utils/queries/agentQueries";
import { Transaction } from "@/utils/queries/datainterfaces";
import { DataTable } from "react-native-paper";
const getRandomStatus = () => {
  const statuses = ["successfull", "failed", "pending"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const Transactions: React.FC<{ isShown: boolean, customerId?: string }> = ({ isShown = true, customerId }) => {
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);

  const [selectedOption, setSelectedOption] = useState("Last 30 days");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
    queryKey: customerId ? ["customerTransactions", customerId] : ["customerTransactions"],
    queryFn: () =>
      customerId
        ? getCustomerTransactions({ token, id: customerId })
        : getAllTransactions(token),
    enabled: !!token,
  });
  const {
    data: agentTransactions,
  } = useQuery({
    queryKey: ['agentTransactions'],
    queryFn: () => getTransactionForAgent(token),
    enabled: !!token && userData?.role === 'agent',
  });
  const {
    data: agentTransactionsStats,
  } = useQuery({
    queryKey: ['agentTransactionStats'],
    queryFn: () => getTransactionStatsForAgent(token),
    refetchInterval: 3000,
    enabled: !!token
  });
  useEffect(() => {
    if (userData?.role == 'admin') {
      setFilteredData(customerTransactions?.data || []);
      console.log("customerTransactions", customerTransactions?.data);
    } else {
      setFilteredData(agentTransactions?.data || []);
      console.log("agentTransactions", agentTransactions?.data);
      console.log("agentTransactions", agentTransactions?.data);
    }

  }, [agentTransactions || customerTransactions]);
  const handleSearch = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      // Reset to the full list when search query is empty
      if (activeBtn === "All") {
        if (userData?.role === 'admin') {
          setFilteredData(customerTransactions?.data || []);
        } else {
          setFilteredData(agentTransactions?.data || []);
        }
      } else {
        const filtered = (userData?.role === 'admin' ? customerTransactions?.data : agentTransactions?.data)?.filter(
          (item) => item.department?.niche.toLowerCase() === activeBtn.toLowerCase()
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




  const handlePress = (btn: string) => {
    setActiveBtn(btn);

    if (btn === "All") {
      if (userData?.role === 'admin') {
        setFilteredData(customerTransactions?.data || []);
      } else {
        setFilteredData(agentTransactions?.data || []);
      }
    } else {
      const filtered = (userData?.role === 'admin' ? customerTransactions?.data : agentTransactions?.data)?.filter(
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
    setMenuVisible(null)
  };
  const handleTransactionDetails = (
    id: number, item: Transaction
  ) => {
    setSelectedTransaction(item);
    handleTransactionModal(id.toString());
    setMenuVisible(null);
    console.log("selected transaction", selectedTransaction);
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite, },
      ]}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: 10 }]}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Transactions
          </Text>
        </View>
        {!customerId &&


          <View >
            <View style={styles.row}>
              <Box title="Total Transactions" value={(agentTransactionsStats?.data.totalTransactions.count || 0).toString()} condition />
              <Box title="Crypto Transaction" value={'$' + (agentTransactionsStats?.data.cryptoTransactions._sum.amount)?.toString()} condition />

            </View>
            <View>
              <Box title="Gift Card Transaction" value={'$' + (agentTransactionsStats?.data.giftCardTransactions._sum.amount)?.toString()} condition />
            </View>
          </View>
        }
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
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            {/* Table Header */}
            <DataTable.Header style={[styles.tableHeader, dark && styles.darkHeader]}>
              <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
                Name
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
                Status
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
                Department
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
                Amount
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
                Date
              </DataTable.Title>
            </DataTable.Header>

            {/* Table Rows */}
            {/* {!isLoading && } */}
            {!isLoading && filteredData && filteredData?.map((item, index) => (
              <DataTable.Row key={index} style={[styles.tableRow, { position: "relative" }]}>
                <DataTable.Cell style={{ width: 120 }}>
                  {item.customer?.username}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  <Text
                    style={{

                      backgroundColor: COLORS.primary,
                      color: COLORS.white,
                      textAlign: "center",
                      borderRadius: 5,
                      padding: 4,
                    }}
                  >
                    {item.status}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150 }}>
                  {item.department?.niche} {item.department?.Type}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  {item.amount}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 120 }}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell >


                  <View style={tableHeader.actionCell}>
                    <TouchableOpacity onPress={() => handleMenuToggle(index)}>
                      <Image
                        source={icons.threeDots}
                        style={{
                          width: 20,
                          height: 20,
                          marginBottom: 17,
                          marginRight: 13,
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
                        {/* {isShown && userData?.role === "admin" && (

                          <TouchableOpacity style={[tableHeader.dropdownItem]}>
                            <Text
                              style={textColor}
                              onPress={()=>console.log(item)}
                            >
                              View Customer Details
                            </Text>
                          </TouchableOpacity>
                        )} */}
                        <TouchableOpacity
                          style={[tableHeader.dropdownItem]}
                          onPress={() => handleTransactionDetails(item.id, item)}
                        >
                          <Text style={textColor}>View Transaction Details</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>

        <FullTransactionModal
          transactionId=""
          visible={transactionModalVisible}
          onClose={() => setTransactionModalVisible(false)}
          transactionData={selectedTransaction}
        />
      </ScrollView>
    </SafeAreaView >
  );
};

export default Transactions;

const styles = StyleSheet.create({


  table: {
    marginTop: 20,
  },
  tableHeader: {
    backgroundColor: COLORS.grayscale200,
  },
  darkHeader: {
    backgroundColor: COLORS.dark2,
  },
  headerCell: {
    // fontWeight: "bold",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  },
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
    // paddingHorizontal: 13,
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
    // paddingHorizontal: 10,
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
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
    paddingHorizontal: 10,
    // textAlign: "center",
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
    position: 'relative',
    overflow: 'visible'
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    // textAlign: "center",
  },
  actionCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative'
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
    justifyContent: "flex-start"
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
    top: -20,
    right: 40,
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
