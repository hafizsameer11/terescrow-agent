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
  const statuses = ["successfull", "failed", "pending"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const dummyData = Array(15)
  .fill(3)
  .map(() => ({
    name: "Razer Gold",
    status: getRandomStatus(),
    subTitle: "Adam",
    date: "Nov 7, 2024",
    role: "manager",
  }));

export default function Department() {
  const [query, setQuery] = useState("");
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState("active");
  const [filteredData, setFilteredData] = useState(dummyData);
  const [selectedOption, setSelectedOption] = useState("Role");
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };

  const handlePress = (btn: string) => {
    setActiveBtn(btn);
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
      if (status === "successfull") return COLORS.primary;
      if (status === "pending") return COLORS.warning;
      if (status === "failed") return COLORS.red;
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
          <Text
            style={{
              width: 15,
              height: 15,
              marginLeft: 8,
              borderRadius: 50,
              backgroundColor: getStatusBgColor(item.status),
            }}
          ></Text>
        </View>
        <Text style={[tableHeader.cell, textColor]}>{item.date}</Text>
        <Text style={[tableHeader.cell, textColor]}>{item.role}</Text>
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
            <Image source={icons.eye2} style={styles.icon} />
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
            Teams
          </Text>
          <Button
            title="Add new Team"
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
          </View>
        </View>
        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1, marginBottom: 20 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress("active")}
            style={[
              styles.button,
              activeBtn === "active" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "active"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("deleted")}
            style={[
              styles.button,
              activeBtn === "deleted" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "deleted"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Deleted
            </Text>
          </TouchableOpacity>
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
            <Text style={[tableHeader.headerCell, textColor]}>Date Added</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Role</Text>
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
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  searchContainer: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    width: "70%",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchBar: {
    height: 40,
    width: "70%",
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
