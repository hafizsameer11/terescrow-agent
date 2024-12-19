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
import { useEffect } from 'react';

let profilePicture: string = '';
let profileName: string = '';
let receiverStatus = 'Offline';

const ChatPfpNav: React.FC<{
  chatDetails: ITeamChatDetailsResponse['data'] | undefined;
}> = ({ chatDetails }) => {
  const { dark } = useTheme();
  const { onlineAgents, isAdminOnline } = useSocket();
  const router = useRouter();

  // console.log(onlineAgents);
  useEffect(() => {
    if (!chatDetails) return;

    const { chatType, chatGroup, participants } = chatDetails;
    const receiver = participants?.[0]?.user;

    receiverStatus = 'Offline';

    if (chatType !== ChatType.group_chat && receiver) {
      // Check if the receiver is online
      const isReceiverOnline = onlineAgents.some(
        (agent) => +agent.userId === +receiver.id
      );
      console.log('Online agents: ');
      console.log(onlineAgents);
      onlineAgents.forEach((agent) => console.log(agent));
      // console.log(receiver.id, isReceiverOnline);

      receiverStatus = isReceiverOnline ? 'Online' : 'Offline';

      // If receiver is offline, check admin online receiverStatus
      if (
        receiverStatus === 'Offline' &&
        isAdminOnline &&
        +isAdminOnline.userId === +receiver.id
      ) {
        receiverStatus = 'Online';
      }
      // console.log(receiverStatus);
    }

    // Assign profile details based on chat type
    if (chatType === ChatType.group_chat && chatGroup) {
      profileName = chatGroup.groupName!;
      profilePicture = chatGroup.groupProfile!;
    } else if (receiver) {
      profileName = `${receiver.firstname} ${receiver.lastname}`;
      profilePicture = receiver.profilePicture!;
    }
  }, [onlineAgents, chatDetails, isAdminOnline]);

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
            source={
              profilePicture
                ? profilePicture
                : chatDetails?.chatType == ChatType.group_chat
                ? icons.people
                : icons.profile
            }
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

          {chatDetails?.chatType == ChatType.team_chat && (
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
