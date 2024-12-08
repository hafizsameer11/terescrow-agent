import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Colors } from "@/constants/Colors";
const TeamChatHeader: React.FC<{
  isDarkMode: boolean;
  setModalVisible: (modalState: boolean) => void;
}> = ({ isDarkMode, setModalVisible }) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text
        style={[
          styles.mainHeading,
          isDarkMode
            ? { color: Colors.dark.text }
            : { color: Colors.light.text },
        ]}
      >
        Chats
      </Text>
      <View style={styles.iconsContainer}>
        <Pressable
          style={[
            styles.iconContainer,
            { marginRight: 14 },
            isDarkMode && { backgroundColor: COLORS.primary },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={icons.friends}
            style={[
              styles.icons,
              isDarkMode && { tintColor: Colors.dark.tint },
            ]}
          />
        </Pressable>
        <Pressable
          style={[
            styles.iconContainer,
            isDarkMode && { backgroundColor: COLORS.primary },
          ]}
          onPress={() => router.push('/editteamchat')}
        >
          <Image
            source={icons.edit}
            style={[
              styles.icons,
              isDarkMode && { tintColor: Colors.dark.tint },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 29,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale400,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale200,
  },
  icons: {
    width: 16,
    height: 16,
  },
});

export default TeamChatHeader;
