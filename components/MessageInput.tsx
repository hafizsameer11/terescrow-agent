import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/themeContext';
import { COLORS } from '@/constants';
import * as ImagePicker from 'expo-image-picker';
import { QuickReply } from '@/utils/queries/agentQueries';
import { useAuth } from '@/contexts/authContext';

interface MessageInputProps {
  sendMessage: (message?: string, image?: string) => void;
  sendingMessage: boolean;
  quickReplies: QuickReply[];
}

const MessageInput: React.FC<MessageInputProps> = ({
  sendMessage,
  sendingMessage,
  quickReplies,
}) => {
  const { dark } = useTheme();
  const [input, setInput] = useState<string>('');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState<boolean>(false);
  const [isQuickRepliesOpen, setIsQuickRepliesOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
const {userData} = useAuth();
  const handleSendMessage = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
      setIsImagePickerOpen(false);
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagePreview(result.assets[0].uri);
    }
    setIsImagePickerOpen(false);
  };

  const sendImage = () => {
    if (imagePreview) {
      sendMessage('', imagePreview);
      setImagePreview(null);
    }
  };

  const handleQuickReplySelect = (message: string) => {
    setInput((prev) => (prev ? `${prev} ${message}` : message));
    setIsQuickRepliesOpen(false);
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => setIsImagePickerOpen(true)}
          style={styles.iconButton}
        >
          <Ionicons name="image-outline" size={24} color={dark ? COLORS.white : COLORS.black} />
        </TouchableOpacity>
{
  userData?.role != 'admin' && (
    <TouchableOpacity
    onPress={() => setIsQuickRepliesOpen(!isQuickRepliesOpen)}
    style={styles.iconButton}
  >
    <Ionicons name="chatbubble-ellipses-outline" size={24} color={dark ? COLORS.white : COLORS.black} />
  </TouchableOpacity>

  )

}
       
        <TextInput
          style={[
            styles.input,
            dark ? { color: COLORS.white } : { color: COLORS.black },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={dark ? COLORS.white : COLORS.black}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendMessage}>
          {sendingMessage ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Text
              style={[{ fontWeight: 'bold' }, dark ? { color: COLORS.white } : { color: COLORS.black }]}
            >
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {isImagePickerOpen && (
        <Modal transparent={true} visible={isImagePickerOpen}>
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.optionButton}>
              <Text style={styles.optionText}>Pick from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureImage} style={styles.optionButton}>
              <Text style={styles.optionText}>Capture from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsImagePickerOpen(false)} style={styles.optionButton}>
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {imagePreview && (
        <Modal transparent={true} visible={!!imagePreview}>
          <View style={styles.previewContainer}>
            <Image source={{ uri: imagePreview }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => setImagePreview(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendImage} style={styles.sendButton}>
              <Text style={styles.sendText}>Send Image</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {isQuickRepliesOpen && (
        <View style={styles.quickRepliesContainer}>
          <FlatList
            data={quickReplies}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.quickReply} onPress={() => handleQuickReplySelect(item.message)}>
                <Text style={styles.quickReplyText}>{item.message}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingStart: 20,
    paddingEnd: 60,
    borderRadius: 25,
    marginHorizontal: 10,
    fontSize: 16,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.grayscale400,
  },
  iconButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
    borderColor: COLORS.grayscale400,
    marginHorizontal: 5,
  },
  sendMessage: {
    position: 'absolute',
    right: 20,
    paddingVertical: 10,
    paddingRight: 20,
  },
  imagePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '60%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 10,
  },
  sendButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
  },
  sendText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  quickRepliesContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
  },
  quickReply: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  quickReplyText: {
    fontSize: 16,
    color: COLORS.black,
  },
});
