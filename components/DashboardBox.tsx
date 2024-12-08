import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, icons } from "@/constants";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";

type BoxProps = {
  title?: string;
  value: string;
  percentage?: number;
  simpleText?: string;
  condition: boolean;
};

const Box: React.FC<BoxProps> = ({ title, value, percentage, condition, simpleText }) => {
  const { dark } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.gray }]}>{title}</Text>
        <View style={styles.percentageContainer}>
          {condition && <Image source={icons.arrowUpSquare} style={styles.icon} />}
          {percentage !== undefined ? (
            <Text style={styles.percentage}>
              {percentage > 0 ? `${percentage}%` : `${percentage}%`}
            </Text>
          ) : (
            simpleText && <Text style={styles.percentage}>{simpleText}</Text>  
          )}
        </View>
      </View>
      <Text style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 8,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
    borderColor: COLORS.primary,
    borderRadius: 18,
    padding: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  percentage: {
    fontSize: 12,
    color: COLORS.primary,
  },
  icon: {
    width: 15,
    height: 15,
    tintColor: COLORS.primary,
  },
});

export default Box;
