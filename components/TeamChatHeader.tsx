import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/authContext';
import { useTheme } from '@/contexts/themeContext';
import { UserRoles } from '@/contexts/socketContext';
const TeamChatHeader: React.FC<{
  setModalVisible: (modalState: boolean) => void;
}> = ({ setModalVisible }) => {
  const { userData } = useAuth();
  const { dark } = useTheme();
  // console.log(userData);
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Text
        style={[
          styles.mainHeading,
          dark ? { color: Colors.dark.text } : { color: Colors.light.text },
        ]}
      >
        Chats
      </Text>
      <View style={styles.iconsContainer}>
        {userData?.role == UserRoles.admin && (
          <Pressable
            style={[
              styles.iconContainer,
              { marginRight: 14 },
              dark && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={icons.friends}
              style={[styles.icons, dark && { tintColor: Colors.dark.tint }]}
            />
          </Pressable>
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 29,
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderColor: COLORS.grayscale400,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale200,
  },
  icons: {
    width: 16,
    height: 16,
  },
});

export default TeamChatHeader;
