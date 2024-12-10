import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/themeContext";
import { Colors } from "@/constants/Colors";

const TransChatNav: React.FC<{
  image: string;
  name: string;
  userName: string;
  currentState: boolean;
  isCurrentlyConfirmed: boolean;
  isDeclined: boolean;
  onProcess: () => void;
  onAccept: () => void;
  onDecline: () => void;
  showNotes: () => void;
}> = (props) => {
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
        <View style={{ justifyContent: "center", marginRight: 10 }}>
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
                  dark
                    ? { tintColor: COLORS.black }
                    : { tintColor: COLORS.white },
                ]}
              />
            </View>
          </Pressable>
        </View>
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
          <Text style={[styles.agentUserName]}>{props.userName}</Text>
        </View>
        <View style={styles.iconsContainer}>
          {props.currentState && (
            <>
              <View style={styles.iconContainer}>
                <Pressable
                  style={styles.pressIcon}
                  onPress={!props.isCurrentlyConfirmed ? props.onDecline : null}
                >
                  <Image source={icons.close2} style={styles.iconStyle} />
                </Pressable>
              </View>
              <View style={styles.iconContainer}>
                <Pressable
                  style={styles.pressIcon}
                  onPress={!props.isCurrentlyConfirmed ? props.onProcess : null}
                >
                  <Image source={icons.hourGlass} style={styles.iconStyle} />
                </Pressable>
              </View>
              <View style={styles.iconContainer}>
                <Pressable
                  style={styles.pressIcon}
                  onPress={props.showNotes}
                >
                  <Image source={icons.notification2} style={styles.iconStyle} />
                </Pressable>
              </View>
            </>
          )}
          <View style={styles.iconContainer}>
            <Pressable style={styles.pressIcon} onPress={props.isDeclined ? null : props.onAccept}>
              <Image source={icons.check2} style={styles.iconStyle} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransChatNav;

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
    backgroundColor: COLORS.greyscale600,
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
    justifyContent: "space-between",
  },
  mainHeading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  agentUserName: {
    fontSize: 14,
    color: COLORS.greyscale600,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconContainer: {
    justifyContent: "center",
    marginLeft: 16,
  },
  iconStyle: {
    width: 12,
    height: 12,
  },
  pressIcon: {
    padding: 6,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale200,
  },
});
