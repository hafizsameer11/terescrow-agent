import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants';
const RenderMsgUserDecision: React.FC<{
  text: string;
  icon: string;
  bgColor: string;
  isProcess: boolean;
  textColor?: string;
  subText?: string;
  OnCancel: () => void;
}> = (props) => {
  return (
    <View style={styles.processContainer}>
      <View
        style={[
          styles.processing,
          {
            backgroundColor: props.bgColor,
            borderRadius: 10,
            alignItems: 'center',
          },
          props.isProcess && { justifyContent: 'center' },
          props.bgColor === '#FEFFD7' && { borderColor: COLORS.warning },
          props.bgColor === '#EBFFF3' && { borderColor: COLORS.green },
          props.bgColor === '#FFD7D7' && { borderColor: COLORS.red },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            props.isProcess && {
              backgroundColor: 'transparent',
              marginRight: 5,
            },
          ]}
        >
          <Image
            source={props.icon}
            style={[
              styles.icon,
              props.isProcess && { tintColor: 'none', width: 10, height: 12 },
            ]}
          />
        </View>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ color: props.textColor }}>{props.text}</Text>
          <Text style={{ color: props.textColor }}>{props.subText}</Text>
        </View>

        <View style={{ height: 10 }}></View>

        <View>
        </View>

        {props.isProcess && (
          <Pressable onPress={props.OnCancel} style={{ marginLeft: 10 }}>
            <Text>CANCEL</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default RenderMsgUserDecision;

const styles = StyleSheet.create({
  processContainer: {
    width: '100%',
    position: 'relative',
    bottom: 10,
    zIndex: 1,
  },
  processing: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: '2%',
  },
  iconContainer: {
    backgroundColor: COLORS.black,
    marginRight: 12,
    padding: 5,
    borderRadius: 10,
  },
  icon: {
    width: 8,
    height: 8,
    tintColor: COLORS.white,
  },
});
