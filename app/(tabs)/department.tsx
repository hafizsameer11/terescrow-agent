import React, { useState } from "react";
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

const getRandomStatus = () => {
  const statuses = ["active", "offline"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const dummyData = Array(15)
  .fill(3)
  .map(() => ({
    name: "Razer Gold",
    type: "E-Code",
    status: getRandomStatus(),
    noOfAgents: 3,
    description: "Buying of cryptocurrency",
  }));

export default function Department() {
  const [query, setQuery] = useState("");
  const { dark } = useTheme();
  const [filteredData, setFilteredData] = useState(dummyData);
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const handleSearch = (text: string) => {
    setQuery(text);
    if (query === "") {
      setFilteredData(dummyData);
    } else {
      const filterData = dummyData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filterData);
    }
  };

  const renderRow = (item: (typeof dummyData)[0], index: number) => {
    const getStatusBgColor = (status: string) => {
      if (status === "active") return COLORS.primary;
      if (status === "offline") return COLORS.warning;
      return COLORS.transparentWhite;
    };
    return (
      <View style={tableHeader.row} key={index}>
        <View style={[tableHeader.cell, tableHeader.nameCell]}>
          <Image
            source={icons.bitCoin}
            style={{
              width: 20,
              height: 20,
              tintColor: dark ? COLORS.white : COLORS.black,
            }}
          />
          <Text style={[{ marginLeft: 8 }, textColor]}>{item.name}</Text>
        </View>
        <Text
          style={[
            tableHeader.cell,
            {
              backgroundColor: getStatusBgColor(item.status),
              borderRadius: 5,
              color: COLORS.white,
              padding: 5,
            },
          ]}
        >
          {item.status}
        </Text>
        <Text style={[tableHeader.cell, textColor]}>{item.noOfAgents}</Text>
        <Text style={[tableHeader.cell, textColor]}>{item.description}</Text>
        <View style={[tableHeader.actionCell, tableHeader.nameCell]}>
          <Button
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
          />
          <TouchableOpacity style={styles.iconButton}>
            <Image source={icons.eye2} style={[styles.icon]} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Image source={icons.edit} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={icons.trash}
              style={[
                styles.icon,
                { tintColor: COLORS.red, width: 25, height: 25 },
              ]}
            />
          </TouchableOpacity>
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
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Department
          </Text>
          <Button
            title="Add new department"
            style={{ borderRadius: 10, height: 40 }}
            fontSize={12}
          />
        </View>
        <View style={{ padding: 10 }}>
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
            placeholder="Search"
            placeholderTextColor={dark ? COLORS.white : COLORS.black}
            value={query}
            onChangeText={handleSearch}
          />
        </View>
      </ScrollView>
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
            <Text style={[tableHeader.headerCell, textColor]}>Name</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Status</Text>
            <Text style={[tableHeader.headerCell, textColor]}>
              No of Agents
            </Text>
            <Text style={[tableHeader.headerCell, textColor]}>Description</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Action</Text>
          </View>
          <ScrollView style={tableHeader.tableBody}>
            {filteredData.map((item, index) => renderRow(item, index))}
          </ScrollView>
        </View>
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
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 10,
  },
  searchContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchBar: {
    height: 40,
    width: "80%",
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
    gap: 10,
    paddingRight: 100,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
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
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: "center",
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
    paddingLeft: 13,
  },
  nameLocationCell: {
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
