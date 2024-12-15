import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IResMessage } from '@/utils/queries/agentQueries';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/authContext';
import { COLORS } from '@/constants';
import { ITeamChatDetailsResponse } from '@/utils/queries/commonQueries';

const TeamMessageCom = ({
  messageData,
  participants,
}: {
  messageData: IResMessage;
  participants: ITeamChatDetailsResponse['data']['participants'];
}) => {
  const { userData } = useAuth();
  const sender = participants?.find(
    (participant) => participant.user.id === messageData.senderId
  )?.user;

  console.log(messageData);
  return (
    <View
      style={[
        styles.messageWrapper,
        {
          flexDirection:
            messageData.senderId === userData?.id ? 'row-reverse' : 'row',
        },
      ]}
    >
      {/* Profile Picture */}
      <Image
        source={[
          messageData.senderId === userData?.id
            ? userData?.profilePicture
            : sender?.profilePicture,
        ]}
        style={styles.profilePicture}
      />

      {/* Message Content */}
      <View
        style={[
          styles.messageContainer,
          messageData.senderId === userData?.id
            ? styles.userMessage
            : styles.otherMessage,
        ]}
      >
        {/* {messageData.image && (
          <TouchableOpacity
            onPress={() => setImagePreview(messageData.image as string)}
          >
            <Image source={{ uri: messageData.image }} style={styles.dynamicImage} />
          </TouchableOpacity>
        )} */}
        {/* {!messageData.image && ( */}
        <View style={styles.messageWithTimestamp}>
          <Text style={styles.messageText}>{messageData.message}</Text>
          <Text
            style={[
              styles.timestamp,
              {
                alignSelf:
                  messageData.senderId === userData?.id
                    ? 'flex-end'
                    : 'flex-start',
              },
            ]}
          >
            {new Date().toLocaleTimeString()}
          </Text>
        </View>
        {/* )}  */}
      </View>
    </View>
  );
};

export default TeamMessageCom;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '70%',
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    marginTop: 6,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  messageWrapper: {
    marginVertical: 5,
  },
  messageWithTimestamp: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: 5,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 5,
  },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#E5E5E5' },
  messageText: { fontSize: 16, borderRadius: 8 },
  groupMessage: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 10,
  },
  timestamp: { fontSize: 12, marginTop: 5, color: COLORS.grayscale400 },
  dynamicImage: { width: '100%', height: undefined, aspectRatio: 1 },
});
