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

const ProfileDetails = () => {
  const { id } = useLocalSearchParams();
  const customer = usersData.find((item) => item.id === id);
  const { dark } = useTheme();

  const [userDetails, setUserDetails] = useState<userDetailsProps[]>([
    { label: "Email Address", value: "", icon: icons.email, alignRight: false },
    { label: "Phone Number", value: "", icon: icons.call, alignRight: true },
    {
      label: "Password",
      value: "********",
      icon: icons.lock,
      alignRight: false,
    },
    { label: "Gender", value: "", icon: icons.userDefault, alignRight: true },
    {
      label: "Referral Code",
      value: "",
      icon: icons.bookmark,
      alignRight: false,
    },
    { label: "Country", value: "", icon: icons.calendar, alignRight: true },
  ]);

  useEffect(() => {
    if (customer) {
      setUserDetails((prevDetails) =>
        prevDetails.map((detail) => {
          let value = "N/A";
          switch (detail.label) {
            case "Email Address":
              value = customer.email || "N/A";
              break;
            case "Phone Number":
              value = customer.phoneNumber || "N/A";
              break;
            case "Gender":
              value = customer.gender || "N/A";
              break;
            case "Referral Code":
              value = customer.referralCode || "N/A";
              break;
            case "Country":
              value = customer.country || "N/A";
              break;
          }
          return { ...detail, value };
        })
      );
    }
  }, [customer]);

  const chunkedDetails = (details: userDetailsProps[]) => {
    let result: userDetailsProps[][] = [];
    for (let i = 0; i < details.length; i += 2) {
      result.push(details.slice(i, i + 2));
    }
    return result;
  };

  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
          User not found.
        </Text>
      </View>
    );
  }

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
                <Image source={item.icon} style={[styles.icon]} />
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
