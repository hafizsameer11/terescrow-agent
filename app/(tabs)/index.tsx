import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, icons } from "@/constants";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";
import Box from "@/components/DashboardBox";
import RecentChats from "@/components/RecentChats";
import Header from "@/components/Header";
import { usersData } from "@/utils/usersData";
import { useAuth } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import {
  ChatStatus,
  getAgentStats,
  getAllChatsWithCustomer,
} from "@/utils/queries/agentQueries";
import { FlatList } from "react-native-gesture-handler";
import ChatContactList from "@/components/ChatContactList";

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState("Year");
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const { dark } = useTheme();
  const { userData } = useAuth();
  const { token } = useAuth();
  const {
    data: agtenStatsData,
    isLoading: agentStatsLoading,
    isError: isAgentStatsError,
    error: agentStatsError,
  } = useQuery({
    queryKey: ["agentStats"],
    refetchInterval: 30000,
    queryFn: () => getAgentStats(token),
  });
  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };
  const {
    data: allChatsData,
    isLoading: allChatsLoading,
    isError: isAllChatsError,
    error: allChatsError,
  } = useQuery({
    queryKey: ["all-chats-with-customer"],
    queryFn: () => getAllChatsWithCustomer(token),
    refetchInterval: 30000,
  });

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
                { label: 'Year', value: 'Year' },
                { label: 'Month', value: 'Month' },
                { label: 'Day', value: 'Day' },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <Image
                  source={icons.arrowDown}
                  style={{
                    width: 20,
                    height: 20,
                    padding: 10,
                    position: 'absolute',
                    right: -5,
                    top: 8,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              )}
            />
          </View> */}
        </View>
        {/* {u} */}
        {userData?.role === "admin" ? (
          <View style={{ padding: 10 }}>
            <View style={styles.row}>
              <Box
                title="Total Income"
                value="$1,000"
                percentage={7}
                condition
              />
              <Box title="Total Inflow" value="$500" percentage={5} condition />
            </View>
            <View style={styles.row}>
              <Box
                title="Total Expense"
                value="$1,000"
                percentage={8}
                condition
              />
              <Box
                title="Total Outflow"
                value="$500"
                percentage={4}
                condition
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginVertical: 15,
                color: dark ? COLORS.white : COLORS.black,
              }}
            >
              Rates
            </Text>
            <View style={styles.row}>
              <Box
                title="Crypto buy"
                value="$1,000"
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Crypto sell"
                value="$1,000"
                simpleText="Edit"
                condition={false}
              />
            </View>
            <View style={styles.row}>
              <Box
                title="Crypto buy"
                value="$1,000"
                simpleText="Edit"
                condition={false}
              />
              <Box
                title="Gift card sell"
                value="$1,000"
                simpleText="Edit"
                condition={false}
              />
            </View>
          </View>
        ) : (
          <View style={{ padding: 10 }}>
            <View style={styles.row}>
              <Box
                title="Total Chats"
                value={agtenStatsData?.data.totalChats.toString() || "0"}
                percentage={7}
                condition
              />
              <Box
                title="SuccessFull Transactions"
                value={
                  agtenStatsData?.data.successfulllTransactions.toString() ||
                  "0"
                }
                percentage={5}
                condition
              />
            </View>
            <View style={styles.row}>
              <Box
                title="Pending Chats"
                value={agtenStatsData?.data.pendingChats.toString() || "0"}
                percentage={8}
                condition
              />
              <Box
                title="Declined Chats"
                value={agtenStatsData?.data.declinedChats.toString() || "0"}
                percentage={0}
                condition
              />
            </View>
          </View>
        )}
        {userData?.role === "admin" ? (
          <View>
            <RecentChats indexChats />
          </View>
        ) : (
          <View style={{ padding: 10 }}>
            <Text>Recent Chats</Text>
            <FlatList
              data={allChatsData?.data}
              style={styles.chatList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ChatContactList
                  id={item.id.toString()}
                  pfp={item.customer.profilePicture}
                  name={item.customer.username}
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
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
    textAlign: "center",
  },
  inputAndroid: {
    color: COLORS.grayscale400,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 18,
  },
});
