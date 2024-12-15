import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";
import { usersData } from "@/utils/usersData";
import { COLORS, icons } from "@/constants";
import { useLocalSearchParams } from "expo-router";

interface userDetailsProps {
  label: string;
  value: string;
  icon: string;
  alignRight: boolean;
}

interface ProfileDetailsProps {
  email?: string;
  phoneNumber?: string;
  gender?: string;
  country?: string;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  email,
  phoneNumber,
  gender,
  country,
}) => {
  const { dark } = useTheme();

  // Update details when props change
  const userDetails: userDetailsProps[] = [
    { label: "Email Address", value: email || "N/A", icon: icons.email, alignRight: false },
    { label: "Phone Number", value: phoneNumber || "N/A", icon: icons.call, alignRight: true },
    {
      label: "Password",
      value: "********",
      icon: icons.lock,
      alignRight: false,
    },
    { label: "Gender", value: gender || "N/A", icon: icons.userDefault, alignRight: true },
    {
      label: "Referral Code",
      value: "N/A", // Placeholder for referral code
      icon: icons.bookmark,
      alignRight: false,
    },
    { label: "Country", value: country || "N/A", icon: icons.calendar, alignRight: true },
  ];

  // Group details into rows
  const chunkedDetails = (details: userDetailsProps[]) => {
    let result: userDetailsProps[][] = [];
    for (let i = 0; i < details.length; i += 2) {
      result.push(details.slice(i, i + 2));
    }
    return result;
  };

  return (
    <ScrollView style={styles.container}>
      {chunkedDetails(userDetails).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, index) => (
            <View
              key={index}
              style={[
                styles.detailItem,
                { flexDirection: item.alignRight ? "row-reverse" : "row" },
              ]}
            >
              <View style={styles.iconContainer}>
                <Image source={item.icon} style={styles.icon} />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                      textAlign: item.alignRight ? "right" : "left",
                      paddingRight: item.alignRight ? 8 : 0,
                    },
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: dark ? COLORS.white : COLORS.black,
                      textAlign: item.alignRight ? "right" : "left",
                      paddingRight: item.alignRight ? 8 : 0,
                    },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    width: "50%",
    marginBottom: 15,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
    width: 30,
    height: 30,
    backgroundColor: COLORS.grayscale200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontSize: 13,
  },
});

export default ProfileDetails;
