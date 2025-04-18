import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaFrame } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import Box from '@/components/DashboardBox';
import RecentChats from '@/components/RecentChats';
import Header from '@/components/Header';
import { usersData } from '@/utils/usersData';
import { useAuth } from '@/contexts/authContext';
import { useQuery } from '@tanstack/react-query';
import { ChatStatus, getAgentStats, getAllChatsWithCustomer, getTransactionForAgent, IAllCustomerChatsRes } from '@/utils/queries/agentQueries';
import { FlatList } from 'react-native-gesture-handler';
import ChatContactList from '@/components/ChatContactList';
import { getAdminDashboardStats, getAllTransactions } from '@/utils/queries/adminQueries';
import TransactionTable from '@/components/TrsansactionTable';
import { Transaction } from '@/utils/queries/datainterfaces';
import FullTransactionModal from '@/components/TransactionDetailModal';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Year');
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const { dark } = useTheme();
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const { userData } = useAuth();
  const { token } = useAuth();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [limitedChats, setLimitedChats] = useState<any>([]);
  const {
    data: agtenStatsData,
    isLoading: agentStatsLoading,
    isError: isAgentStatsError,
    error: agentStatsError,
  } = useQuery({
    queryKey: ['agentStats'],
    refetchInterval: 30000,
    queryFn: () => getAgentStats(token),
    enabled: !!token && userData?.role === 'agent',
  });
  const {
    data: adminstatsData,
    isLoading: adminStatsLoading,
    isError: isAdminStatsError,
    error: adminStatsError,
  } = useQuery({
    queryKey: ['adminStats'],
    refetchInterval: 30000,
    queryFn: () => getAdminDashboardStats(token),
    enabled: !!token && userData?.role === 'admin',
  });
  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const {
    data: allTransactionsData,
  } = useQuery({
    queryKey: ['all-transactions'],
    queryFn: () => getAllTransactions(token),
    enabled: !!token && userData?.role === 'admin',
  });
  useEffect(() => {

    console.log("admin statas", adminstatsData?.data)
    // console.log("allttransaction data", allTransactionsData);
  }, [adminstatsData])
  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: isAllChatsError,
    error: allChatsError,
  } = useQuery({
    queryKey: ['all-chats-with-customer'],
    queryFn: () => getAllChatsWithCustomer(token),
    refetchInterval: 30000,

  });
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
  useEffect(() => {
    if (allChatsData) {
      setLimitedChats(allChatsData?.data?.slice(0, 5));
    }
  }, [allChatsData]);


  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Header /> */}
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black, paddingTop: 20 },
            ]}
          >
            Dashboard
          </Text>
        </View>
        {userData?.role === 'admin' ? (

          <View style={{ padding: 10 }}>

            <View style={styles.row}>
              <Box
                title="Total Users"
                value={adminstatsData?.data.totalUsers.count?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Total Agents"
                value={adminstatsData?.data.totalAgents.count?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
            </View>
            <View style={styles.row}>
              <Box
                title="Total Transactions"
                value={adminstatsData?.data.totalTransactions.count?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Active User"
                value={adminstatsData?.data.totalUsers.count || '0'}
                simpleText="Edit"
                condition={false}
              />

            </View>
            <View style={styles.row}>
              <Box
                title="Verified Users"
                value={adminstatsData?.data.totalVerifiedUsers.count?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Total OutFlow"
                value={'₦' + adminstatsData?.data.totalOutflow.current?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
            </View>
            <View style={styles.row}>
              <Box
                title="Total Revenue"
                value={'₦' + adminstatsData?.data.totalRevenue.current?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Total Profit"
                value={'₦' + adminstatsData?.data.totalInflow.current?.toString() || '0'}
                simpleText="Edit"
                condition={false}
              />
            </View>
          </View>
        ) :
          (<View style={{ padding: 10 }}>
            <View style={styles.row}>
              <Box title="Total Chats" value={agtenStatsData?.data.totalChats.toString() || '0'} />
              <Box title="SuccessFull Transactions" value={agtenStatsData?.data.successfulllTransactions.toString() || '0'} />
            </View>
            <View style={styles.row}>
              <Box
                title="Pending Chats"
                value={agtenStatsData?.data.pendingChats.toString() || '0'}

              />
              <Box title="Declined Chats" value={agtenStatsData?.data.declinedChats.toString() || '0'} percentage={0} condition />
            </View>

          </View>

          )}
        {userData?.role === 'admin' ? (
          <View style={{ padding: 10, marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginVertical: 15,
                color: dark ? COLORS.white : COLORS.black,
                marginLeft: 10
              }}
            >
              All Transactions
            </Text>
            {allTransactionsData?.data && (
              <TransactionTable
                data={allTransactionsData.data}
                darkMode={dark}
                isShown={true}
                userRole={userData?.role || ""}
                onMenuToggle={handleMenuToggle}
                onTransactionDetails={(id, item) =>
                  handleTransactionDetails(id, item)
                }
                menuVisible={menuVisible}
              />
            )}
            <FullTransactionModal
              transactionId=""
              visible={transactionModalVisible}
              onClose={() => setTransactionModalVisible(false)}
              transactionData={selectedTransaction}
            />
          </View>
        ) :
          (
            <View style={{ padding: 10 }}>
              <Text>Recent Chats</Text>
              <FlatList
                data={limitedChats}
                style={styles.chatList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ChatContactList
                    id={item.id.toString()}
                    iswhiteBg={true}
                    pfp={item.customer.profilePicture}
                    name={`${item.department?.title} - ${item.customer.firstname} ${item.customer.lastname} `}
                    icon={icons.gallery}
                    time={item?.recentMessageTimestamp}
                    msg={item?.recentMessage?.message}
                    status={item.chatStatus}
                    messageCount={item.messagesCount}
                  />
                )}
              />
            </View>
          )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  boxContainer: {
    padding: 15,
  },
  chatList: {
    marginTop: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  inputAndroid: {
    color: COLORS.grayscale400,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 18,
  },
});
