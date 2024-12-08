import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, icons } from "@/constants";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/themeContext";
import Box from "@/components/DashboardBox";
import RecentChats from "@/components/RecentChats";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "@/components/Button";
import FilterModal from "@/components/FilterModal";

const Rates = () => {
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState("giftCardsRate");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePressModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePress = (btn: string) => {
    setActiveBtn(btn);
  };
  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Rates
          </Text>
          <View style={[styles.headerButtonsContainer, { gap: 10 }]}>
            <Button
              title="Add Custom Rate"
              style={[styles.customBtn, { height: 45 }]}
              fontSize={13}
              textColor={COLORS.primary}
            />
            <View
              style={[
                styles.filterIconContainer,
                {
                  borderColor: dark ? COLORS.dark3 : COLORS.gray,
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              <TouchableOpacity onPress={handlePressModal}>
                <Image
                  source={icons.filter}
                  style={[
                    styles.filterIcon,
                    { tintColor: dark ? COLORS.white : COLORS.black },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress("giftCardsRate")}
            style={[
              styles.button,
              activeBtn === "giftCardsRate" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "giftCardsRate"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Gift Card Rate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("cryptoRate")}
            style={[
              styles.button,
              activeBtn === "cryptoRate" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === "cryptoRate"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Crypto Rate
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingVertical: 10 }}>
          <Text style={[styles.subHeader, { color: dark ? COLORS.white : COLORS.black }]}>Buying</Text>
          <View style={[styles.row, { width: "50%" }]}>
            <Box
              title="Total Income"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
          </View>

          <Text style={[styles.subHeader, { color: dark ? COLORS.white : COLORS.black }]}>Selling Rates</Text>
          <View style={styles.row}>
            <Box value="$1,000" simpleText="Edit" condition={false} />
            <Box
              title="Total Income"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
          </View>
          <View style={{ width: "50%", marginBottom: 10 }}>
            <Box
              title="Total Income"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
          </View>
            <Text style={[styles.subHeader, { color: dark ? COLORS.white : COLORS.black }]}>Sending fee</Text>
          <View style={styles.row}>
            <Box
              title="Total Income"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />
            <Box
              title="Total Income"
              value="$1,000"
              simpleText="Edit"
              condition={false}
            />

          </View>
        </View>
        <FilterModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Rates;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 13,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerButtonsContainer: {
    flexDirection: "row",
    borderRadius: 10,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    marginVertical: 15,
  },
  customBtn: {
    borderRadius: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    left: 10,
    top: 5,
    paddingRight: 10,
  },
  filterIconContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});
