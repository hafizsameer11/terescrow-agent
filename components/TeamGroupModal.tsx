import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Colors } from "@/constants/Colors";
import { DUMMY_ALL } from "@/utils/dummyAll";
import TeamGroupList from "./TeamGroupList";

interface User {
  id: string;
}

const TeamGroupModal: React.FC<{
  isDarkMode: boolean;
  modalVisible: boolean;
  setModalVisible: (modalState: boolean) => void;
  onUserSelection: (selectedUsers: User[]) => void;
}> = ({ isDarkMode, modalVisible, setModalVisible, onUserSelection }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userIds, setUserIds] = useState<User[]>([]);
  const getGroupUsers = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setUserIds((prevIds) => [...prevIds, { id: userId }]);
    } else {
      setUserIds((prevIds) => prevIds.filter((user) => user.id !== userId));
    }
  };
  console.log(userIds);
  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm); // Update the search term state
  };
  const filterDataHandler = () => {
    let filteredData = DUMMY_ALL;
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredData;
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalView,
            isDarkMode
              ? { backgroundColor: COLORS.dark2 }
              : { backgroundColor: COLORS.white },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalHeaderText,
                isDarkMode && { color: COLORS.white },
              ]}
            >
              New Group
            </Text>
            {/* Button to close the modal */}
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setUserIds([]);
              }}
            >
              <Image
                source={icons.close2}
                style={[
                  styles.closeIcon,
                  isDarkMode && { tintColor: Colors.dark.tint },
                ]}
              />
            </Pressable>
          </View>
          {/* Search Field */}
          <View style={styles.searchBarContainer}>
            <Image
              source={icons.search}
              style={[
                styles.searchIcon,
                isDarkMode && { tintColor: Colors.dark.tint },
              ]}
            />
            <TextInput
              style={[
                styles.searchInput,
                isDarkMode && { color: Colors.dark.text },
              ]}
              placeholder="Search team member"
              placeholderTextColor="#9E9E9E"
              onChangeText={handleSearchChange}
            />
          </View>
          {/* Contact List */}
          <FlatList
            data={filterDataHandler()}
            style={styles.chatList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TeamGroupList
                name={item.name}
                pfp={item.pfp}
                online={item.online}
                username={item.username}
                isDarkMode={isDarkMode}
                userId={item.id.toString()}
                getCheckedId={getGroupUsers}
              />
            )}
          />
          <Pressable
            style={styles.createGroupButton}
            onPress={() => onUserSelection(userIds)}
          >
            <Text style={styles.createGroupText}>Create Group</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: "black",
  },
  modalOverlay: {
    flex: 1,
    top: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "95%",
    height: "80%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 21,
    borderColor: COLORS.grayscale400,
  },
  searchIcon: {
    position: "absolute",
    width: 28,
    height: 28,
    left: 17,
    zIndex: 1,
    tintColor: COLORS.greyscale600,
  },
  searchInput: {
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 55,
    paddingTop: 23,
    paddingBottom: 23,
    borderRadius: 12,
    color: COLORS.black,
    backgroundColor: "transparent",
    borderColor: COLORS.grayscale400,
  },
  chatList: {
    flex: 1,
    marginTop: 20,
  },
  createGroupButton: {
    paddingVertical: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  createGroupText: {
    fontSize: 14,
    color: COLORS.white,
  },
});

export default TeamGroupModal;
