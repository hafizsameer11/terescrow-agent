import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants";
const RenderMsg: React.FC<{ text: string }> = (props) => {
  return (
    <View style={styles.userInfo}>
      <Text style={{ color: COLORS.greyscale600 }}>{props.text}</Text>
    </View>
  );
};

export default RenderMsg;

const styles = StyleSheet.create({
  userInfo: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale200,
  },
});
