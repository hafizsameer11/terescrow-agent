import { Text, View, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const ChatContactList: React.FC<{
  pfp: string;
  name: string;
  time: string;
  msg: string;
  icon: string;
  status: string;
  isDarkMode: boolean;
  id: string;
}> = (props) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/transactionchat?id=${props.id}`)}
      style={styles.container}
    >
      {/* Profile Image */}
      <Image source={props.pfp} style={styles.profileImage} />

      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Name and Date Row */}
        <View style={styles.nameTimeRow}>
          <Text
            style={[
              styles.nameText,
              props.isDarkMode && { color: Colors.dark.text },
            ]}
          >
            {props.name}
          </Text>
          <Text style={styles.time}>{props.time}</Text>
        </View>

        {/* Recent Message and Unread Messages Row */}
        <View style={styles.messageRow}>
          <View style={styles.iconMessage}>
            <Image source={props.icon} style={styles.galleryIcon} />
            <Text
              style={[
                styles.message,
                props.isDarkMode && { color: COLORS.grayscale400 },
              ]}
            >
              {props.msg}
            </Text>
          </View>
          <View style={styles.unreadMsgContainer}>
            <Text style={styles.unreadMessage}>3</Text>
          </View>
        </View>
        <View
          style={[
            styles.status,
            props.status === "PENDING" || props.status === "UNANSWERED"
              ? { backgroundColor: "#FDFFA3" }
              : props.status === "COMPLETED"
              ? { backgroundColor: "#A3FFBC" }
              : { backgroundColor: "#FFA3A3" },
          ]}
        >
          <Text>{props.status}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 23,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale400,
  },
  nameTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconMessage: {
    flexDirection: "row",
  },
  galleryIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  message: {
    fontSize: 12,
    color: "#555",
  },
  unreadMsgContainer: {
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
  unreadMessage: {
    fontSize: 10,
    color: COLORS.white,
  },
  status: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    marginTop: 6,
    paddingHorizontal: 8,
  },
});

export default ChatContactList;
