import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "@/constants";

const ServiceTypeOption: React.FC<{
  text: string;
  onClickHandler: (option: string) => void;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.onClickHandler(props.text)}
      activeOpacity={0.6}
      style={styles.container}
    >
      <View>
        <Text style={{ fontSize: 15 }}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceTypeOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale400,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    marginBottom: 5,
    color: COLORS.greyscale600,
  },
});
