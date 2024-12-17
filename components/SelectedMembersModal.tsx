import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS, icons, images } from '@/constants';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AllAgentsResponse } from '@/utils/queries/adminQueries';
import TeamGroupList from './TeamGroupList';
import { showTopToast } from '@/utils/helpers';

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalState: boolean) => void;
  selectedAgents: AllAgentsResponse['data'];
  setSelectedAgents: React.Dispatch<
    React.SetStateAction<AllAgentsResponse['data']>
  >;
  onCreatePress: (groupName: string) => void;
}

const SelectedMembersModal = ({
  modalVisible,
  setModalVisible,
  selectedAgents,
  setSelectedAgents,
  onCreatePress,
}: Props) => {
  const { dark } = useTheme();
  const [groupName, setGroupName] = React.useState('');

  const handleDeleteSelected = (userId: number) => {
    setSelectedAgents((prev) => prev.filter((agent) => agent.id !== userId));
  };

  const handleCreateGroup = () => {
    if (!groupName) {
      showTopToast({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a group name',
      });
      return;
    }
    onCreatePress(groupName);
    setGroupName('');
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      //   onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalView,
            dark
              ? { backgroundColor: COLORS.dark2 }
              : { backgroundColor: COLORS.white },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[styles.modalHeaderText, dark && { color: COLORS.white }]}
            >
              Group Name
            </Text>
            {/* Button to close the modal */}
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                // setDisplayAgents([])
              }}
            >
              <Image
                source={icons.close2}
                style={[
                  styles.closeIcon,
                  dark && { tintColor: Colors.dark.tint },
                ]}
              />
            </Pressable>
          </View>
          {/* Search Field */}
          <View style={styles.searchBarContainer}>
            <TextInput
              style={[styles.searchInput, dark && { color: Colors.dark.text }]}
              placeholder="Enter group name"
              placeholderTextColor="#9E9E9E"
              onChangeText={(value) => setGroupName(value)}
            />
          </View>
          {/* Contact List */}
          <FlatList
            data={selectedAgents}
            style={styles.chatList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const { id, firstname, lastname, profilePicture, username } =
                item?.user;

              return (
                <TeamGroupList
                  name={firstname + ' ' + lastname}
                  pfp={profilePicture || images.avatar}
                  username={username}
                  isSelectable={false}
                  deleteSelected={handleDeleteSelected}
                  userId={item.id.toString()}
                />
              );
            }}
          />
          <Pressable
            style={styles.createGroupButton}
            // disabled={loadingCreateGroup}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createGroupText}>Create Group</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SelectedMembersModal;

const styles = StyleSheet.create({
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
  },
  modalOverlay: {
    flex: 1,
    top: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '95%',
    height: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 21,
    borderColor: COLORS.grayscale400,
  },
  searchIcon: {
    position: 'absolute',
    width: 28,
    height: 28,
    left: 17,
    zIndex: 1,
    tintColor: COLORS.greyscale600,
  },
  searchInput: {
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 12,
    color: COLORS.black,
    backgroundColor: 'transparent',
    borderColor: COLORS.grayscale400,
  },
  chatList: {
    flex: 1,
    marginTop: 20,
  },
  createGroupButton: {
    paddingVertical: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  createGroupText: {
    fontSize: 14,
    color: COLORS.white,
  },
});
