import React from "react";
import { COLORS } from "@/constants";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";

const filterCategory = [
  { id: 1, name: "All" },
  { id: 2, name: "Pending" },
  { id: 3, name: "Unanswered" },
  { id: 4, name: "Completed" },
  { id: 5, name: "Declined" },
];

const TransFilter: React.FC<{
  isDarkMode: boolean;
  onSelect: (categoryName: string) => void;
}> = (props) => {
  return (
    <View style={styles.container}>
      {filterCategory.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => props.onSelect(item.name)}
          style={[
            styles.pressable,
            props.isDarkMode && { backgroundColor: COLORS.dark2 },
          ]}
        >
          <Text
            style={[
              styles.text,
              props.isDarkMode
                ? { color: COLORS.grayscale400 }
                : { color: COLORS.black },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    padding: 10,
  },
  pressable: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.grayscale200,
  },
  text: {
    fontSize: 16,
  },
});

export default TransFilter;
