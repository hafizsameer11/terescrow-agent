import { View, TextInput, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Colors } from "@/constants/Colors";
const TeamChatSearch: React.FC<{
  isDarkMode: boolean;
  onSearchChange: (searchTerm: string) => void;
}> = ({ isDarkMode, onSearchChange }) => {
  return (
    <View
      style={[
        styles.searchBarContainer,
        isDarkMode
          ? { backgroundColor: Colors.dark.background }
          : { backgroundColor: COLORS.greyscale500 },
      ]}
    >
      <Image
        source={icons.search}
        style={[
          styles.searchIcon,
          isDarkMode && { tintColor: Colors.dark.tint },
        ]}
      />
      <TextInput
        style={[styles.searchInput, isDarkMode && { color: Colors.dark.text }]}
        placeholder="Search Chat"
        placeholderTextColor="#9E9E9E"
        onChangeText={onSearchChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale400,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginLeft: 35,
    position: "absolute",
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 63,
    color: COLORS.black,
    backgroundColor: "transparent",
  },
});

export default TeamChatSearch;
