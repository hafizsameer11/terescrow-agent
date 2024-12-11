import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants";

const SelectField: React.FC<{
  text: string;
  label: string;
  icon: string;
  onClickHandler: () => void;
  isClickable: boolean;
}> = (props) => {
  return (
    <TouchableOpacity
      onPress={props.isClickable ? props.onClickHandler : undefined}
      activeOpacity={0.6}
      style={styles.container}
    >
      <View>
        <Text style={styles.label}>{props.label}</Text>
        <Text style={{ fontSize: 15 }}>{props.text}</Text>
      </View>
      <Image source={props.icon} style={{ width: 20, height: 20 }} />
    </TouchableOpacity>
  );
};

export default SelectField;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    marginBottom: 5,
    color: COLORS.greyscale600,
  },
});
