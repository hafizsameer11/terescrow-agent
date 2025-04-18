import { COLORS } from "@/constants";
import { Colors } from "@/constants/Colors";
import { Pressable, View, Text, StyleSheet } from "react-native";

const categories = [
  { id: 1, category: "All" },
  { id: 2, category: "Group" },
  { id: 3, category: "Unread" },
];

const getPressableStyles = (
  category: string,
  selectedCategory: string,
  isDarkMode: boolean
) => {
  const isSelected = selectedCategory === category;

  if (isDarkMode) {
    return isSelected
      ? {
        backgroundColor: COLORS.primary,
      }
      : {
        backgroundColor: COLORS.dark3,
      };
  }

  return isSelected
    ? { backgroundColor: COLORS.primary }
    : { backgroundColor: COLORS.greyscale500 };
};

const TeamChatCategorys: React.FC<{
  onSelectHandler: (selected: string) => void;
  selectedCategory: string;
  isDarkMode: boolean;
}> = ({ onSelectHandler, selectedCategory, isDarkMode }) => {
  return (
    <View style={styles.chatCategoryContainer}>
      {categories.map(({ category, id }) => (
        <Pressable
          key={id}
          onPress={() => onSelectHandler(category)}
          style={[
            styles.chatCategoryTextContainer,
            getPressableStyles(category, selectedCategory, isDarkMode),
          ]}
        >
          <Text
            style={[
              styles.chatCategoryText,
              selectedCategory === category && { color: COLORS.white },
              isDarkMode && { color: Colors.dark.text },
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chatCategoryContainer: {
    flexDirection: "row",
  },
  chatCategoryTextContainer: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 50,
  },
  chatCategoryText: {
    fontSize: 14,
  },
});

export default TeamChatCategorys;
