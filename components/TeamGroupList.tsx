import { COLORS } from "@/constants";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

const TeamGroupList: React.FC<{
  pfp: string;
  name: string;
  username: string;
  userId: string;
  online: boolean;
  isDarkMode: boolean;
  getCheckedId: (userId: string, isChecked: boolean) => void;
}> = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const checkDataHandler = () => {
    setIsChecked(!isChecked);
    props.getCheckedId(props.userId, !isChecked);
  };
  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image source={props.pfp} style={styles.profileImage} />
      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Name and Date Row */}
        <View style={{ flex: 1 }}>
          <View style={styles.nameStatusRow}>
            <Text
              style={[
                styles.nameText,
                props.isDarkMode && { color: Colors.dark.text },
              ]}
            >
              {props.name}
            </Text>
            <View
              style={[
                styles.onlineStatus,
                props.online
                  ? { backgroundColor: COLORS.green }
                  : { backgroundColor: COLORS.red },
              ]}
            ></View>
          </View>

          {/* Recent Message and Unread Messages Row */}
          <Text style={styles.userName}>{props.username}</Text>
        </View>
        <Checkbox
          status={isChecked ? "checked" : "unchecked"}
          onPress={checkDataHandler}
          color="#4CAF50"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.grayscale400,
  },
  profileImage: {
    width: 57,
    height: 57,
    borderRadius: 25,
    marginRight: 20,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  onlineStatus: {
    width: 15,
    height: 15,
    borderRadius: 50,
    marginLeft: 10,
  },
  userName: {
    fontSize: 10,
    color: COLORS.grayscale400,
  },
});

export default TeamGroupList;
