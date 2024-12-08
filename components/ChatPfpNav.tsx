import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/themeContext";
import { Colors } from "@/constants/Colors";

const ChatPfpNav: React.FC<{ image: string; name: string; status: string }> = (
  props
) => {
  const { dark } = useTheme();
  const router = useRouter();

  const backPressHandler = () => {
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        dark
          ? { backgroundColor: COLORS.black }
          : { backgroundColor: COLORS.white },
      ]}
    >
      <View style={styles.mainContentContainer}>
        <View>
          <Image source={props.image} style={{ width: 58, height: 58 }} />
        </View>
        <View style={styles.mainTextContainer}>
          <Text
            style={[
              styles.mainHeading,
              dark ? { color: Colors.dark.text } : { color: Colors.light.text },
            ]}
          >
            {props.name}
          </Text>

          <Text
            style={[
              styles.agentStatus,
              props.status === "Offline" && { color: COLORS.red },
            ]}
          >
            {props.status}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={backPressHandler}
        style={styles.closeIconContainer}
        accessible={true}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <View style={styles.closeIcon}>
          <Image
            source={icons.close2}
            style={[
              styles.backIcon,
              dark ? { tintColor: COLORS.black } : { tintColor: COLORS.white },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default ChatPfpNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  closeIconContainer: {
    borderRadius: 50,
    backgroundColor: COLORS.grayscale400,
  },
  closeIcon: {
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  mainContentContainer: {
    flexDirection: "row",
  },
  mainTextContainer: {
    marginLeft: 12,
    paddingVertical: 5,
    flexDirection: "column",
    justifyContent: 'space-between',
  },
  mainHeading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  agentStatus: {
    fontSize: 12,
    color: COLORS.green,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
});
