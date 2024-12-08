import { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "@/contexts/themeContext";

const dummyNotifications = Array(7).fill({
  id: 1,
  person: "Agent Sarah",
  description: "sent you a chat...",
  time: "Nov 7, 2024 - 10:22 am",
});

const Notifications = () => {
  const { dark } = useTheme();
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const [activeBtn, setActiveBtn] = useState("notification");
  const [activeNotification, setActiveNotification] =
    useState("teamNotification");

  const handlePressNotification = (btn: string) => {
    setActiveBtn(btn);
  };

  const handlePressContent = (btn: string) => {
    setActiveNotification(btn);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Text style={[styles.subHeader, textColor]}>Notifications</Text>
          <View
            style={[
              styles.headerButtonsContainer,
              { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1 },
            ]}
          >
            <TouchableOpacity
              onPress={() => handlePressNotification("notification")}
              style={[
                styles.button,
                activeBtn === "notification" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      activeBtn === "notification"
                        ? COLORS.white
                        : dark
                        ? COLORS.white
                        : COLORS.black,
                  },
                ]}
              >
                Notification
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePressNotification("inAppNotification")}
              style={[
                styles.button,
                activeBtn === "inAppNotification" && styles.activeButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      activeBtn === "inAppNotification"
                        ? COLORS.white
                        : dark
                        ? COLORS.white
                        : COLORS.black,
                  },
                ]}
              >
                In-App Notification
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : "#ccc", borderWidth: 1, marginBottom: 20 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePressContent("teamNotification")}
            style={[
              styles.button,
              activeNotification === "teamNotification" && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                  activeNotification === "teamNotification"
                  ? COLORS.white
                  : dark
                  ? COLORS.white
                  : COLORS.black,
                }
              ]}
            >
              Team Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePressContent("customerNotification")}
            style={[
              styles.button,
              activeNotification === "customerNotification" &&
                styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeNotification === "customerNotification"
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Customer Notification
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView
            contentContainerStyle={styles.itemsScrollCont}
            style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white }}
          >
            {activeNotification === "teamNotification" && (
              <>
                <Text style={[styles.subHeader, { paddingBottom: 10 }, textColor]}>
                  Team Notification
                </Text>
                {dummyNotifications.map((notification, index) => (
                  <View key={index}>
                    <Text style={[styles.person, textColor]}>
                      {notification.person}
                      <Text style={styles.description}>
                        {"  "}
                        {notification.description}
                        <TouchableOpacity>
                          <Text style={styles.viewChat}>View Chat</Text>
                        </TouchableOpacity>
                      </Text>
                    </Text>
                    <Text style={[styles.time]}>{notification.time}</Text>
                  </View>
                ))}
              </>
            )}
            {activeNotification === "customerNotification" && (
              <>
                <Text style={[styles.subHeader, { paddingBottom: 10 }, textColor]}>
                  Customer Notification
                </Text>
                {dummyNotifications.map((notification, index) => (
                  <View key={index}>
                    <Text style={[styles.person, textColor]}>
                      {notification.person}
                      <Text style={styles.description}>
                        {"  "}
                        {notification.description}
                        <TouchableOpacity>
                          <Text style={styles.viewChat}>View Chat</Text>
                        </TouchableOpacity>
                      </Text>
                    </Text>
                    <Text style={[styles.time]}>{notification.time}</Text>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 13,
  },
  itemsScrollCont: {
    padding: 20,
  },
  viewChat: {
    color: COLORS.primary,
    fontSize: 12,
  },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  description: {
    fontWeight: "400",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    gap: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  headerButtonsContainer: {
    flexDirection: "row",
    borderRadius: 10,
    alignSelf: "flex-start",
    alignItems: "center",
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
    fontSize: 11,
    fontWeight: "bold",
  },

  person: {
    fontWeight: "bold",
    marginVertical: 7,
  },
  time: {
    fontSize: 12,
    color: COLORS.gray,
  }
});
