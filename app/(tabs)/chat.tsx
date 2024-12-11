import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { useTheme } from "@/contexts/themeContext";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { DUMMY_CHAT } from "../../utils/dummyChat";
import { useState } from "react";
import ChatContactList from "@/components/ChatContactList";
import TransFilter from "@/components/TransFilter";
const chat = () => {
  const { dark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropDownVisibility, setDropDownVisibility] = useState(false);
  const filterDataHandler = () => {
    let filteredData = DUMMY_CHAT;
    // Filter by category
    if (selectedCategory === "Pending") {
      filteredData = filteredData.filter((item) => item.status === "PENDING");
    } else if (selectedCategory === "Unanswered") {
      filteredData = filteredData.filter(
        (item) => item.status === "UNANSWERED"
      );
    } else if (selectedCategory === "Completed") {
      filteredData = filteredData.filter((item) => item.status === "COMPLETED");
    } else if (selectedCategory === "Declined") {
      filteredData = filteredData.filter((item) => item.status === "DECLINED");
    }
    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredData;
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };
  const selectedCategoryHandler = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setDropDownVisibility(false);
  };

  const toggleDropDownVisibility = () => {
    setDropDownVisibility(!dropDownVisibility);
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
          <Pressable
            style={styles.filterCategory}
            onPress={toggleDropDownVisibility}
          >
            <Text style={[styles.allText, dark && { color: COLORS.white }]}>
              {selectedCategory}
            </Text>
            <Image
              source={icons.arrowDown}
              style={[styles.arrowDown, dark && { tintColor: COLORS.white }]}
            />
          </Pressable>
          {dropDownVisibility && (
            <View
              style={[
                styles.dropDown,
                dark && { backgroundColor: COLORS.dark3 },
              ]}
            >
              <TransFilter
                isDarkMode={dark}
                onSelect={selectedCategoryHandler}
              />
            </View>
          )}
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
        data={filterDataHandler()}
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
    backgroundColor: COLORS.white,
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
    alignItems: "center",
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
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 5,
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
  dropDown: {
    position: "absolute",
    top: 32,
    padding: 10,
    zIndex: 1,
    elevation: 5,
    borderRadius: 5,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowColor: COLORS.greyscale900,
    backgroundColor: COLORS.white,
    shadowOffset: { width: 0, height: 2 },
  },
});
