import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons, images } from '@/constants';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/themeContext';
import { Colors } from '@/constants/Colors';
import { ITeamChatDetailsResponse } from '@/utils/queries/commonQueries';
import { ChatType } from '@/utils/queries/agentQueries';
import { useSocket } from '@/contexts/socketContext';

const ChatPfpNav: React.FC<{
  chatDetails: ITeamChatDetailsResponse['data'] | undefined;
}> = ({ chatDetails }) => {
  const { dark } = useTheme();
  const { onlineAgents, isAdminOnline } = useSocket();
  const router = useRouter();
  let profilePicture: string = '';
  let profileName: string = '';
  let receiverStatus = '';

  // console.log(onlineAgents);
  if (chatDetails) {
    const { chatGroup, chatType, participants } = chatDetails;

    if (chatType == ChatType.group_chat) {
      profileName = chatGroup?.groupName!;
      profilePicture = chatGroup?.groupProfile!;
    } else {
      const receiver = participants?.[0]?.user;
      profileName = receiver?.firstname + ' ' + receiver?.lastname;
      profilePicture = receiver?.profilePicture!;
      console.log('receiverId: ', receiver);
      // console.log(onlineAgents);
      console.log(isAdminOnline);
      onlineAgents.forEach((agent) => {
        if (+agent.userId == +receiver?.id) {
          receiverStatus = 'Online';
        }
      });
      if (
        (!receiverStatus || receiverStatus == 'Offline') &&
        isAdminOnline &&
        +participants[0]?.user.id == +isAdminOnline.userId
      ) {
        receiverStatus = 'Online';
      } else {
        if (!receiverStatus) {
          receiverStatus = 'Offline';
        }
      }
    }
  }

  console.log(receiverStatus);
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
        <View>
          <Image
            source={profilePicture || images.avatar}
            style={{ width: 58, height: 58 }}
          />
        </View>
        <View style={styles.mainTextContainer}>
          <Text
            style={[
              styles.mainHeading,
              dark ? { color: Colors.dark.text } : { color: Colors.light.text },
            ]}
          >
            {profileName || 'Unknown'}
          </Text>

          {chatDetails?.chatType == ChatType.team_chat && receiverStatus && (
            <Text
              style={[
                styles.agentStatus,
                receiverStatus === 'Offline' && { color: COLORS.red },
              ]}
            >
              {receiverStatus}
            </Text>
          )}
        </View>
      </View>

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
              dark ? { tintColor: COLORS.black } : { tintColor: COLORS.white },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default ChatPfpNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  closeIconContainer: {
    borderRadius: 50,
    backgroundColor: COLORS.grayscale400,
  },
  closeIcon: {
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  mainContentContainer: {
    flexDirection: 'row',
  },
  mainTextContainer: {
    marginLeft: 12,
    paddingVertical: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  agentStatus: {
    fontSize: 12,
    color: COLORS.green,
  },
  backIcon: {
    width: 18,
    height: 18,
  },
});
