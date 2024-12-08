import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { useTheme } from "@/contexts/themeContext";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { DUMMY_CHAT } from "../../utils/dummyChat";
import { useState } from "react";
import ChatContactList from "@/components/ChatContactList";
const chat = () => {
  const { dark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const filterDataHandler = (selectedItem: string) => {
    let filteredData = DUMMY_CHAT;
    // Filter by category
    // if (selectedItem === "Group") {
    //   filteredData = filteredData.filter((item) => item.group);
    // } else if (selectedItem === "Unread") {
    //   filteredData = filteredData.filter((item) => !item.seen);
    // }

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredData;
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm); // Update the search term state
  };
  return (
    <View style={[styles.container, dark && { backgroundColor: COLORS.black }]}>
      <View style={styles.header}>
        <Text style={[styles.mainHeading, dark && { color: COLORS.white }]}>
          Gifcard transactions
        </Text>
        <Text style={styles.textDetail}>
          Manage total customers and see their activities
        </Text>
      </View>
      <View style={styles.filterInput}>
        <View style={styles.filter}>
          <Text style={styles.filterHeading}>Filter by:</Text>
          <View style={styles.filterCategory}>
            <Text style={[styles.allText, dark && { color: COLORS.white }]}>
              All
            </Text>
            <Image
              source={icons.arrowDown}
              style={[styles.arrowDown, dark && { tintColor: COLORS.white }]}
            />
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Image source={icons.search} style={styles.searchIcon} />
          <TextInput
            placeholder="Search customer name"
            placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.black}
            style={[styles.searchInput, dark && { color: COLORS.white }]}
            onChangeText={handleSearchChange}
          />
        </View>
      </View>
      <FlatList
        data={filterDataHandler(selectedCategory)}
        style={styles.chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatContactList
            id={item.id.toString()}
            pfp={item.pfp}
            name={item.name}
            icon={item.icon}
            time={item.timestamp}
            msg={item.message}
            status={item.status}
            isDarkMode={dark}
          />
        )}
      />
    </View>
  );
};

export default chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: "500",
  },
  textDetail: {
    fontSize: 14,
    color: COLORS.greyscale600,
  },
  filterInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filter: {
    flex: 0.7,
    flexDirection: "row",
  },
  filterHeading: {
    fontSize: 14,
    color: COLORS.greyscale600,
  },
  filterCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  allText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  arrowDown: {
    width: 12,
    height: 12,
    marginLeft: 5,
  },
  searchContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
    width: 13,
    height: 13,
    left: 16,
    tintColor: COLORS.greyscale600,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingRight: 16,
    paddingLeft: 37,
    color: COLORS.black,
    borderColor: COLORS.grayscale400,
  },
  chatList: {
    marginTop: 20,
  },
});
