import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { IRenderMessage } from '@/app/transactionchat';
import { Image } from 'expo-image';
import { COLORS } from '@/constants';
import { getImageUrl } from '@/utils/helpers';

type PropTypes = {
  messageData: IRenderMessage;
  setImagePreview: (image: string) => void;
  isAdmin?: boolean;
  // role?:string
  customerId?: string | number;
};

const MessageCom = ({ messageData, setImagePreview,isAdmin,customerId }: PropTypes) => {
  console.log("Message Data", messageData);
  return (
    <View
      style={[
        styles.messageContainer,
        messageData.senderId===customerId ? styles.otherMessage : styles.userMessage,
      ]}
    >
      {messageData.image && (
        <TouchableOpacity
          onPress={() => setImagePreview(getImageUrl(messageData?.image || '') as string)}
        >
          <Image source={{ uri: getImageUrl(messageData.image) }} style={styles.dynamicImage} />
        </TouchableOpacity>
      )}
      {!messageData.image && (
        <Text
          style={[
            styles.messageText,
            messageData.senderId===customerId
              ? styles.otherMessage
              : styles.userMessage,
          ]}
        >
          {messageData.text}
        </Text>
      )}
      <Text
        style={[
          styles.timestamp,
          { alignSelf: messageData.isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
    {messageData?.timestampt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

      </Text>
    </View>
  );
};

export default MessageCom;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '70%',
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
  },
  userMessage: { alignSelf: 'flex-end',
    backgroundColor: '#E1FFEF' 
   },
  otherMessage: { alignSelf: 'flex-start',backgroundColor: '#EFEFEF' },
  userMessageTextColor: { backgroundColor: '#E1FFEF' },
  otherMessageTextColor: { backgroundColor: '#EFEFEF' },
  messageText: { fontSize: 16, padding: 15, borderRadius: 8 },
  dynamicImage: { width: '100%', height: undefined, aspectRatio: 1, },

  timestamp: { fontSize: 12, marginTop: 5, color: COLORS.grayscale400 },
});
