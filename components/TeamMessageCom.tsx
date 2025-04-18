import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IResMessage } from '@/utils/queries/agentQueries';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/authContext';
import { COLORS } from '@/constants';
import { ITeamChatDetailsResponse } from '@/utils/queries/commonQueries';
import { getImageUrl, timeFormatter } from '@/utils/helpers';
import { API_BASE_URL } from '@/utils/apiConfig';

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
  const profilePictureUri = messageData.senderId === userData?.id
    ? sender?.profilePicture
    : sender?.profilePicture;
  
  console.log('Profile Picture URI:', profilePictureUri);
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
        source={{
          uri: getImageUrl(profilePictureUri || ''),
        }}
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
        {messageData.image && (
          <TouchableOpacity
            onPress={() => {console.log(` ${API_BASE_URL}/uploads/${messageData.image}`)}}
          >
            <Image source={{ uri:getImageUrl(messageData?.image || '') }} style={styles.dynamicImage} />
          </TouchableOpacity>
        )}
        {!messageData.image && (
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
            {timeFormatter(messageData.createdAt)}
          </Text>
        </View>
         )}  
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
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#E1FFEF' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#EFEFEF' },
  messageText: { fontSize: 16, borderRadius: 8 },
  groupMessage: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    padding: 10,
  },
  timestamp: { fontSize: 12, marginTop: 5, color: COLORS.grayscale400 },
  dynamicImage: { width: '100%', height: undefined, aspectRatio: 1 },
});
