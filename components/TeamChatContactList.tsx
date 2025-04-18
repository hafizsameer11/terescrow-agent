import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants';
import { Colors } from '@/constants/Colors';
import { Route, useRouter } from 'expo-router';
import { getImageUrl, timeFormatter } from '@/utils/helpers';
import { API_BASE_URL } from '@/utils/apiConfig';

const TeamChatContactList: React.FC<{
  pfp: string | null;
  name: string;
  date?: Date;
  recentMsg: string;
  isDarkMode: boolean;
  msgCount: number;
  id: string;
}> = (props) => {
  console.log("profile image", props.pfp)
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/userchat?id=${props.id}`)}
      style={styles.container}
    >
      {/* Profile Image */}
      <Image source={{
        uri:  getImageUrl(props?.pfp)
      }} style={styles.profileImage} />

      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Name and Date Row */}
        <View style={styles.nameDateRow}>
          <Text
            style={[
              styles.nameText,
              props.isDarkMode && { color: Colors.dark.text },
            ]}
          >
            {props.name}
          </Text>
          <Text style={styles.dateText}>
            {props.date && timeFormatter(props.date)}
          </Text>
        </View>

        {/* Recent Message and Unread Messages Row */}
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.recentMessage,
              props.isDarkMode && { color: COLORS.grayscale400 },
            ]}
          >
            {props.recentMsg}
          </Text>
          {props?.msgCount > 0 && (
            <View style={styles.unreadMsgContainer}>
              <Text style={styles.unreadMessage}>{props.msgCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
  },
  nameDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentMessage: {
    fontSize: 12,
    color: '#555',
    flex: 1,
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
});

export default TeamChatContactList;
