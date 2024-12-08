import {
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, icons, images } from "@/constants";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import MessageInput from "@/components/MessageInput";
import { DUMMY_CHAT } from "@/utils/dummyChat";
import { useLocalSearchParams } from "expo-router";
import TransChatNav from "@/components/TransChatNav";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  image?: string;
};

const TransactionChat = () => {
  const { dark } = useTheme();
  const { id } = useLocalSearchParams();
  const userData = DUMMY_CHAT.filter((item) => item.id === id);
  const flatListRef = useRef<FlatList>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalVisibility, setmodalVisibility] = useState(false);
  const [isRejected, setIsrejected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "i want to trade $100.00 USD Amazon Credit receipt (25-49)",
      isUser: false,
    },
    { id: "2", text: "Checking!!!", image: images.card, isUser: false },
  ]);

  const onAcceptHandler = () => {
    setIsAccepted(true);
  };

  const onProcessHandler = () => {
    setIsProcessed(true);
    setTimeout(() => {
      openModal();
    }, 3000);
  };

  const onProcessCancelHandler = () => {
    setIsProcessed(false);
    setmodalVisibility(false);
  };

  const openModal = () => {
    setmodalVisibility(true);
  };

  const closeModal = () => {
    setmodalVisibility(false);
    setIsProcessed(false);
  };

  const handleConfirm = () => {
    console.log("Transaction Confirmed!");
    closeModal();
    setIsProcessed(false);
    setIsConfirmed(true);
  };

  const onDeclineHandler = () => {
    setIsrejected(true);
    setIsAccepted(false);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const sendMessage = (message?: string, image?: any) => {
    if (!image && !message) return;

    let newMessage: Message;

    if (!image) {
      newMessage = {
        id: (messages.length + 1).toString(),
        text: message || "",
        isUser: true,
      };
    } else {
      newMessage = {
        id: (messages.length + 1).toString(),
        text: message || "",
        isUser: true,
        image: image,
      };
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setTimeout(() => {
      const responseMessage: Message = {
        id: (messages.length + 2).toString(),
        text: "This is a dummy response!",
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      scrollToBottom();
    }, 1000);
    scrollToBottom();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.otherMessage,
      ]}
    >
      {item.image && (
        <TouchableOpacity onPress={() => setImagePreview(item.image as string)}>
          <Image source={item.image} style={styles.dynamicImage} />
        </TouchableOpacity>
      )}
      {!item.image && (
        <Text
          style={[
            styles.messageText,
            item.isUser
              ? styles.userMessageTextColor
              : styles.otherMessageTextColor,
          ]}
        >
          {item.text}
        </Text>
      )}
      <Text
        style={[
          styles.timestamp,
          { alignSelf: item.isUser ? "flex-end" : "flex-start" },
        ]}
      >
        {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );

  //this event listener scrolls to bottom to view full content
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      console.log("ok");
      setTimeout(() => scrollToBottom(), 200);
    });

    return () => {
      Keyboard.removeAllListeners;
    };
  }, []);

  const renderAgentChat = () => {
    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          dark
            ? { backgroundColor: COLORS.black }
            : { backgroundColor: COLORS.white },
        ]}
        behavior="padding"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToBottom}
        />
        {isAccepted && !isConfirmed && (
          <MessageInput sendMessage={sendMessage} />
        )}

        {imagePreview && (
          <Modal transparent={true} visible={!!imagePreview}>
            <View style={styles.previewContainer}>
              <Image source={imagePreview} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImagePreview(null)}
              >
                <Ionicons name="arrow-back" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        dark
          ? { backgroundColor: COLORS.black }
          : { backgroundColor: COLORS.white },
      ]}
    >
      <TransChatNav
        name={userData[0].name}
        userName={userData[0].userName}
        image={userData[0].pfp}
        onAccept={onAcceptHandler}
        currentState={isAccepted}
        onProcess={onProcessHandler}
        isCurrentlyConfirmed={isConfirmed}
        onDecline={onDeclineHandler}
        isDeclined={isRejected}
      />
      {/* if user accepted */}
      {!isAccepted && !isRejected && (
        <View style={styles.userInfo}>
          <Text style={{ color: COLORS.greyscale600 }}>
            Click on the tick icon above to accept the order
          </Text>
        </View>
      )}
      {!isAccepted && isRejected && (
        <View style={styles.userInfo}>
          <Text style={{ color: COLORS.greyscale600 }}>Declined the trade</Text>
        </View>
      )}
      {isAccepted && (
        <View style={styles.userInfo}>
          <Text style={{ color: COLORS.greyscale600 }}>Accepted by - You</Text>
        </View>
      )}
      {/* if user have started processing */}
      {isProcessed && (
        <View style={styles.processContainer}>
          <View
            style={[
              styles.processing,
              {
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#D6DA2B",
                backgroundColor: "#FEFFD7",
              },
            ]}
          >
            <Image
              source={icons.hourGlass}
              style={{ width: 10, height: 12, marginRight: 8 }}
            />
            <Text>This trade is currently being proceed you</Text>
            <Pressable
              onPress={onProcessCancelHandler}
              style={{ marginLeft: 14 }}
            >
              <Text>CANCEL</Text>
            </Pressable>
          </View>
        </View>
      )}
      {/* Modal of confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibility}
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalContainer,
              dark && { backgroundColor: COLORS.black },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={closeModal}
                style={[
                  styles.closeModalButtom,
                  dark && { backgroundColor: COLORS.white },
                ]}
              >
                <Image
                  source={[icons.close2]}
                  style={[
                    { width: 10, height: 10, tintColor: COLORS.white },
                    dark && { tintColor: COLORS.black },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 50,
                }}
              >
                <Text style={styles.icon}>?</Text>
              </View>
              <Text
                style={[
                  styles.title,
                  dark ? { color: COLORS.white } : { color: COLORS.black },
                ]}
              >
                Complete transaction?
              </Text>
              <Text style={styles.message}>
                Are you sure you want to confirm this giftcard transaction?
              </Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {isConfirmed && (
        <View style={styles.processContainer}>
          <View
            style={[
              styles.processing,
              {
                backgroundColor: "#EBFFF3",
                borderRadius: 10,
                borderColor: COLORS.black,
                alignItems: "center",
              },
            ]}
          >
            <View style={styles.checkIconContainer}>
              <Image
                source={icons.check2}
                style={{
                  width: 8,
                  height: 8,
                  tintColor: COLORS.white,
                }}
              />
            </View>
            <Text>This trade is completed by you</Text>
          </View>
        </View>
      )}
      {isRejected && (
        <View style={styles.processContainer}>
          <View
            style={[
              styles.processing,
              {
                backgroundColor: "#FF7F7F",
                borderRadius: 10,
                borderColor: COLORS.black,
                alignItems: "center",
              },
            ]}
          >
            <View style={styles.checkIconContainer}>
              <Image
                source={icons.close2}
                style={{
                  width: 8,
                  height: 8,
                  tintColor: COLORS.white,
                }}
              />
            </View>
            <Text>This trade is declined by you</Text>
          </View>
        </View>
      )}
      {renderAgentChat()}
    </SafeAreaView>
  );
};

export default TransactionChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  chatContainer: { padding: 10 },
  messageContainer: {
    maxWidth: "70%",
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
  },
  userMessage: { alignSelf: "flex-end" },
  otherMessage: { alignSelf: "flex-start" },
  userMessageTextColor: { backgroundColor: "#DCF8C6" },
  otherMessageTextColor: { backgroundColor: "#E5E5E5" },
  messageText: { fontSize: 16, padding: 15, borderRadius: 8 },
  timestamp: { fontSize: 12, marginTop: 5, color: COLORS.grayscale400 },
  dynamicImage: { width: "100%", height: undefined, aspectRatio: 1 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
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
  },
  sendMessage: {
    position: "absolute",
    right: 20,
    paddingVertical: 10,
    paddingRight: 20,
  },
  imagePickerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "contain" },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    padding: 5,
  },
  userInfo: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.grayscale200,
  },
  processContainer: {
    width: "100%",
    position: "absolute",
    bottom: 120,
    zIndex: 1,
  },
  processing: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: "2%",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "93%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
  },
  body: {
    marginTop: 20,
    alignItems: "center",
  },
  icon: {
    fontSize: 40,
    color: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  message: {
    fontSize: 14,
    color: COLORS.greyscale600,
    textAlign: "center",
  },
  footer: {
    width: "100%",
    marginTop: 20,
  },
  checkIconContainer: {
    backgroundColor: COLORS.black,
    marginRight: 12,
    padding: 5,
    borderRadius: 10,
  },
  closeModalButtom: {
    backgroundColor: COLORS.black,
    padding: 5,
    borderRadius: 50,
  },
});
