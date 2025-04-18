import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import Button from '@/components/Button';
import FilterModal from '@/components/FilterModal';
import FullTransactionModal from '@/components/TransactionDetailModal';
import { transactionsData } from '@/utils/usersData';
import FullEditTransactionModal from '@/components/FullEditTransactionModal';
import { DataTable, TextInput } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getTransactionForAgent, getTransactionStatsForAgent } from '@/utils/queries/agentQueries';
import { getAllTransactions, getCustomerTransactions } from '@/utils/queries/adminQueries';
import { useAuth } from '@/contexts/authContext';
import { Transaction } from '@/utils/queries/datainterfaces';

const dummyData = Array(15).fill({
  id: uuid.v4(),
  name: 'Razer Gold',
  location: 'United States',
  type: 'E-Code',
  amountUSD: '$100',
  amountNGN: 'NGN170,000',
  profit: 'NGN3,000',
  paid: 'NGN,000',
  loggedBy: 'Dave',
});

const Log = () => {
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState('giftCard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token, userData } = useAuth();
  // const [filteredData, setFilteredData] = useState<Transaction[] | null>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    niche: 'All',
    type: 'All',
    search: '',
  });

  const [filteredData, setFilteredData] = useState<Transaction[] | null>([]);
  const [editTransactionModalVisible, setEditTransactionModalVisible] =
    useState(false);

  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };
  const {
    data: customerTransactions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customerTransactions"],
    queryFn: () =>
      getAllTransactions(token),
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
    const transactions =
      userData?.role === 'admin'
        ? customerTransactions?.data || []
        : agentTransactions?.data || [];

    const filtered = transactions.filter((transaction) => {
      const matchesNiche =
        filters.niche === 'All' || transaction.department?.niche === filters.niche;

      const matchesType =
        filters.type === 'All' || transaction.department?.Type === filters.type;

      const matchesSearch =
        filters.search === '' ||
        transaction.customer?.username
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesNiche && matchesType && matchesSearch;
    });

    setFilteredData(filtered);
  }, [customerTransactions, agentTransactions, filters]);

  // Handle filter updates
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const handleEditTransactionModal = () =>
    setEditTransactionModalVisible(!editTransactionModalVisible);

  const handleTransactionModal = (transactionId: string) => {
    setTransactionModalVisible(!transactionModalVisible);
    setMenuVisible(null)
  };
  const handlePressModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePress = (btn: string) => {
    setActiveBtn(btn);
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
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
  
        <View style={styles.headerContainer}>

          <View style={styles.filtersContainer}>
            <View>
              <Text
                style={{
                  color: dark ? COLORS.white : COLORS.black,
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  marginLeft: 10,
                  marginTop: 10,
                }}
              >
                Log Card
              </Text>
            </View>
            <View style={styles.filterGroup}>
              <TouchableOpacity
                onPress={() => handleFilterChange('niche', 'All')}
                style={[
                  styles.filterButton,
                  filters.niche === 'All' && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filters.niche === 'All' && styles.activeFilterButtonText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFilterChange('niche', 'giftCard')}
                style={[
                  styles.filterButton,
                  filters.niche === 'giftCard' && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filters.niche === 'giftCard' && styles.activeFilterButtonText,
                  ]}
                >
                  Gift Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleFilterChange('niche', 'crypto')}
                style={[
                  styles.filterButton,
                  filters.niche === 'crypto' && styles.activeFilterButton,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filters.niche === 'crypto' && styles.activeFilterButtonText,
                  ]}
                >
                  Crypto
                </Text>
              </TouchableOpacity>
            </View>


          </View>
        </View>

      <ScrollView horizontal>
        <DataTable style={styles.table}>
          {/* Table Header */}
          <DataTable.Header style={[styles.tableHeader, dark && styles.darkHeader]}>
            <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
              Name
            </DataTable.Title>

            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Department
            </DataTable.Title>
            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Sevice
            </DataTable.Title>
            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Type
            </DataTable.Title>
            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Niche
            </DataTable.Title>
            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Amount
            </DataTable.Title>
            <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
              Date
            </DataTable.Title>
          </DataTable.Header>

          {!isLoading && filteredData && filteredData?.map((item, index) => (
            <DataTable.Row key={index} style={[styles.tableRow, { position: "relative" }]}>
              <DataTable.Cell style={{ width: 120 }}>
                {item.customer?.username}
              </DataTable.Cell>

              <DataTable.Cell style={{ width: 150 }}>
                {item.department?.title}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>
                {item.category?.title}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>
                {item.department?.Type}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>
                {item.department?.niche}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>
                ${item.amount}/₦{item.amountNaira}
              </DataTable.Cell>
              <DataTable.Cell style={{ width: 150 }}>
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
    </View>
  );
};

export default Log;

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 10,
  },
  filterGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 1,

    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.primary,
  },
  activeFilterButtonText: {
    color: COLORS.white,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: COLORS.black,
  },

  table: {
    marginLeft: 20,
    marginTop: 0,
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
  scrollContainer: {
    // paddingHorizontal: 13,
    // marginBottom: 40,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    marginVertical: 15,
  },
  customBtn: {
    borderRadius: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
    top: 5,
    paddingRight: 10,
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
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: '85%',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  actionCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    paddingLeft: 13,
  },
  nameLocationCell: {
    flex: 1,
    flexDirection: 'column',
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
