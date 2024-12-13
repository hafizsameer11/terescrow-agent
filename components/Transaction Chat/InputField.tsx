import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants';

interface PropTypes extends React.ComponentProps<typeof TextInput> {
  label: string;
}

const InputField: React.FC<PropTypes> = (props) => {
  return (
    <View style={styles.container}>
      {/* <View> */}
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={{
          //   fontSize: 15,
          color: COLORS.greyscale900,
          //   lineHeight: 15,
          width: '100%',
          height: 40,
        }}
        keyboardType="numeric"
      />
      {/* </View> */}
      {/* <Image source={props.icon} style={{ width: 20, height: 20 }} /> */}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    paddingHorizontal: 6,
    textAlign: 'left',
    // marginBottom: 5,
    color: COLORS.greyscale600,
  },
});
