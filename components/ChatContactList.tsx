import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/themeContext';
import { ChatStatus } from '@/utils/queries/agentQueries';
import { getImageUrl, timeFormatter } from '@/utils/helpers';

const ChatContactList: React.FC<{
  pfp: string | null;
  name: string;
  time: Date | null;
  msg: string | null;
  icon: string;
  status: ChatStatus;
  id: string;
  messageCount?: number;
  isdefault?: boolean;
  iswhiteBg?: boolean;
  isAdmin?: boolean; 
}> = (props) => {
  console.log(props.pfp);
  const router = useRouter();
  const { dark } = useTheme();
  console.log("prfoile", props.pfp);
  return (
    <Pressable
      onPress={() => router.push(`/transactionchat?id=${props.id} ${props.isdefault ? '&default="true"' : ''}`)}
      style={[styles.container, { backgroundColor: props.iswhiteBg ? COLORS.white : COLORS.grayscale100 }]}
    >
      {/* Profile Image */}
      <Image source={getImageUrl(props.pfp || '')} style={styles.profileImage} />

      <View style={styles.rightContainer}>
        <View style={styles.nameTimeRow}>
          <Text style={[styles.nameText, dark && { color: Colors.dark.text }]}>
            {props.name}
          </Text>
          <Text style={styles.time}>
            {props.time && timeFormatter(props.time)}
          </Text>
        </View>

        {/* Recent Message and Unread Messages Row */}
        <View style={styles.messageRow}>
          <View style={styles.iconMessage}>
            <Image source={props.icon} style={styles.galleryIcon} />
            <Text
              style={[styles.message, dark && { color: COLORS.grayscale400 }]}
            >
              {props.msg}
            </Text>
          </View>
          <Text
            style={[
              styles.circle,
              {
                backgroundColor:
                  props.status === "successful"
                    ? "green"
                    : props.status === "declined"
                      ? "red"
                      : props.status == "unsucessful"
                        ? "black" : "yellow", // Default to yellow for "pending"
                color: COLORS.white,
              },
            ]}
          >
            {/* {props.productId} */}
          </Text>
        </View>
        {/* <View
          style={[
            styles.status,
            props.status === ChatStatus.pending
              ? { backgroundColor: '#FDFFA3' }
              : props.status === ChatStatus.successful
                ? { backgroundColor: '#A3FFBC' }
                : { backgroundColor: '#FFA3A3' },
          ]}
        >
          <Text>{props.status}</Text>
        </View> */}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 7,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.grayscale100,
    padding: 10,
    borderRadius: 10,

  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  rightContainer: {
    flex: 1,
    // paddingBottom: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.grayscale400,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconMessage: {
    flexDirection: 'row',
  },
  galleryIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  message: {
    fontSize: 12,
    color: '#555',
  },
  unreadMsgContainer: {
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
  unreadMessage: {
    fontSize: 10,
    color: COLORS.white,
  },
  status: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginTop: 0,
    paddingHorizontal: 8,
    // bo r d e  []
    borderRadius: 5,
  },
  circle: {
    width: 10,
    height: 10,
    marginLeft: 5,
    textAlign: "center",
    borderRadius: 999,
    justifyContent: "center",
    fontSize: 10,

  },
});

export default ChatContactList;
