import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons, images } from '@/constants';
import { Colors } from '@/constants/Colors';
import { DUMMY_ALL } from '@/utils/dummyAll';
import TeamGroupList from './TeamGroupList';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AllAgentsResponse, getAllAgents } from '@/utils/queries/adminQueries';
import { useAuth } from '@/contexts/authContext';
import { useSocket } from '@/contexts/socketContext';
import { createChatGroup } from '@/utils/mutations/adminMutations';
import { ApiError } from '@/utils/customApiCalls';
import { IUser } from '@/utils/queries/agentQueries';
import SelectedMembersModal from './SelectedMembersModal';
import { showTopToast } from '@/utils/helpers';
import LoadingOverlay from './LoadingOverlay';
// import { ActivityIndicator } from 'react-native-paper';

interface Proptypes {
  isDarkMode: boolean;
  modalVisible: boolean;
  setModalVisible: (modalState: boolean) => void;
}

const TeamGroupModal: React.FC<Proptypes> = ({
  isDarkMode,
  modalVisible,
  setModalVisible,
}) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAgents, setSelectedAgents] = useState<
    AllAgentsResponse['data']
  >([]);
  const [selectedMembersModalOpen, setSelectedMembersModalOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayAgents, setDisplayAgents] = useState<AllAgentsResponse['data']>(
    []
  );

  const {
    data: allAgentsData,
    isLoading: allAgentsLoading,
    isError: isAllAgentsError,
    error: allAgentsError,
  } = useQuery({
    queryKey: ['all-agents'],
    queryFn: () => getAllAgents({ token }),
  });

  const { mutate: createGroup, isPending: loadingCreateGroup } = useMutation({
    mutationKey: ['change-chat-status'],
    mutationFn: createChatGroup,
    onSuccess: (data) => {
      showTopToast({
        type: 'success',
        text1: 'Success',
        text2: data?.message || 'Group created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['all-chats-with-team'] });
      queryClient.refetchQueries({ queryKey: ['all-chats-with-team'] });
      setModalVisible(false);
    },
    onError: (error: ApiError) => {
      console.log(error);
    },
  });

  console.log(selectedAgents);

  useEffect(() => {
    if (allAgentsData?.data) {
      setDisplayAgents(allAgentsData.data);
    }
  }, [allAgentsData]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = displayAgents.filter((item) =>
        (item.user.firstname + ' ' + item.user.lastname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setDisplayAgents(filteredData);
    } else {
      setDisplayAgents(allAgentsData?.data || []);
    }
  }, [searchTerm]);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm); // Update the search term state
  };

  const getCheckedId = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAgents((prev) => {
        const isAlreadySelected = prev.some((user) => user.id === id);
        if (isAlreadySelected) return prev;
        const newAgent = displayAgents.find((user) => user.id === id);
        return [...prev, newAgent!];
      });
    } else {
      setSelectedAgents((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const handleCreateGroup = (groupName: string) => {
    if (selectedAgents.length > 0) {
      createGroup({
        token,
        data: {
          participants: [...selectedAgents].map((user) => ({ id: user.id })),
          groupName,
        },
      });
    }
  };
  // const filterDataHandler = () => {
  //   let filteredData = DUMMY_ALL;
  //   if (searchTerm) {
  //     filteredData = filteredData.filter((item) =>
  //       item.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }
  //   return filteredData;
  // };
  return (
    <React.Fragment>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => setModalVisible(false)}
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
                  // setDisplayAgents([])
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
            <LoadingOverlay visible={allAgentsLoading} />
            {isAllAgentsError && (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{allAgentsError?.message}</Text>
              </View>
            )}
            <FlatList
              data={displayAgents}
              style={styles.chatList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const { id, firstname, lastname, profilePicture, username } =
                  item?.user;

                return (
                  <TeamGroupList
                    name={firstname + ' ' + lastname}
                    pfp={profilePicture || icons.profile}
                    username={username}
                    isSelectable={true}
                    userId={item.id.toString()}
                    getCheckedId={getCheckedId}
                  />
                );
              }}
            />
            <Pressable
              style={styles.createGroupButton}
              // disabled={loadingCreateGroup}
              onPress={() =>
                selectedAgents.length > 0 && setSelectedMembersModalOpen(true)
              }
            >
              <Text style={styles.createGroupText}>
                {loadingCreateGroup ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  'Proceed'
                )}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <SelectedMembersModal
        modalVisible={selectedMembersModalOpen}
        setModalVisible={setSelectedMembersModalOpen}
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
        onCreatePress={handleCreateGroup}
      />
    </React.Fragment>
  );
};

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
    paddingLeft: 55,
    paddingTop: 23,
    paddingBottom: 23,
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

export default TeamGroupModal;
