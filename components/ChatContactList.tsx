import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/themeContext';
import { ChatStatus } from '@/utils/queries/agentQueries';
import { timeFormatter } from '@/utils/helpers';

const ChatContactList: React.FC<{
  pfp: string | null;
  name: string;
  time: Date | null;
  msg: string | null;
  icon: string;
  status: ChatStatus;
  id: string;
  messageCount?: number;
}> = (props) => {
  const router = useRouter();
  const { dark } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(`/transactionchat?id=${props.id}`)}
      style={styles.container}
    >
      {/* Profile Image */}
      <Image source={props.pfp || icons.profile} style={styles.profileImage} />

      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Name and Date Row */}
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
          <View style={styles.unreadMsgContainer}>
            <Text style={styles.unreadMessage}>{props.messageCount}</Text>
          </View>
        </View>
        <View
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
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 23,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginTop: 10,
  },
  rightContainer: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayscale400,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  nameText: {
    fontSize: 16,
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
    marginTop: 6,
    paddingHorizontal: 8,
  },
});

export default ChatContactList;
