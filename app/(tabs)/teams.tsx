import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, icons } from "@/constants";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";
import Box from "@/components/DashboardBox";
import RecentChats from "@/components/RecentChats";
import Button from "@/components/Button";
import { getTeam } from "@/utils/queries/adminQueries";
import { token } from "@/utils/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const getRandomStatus = () => {
  const statuses = ["successfull", "failed", "pending"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// const dummyData = Array(15)
//   .fill(3)
//   .map(() => ({
//     name: "Razer Gold",
//     status: getRandomStatus(),
//     subTitle: "Adam",
//     date: "Nov 7, 2024",
//     role: "manager",
//   }));


export default function Department() {
  const [query, setQuery] = useState("");
  const { dark } = useTheme();
  const { push } = useRouter();
  const [activeBtn, setActiveBtn] = useState("active");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Role");
  const [menuVisible, setMenuVisible] = useState<string | null>(null);

  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  // Fetch Data from API
  const { data: teamData, isLoading, isError, error } = useQuery({
    queryKey: ['teamData'],
    queryFn: () => getTeam({ token }),
    enabled: !!token,
  });
  console.log("Team Data", teamData);
  const handleMenuToggle = (index: string) => {
    if (menuVisible === index) {
      setMenuVisible(null);
    } else {
      setMenuVisible(index);
    }
  };

  // Update Data on Fetch
  useEffect(() => {
    if (teamData?.data) {
      setFilteredData(teamData.data);
    }
  }, [teamData]);

  // Handle Button Press
  const handlePress = (btn: string) => setActiveBtn(btn);

  // Search Filter
  const handleSearch = (text: string) => {
    setQuery(text);
    const filterData = teamData?.data.filter((item) =>
      item.user.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filterData || []);
  };

  // Render Each Row
  const renderRow = (item, index) => {
    const getStatusBgColor = (status: string) => {
      if (status === "online") return COLORS.primary;
      if (status === "offline") return COLORS.warning;
      return COLORS.transparentWhite;
    };

    const handleViewCustomerDetails = (customerId: number) => {
      // Search in both sources
      // const customer =
      //   getAllCustomerss?.data.find(
      //     (item: Customer) => item.id === customerId
      //   ) ||
      //   customerTransactions?.data.find(
      //     (item: Transaction) => item.customer?.id === customerId
      //   )?.customer;

      // console.log("The Details", customer);
      // setMenuVisible(null);

      if (customerId) {
        push(`/profile?id=${customerId}`);
      } else {
        console.error("Customer not found");
      }
    };

    return (
      <View style={tableHeader.row} key={index}>
        <View style={[tableHeader.cell, tableHeader.nameCell, { width: '50%' }]}>
          <Image
            source={icons.userDefault}
            style={{
              width: 20,
              height: 20,
              tintColor: dark ? COLORS.white : COLORS.black,
            }}
          />
          <Text style={[{ marginLeft: 8 }, textColor]}>
            {item.user.firstname} {item.user.lastname}
          </Text>
          <View
            style={{
              width: 15,
              height: 15,
              marginLeft: 8,
              borderRadius: 50,
              backgroundColor: getStatusBgColor(item.AgentStatus),
            }}
          />
        </View>
        <Text style={[tableHeader.cell, textColor]}>
          {new Date(item.user.createdAt).toLocaleDateString()}
        </Text>
        <Text style={[tableHeader.cell, textColor]}>{item.user.role}</Text>
        <Text>
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
                  onPress={() => handleViewCustomerDetails(item.user.id)}
                >
                  <Text style={[styles.dropdownItem, textColor]}>
                    View Member Details
                  </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                // onPress={() => handleTransactionModal(item.id)}
                >
                  <Text style={[styles.dropdownItem, textColor]}>
                    View Transaction Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={[styles.dropdownItem, textColor]}>
                    Notifications
                  </Text>
                </TouchableOpacity> */}
              </View>
            )}
          </View>
        </Text>
        <View style={[tableHeader.actionCell, tableHeader.nameCell]}>
          {/* <Button
            title="Assign Agents"
            fontSize={12}
            style={{
              height: 35,
              borderRadius: 10,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: COLORS.primary,
            }}
            textColor={COLORS.primary}
          /> */}
          {/* <TouchableOpacity style={styles.iconButton}>
            <Image source={icons.eye2} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={icons.edit} style={styles.icon} />
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <Image
              source={icons.trash}
              style={[
                styles.icon,
                { tintColor: COLORS.red, width: 25, height: 25 },
              ]}
            />
          </TouchableOpacity> */}
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
        <View style={styles.container}>
          <Text style={[styles.title, textColor]}>Teams</Text>
          {/* <Button
            title="Add new Team"
            style={{ borderRadius: 10, height: 40 }}
            fontSize={12}
          /> */}
        </View>

        {/* <View style={{ padding: 10 }}>
          <View style={styles.row}>
            <Box title="Total Income" value="$1,000" percentage={7} condition />
            <Box title="Total Inflow" value="$500" percentage={5} condition />
          </View>
          <View style={styles.row}>
            <Box
              title="Total Expense"
              value="$1,000"
              percentage={8}
              condition
            />
            <Box title="Total Outflow" value="$500" percentage={4} condition />
          </View>
        </View> */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            gap: 5,
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
                style={[styles.icon, { tintColor: dark ? COLORS.white : COLORS.black }]}
              />
            </View>
            <TextInput
              style={[styles.searchBar, textColor]}
              placeholder="Search"
              placeholderTextColor={textColor.color}
              value={query}
              onChangeText={handleSearch}
            />
          </View>

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
                { label: "Manager", value: "Manager" },
                { label: "Agent", value: "Agent" },
                { label: "Owner", value: "Owner" },
              ]}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: "Role", value: null }}
              Icon={() => (
                <Image
                  source={icons.arrowDown}
                  style={{
                    width: 20,
                    position: "absolute",
                    top: 7,
                    left: -13,
                    height: 20,
                    tintColor: dark ? COLORS.white : COLORS.black,
                  }}
                />
              )}
            />
          </View> */}
        </View>

        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1,marginBottom:10 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress("active")}
            style={[
              styles.button,
              activeBtn === "active" && styles.activeButton
            ]}
          >
            <Text style={[styles.buttonText, activeBtn === "active" && { color: COLORS.white }]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("deleted")}
            style={[
              styles.button,
              activeBtn === "deleted" && styles.activeButton,
            ]}
          >
            <Text style={[styles.buttonText, activeBtn === "deleted" && { color: COLORS.white }]}>Deleted</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal>
          <View>
            <View
              style={[
                tableHeader.headerRow,
                {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale200,
                  borderColor: dark ? COLORS.dark2 : "#ccc",
                },
              ]}
            >
              <Text style={[tableHeader.headerCell, textColor]}>Team Name</Text>
              <Text style={[tableHeader.headerCell, textColor]}>Date Added</Text>
              <Text style={[tableHeader.headerCell, textColor]}>Role</Text>
              <Text style={[tableHeader.headerCell, textColor]}>Action</Text>
            </View>
            <View style={{ marginBottom: 100 }}>
              {filteredData.map((item, index) => renderRow(item, index))}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    left: 15,
    top: 12,
    paddingRight: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    marginBottom: 300,
  },
  menuContainer: {
    marginRight: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownMenu: {
    position: "absolute",
    top: -10,
    right: 20,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    width: 200,
    zIndex: 300,
  },
  dotsImage: {
    width: 20,
    height: 20,
    zIndex: 2,
  },
  headerButtonsContainer: {
    flexDirection: "row",
    borderRadius: 10,
    alignSelf: "flex-start",
    alignItems: "center",
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
  customBtn: {
    borderRadius: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    color: COLORS.white,
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    color: COLORS.white,
  },
  buttonText: {
    fontWeight: "bold",

  },
  searchContainer: {
    alignItems: "center",
    display: "flex",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchBar: {
    height: 45,
    width: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    marginBottom: 15,
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
  iconButton: {
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
    borderRadius: 10,
  },
  icon: {
    width: 16,
    height: 16,
  },
});

const tableHeader = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  nameCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 80,
    paddingRight: 100,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  tableBody: {
    paddingTop: 10,
    marginBottom: 50,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cell: {
    flex: 1,
    width: '100%',
    textAlign: "center",
  },
  actionCell: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  location: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    paddingLeft: 13,
  },
  nameLocationCell: {
    flex: 1,
    flexDirection: "column",
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
