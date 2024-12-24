import {
    StyleSheet,
    Text,
    View,
    TextInput,
    FlatList,
    Pressable,
  } from 'react-native';
  import { useTheme } from '@/contexts/themeContext';
  import { Image } from 'expo-image';
  import { COLORS, icons } from '@/constants';
  import { useEffect, useRef, useState } from 'react';
  import ChatContactList from '@/components/ChatContactList';
  import LoadingOverlay from '@/components/LoadingOverlay';
  import { useQuery } from '@tanstack/react-query';
  import {
    ChatStatus,
    getAllChatsWithCustomer,
  } from '@/utils/queries/agentQueries';
  import { useAuth } from '@/contexts/authContext';
  import { useSocket } from '@/contexts/socketContext';
  
  const PendingChats = () => {
    const { dark } = useTheme();
    const { token } = useAuth();
    const { socket } = useSocket(); 
    const [selectedCategory, setSelectedCategory] = useState<ChatStatus | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropDownVisibility, setDropDownVisibility] = useState(false);
    const chatIdsRef = useRef<number[]>([]);  
    const [displayChats, setDisplayChats] = useState<any[]> ([]);
  
    // Fetch all customer chats
    const {
      data: allChatsData,
      isLoading: allChatsLoading,
      isError: isAllChatsError,
      error: allChatsError,
      refetch,
    } = useQuery({
      queryKey: ['all-chats-with-customer'],
      refetchInterval: 1500,  // Polling every 1.5 seconds
      queryFn: () => getAllChatsWithCustomer(token),
      enabled: !!token,
    });
  
    // Update available chat IDs and apply filters when fetching data succeeds
    useEffect(() => {
      if (allChatsData?.data) {
        chatIdsRef.current = allChatsData.data.map((chat) => chat.id);
        const filteredChats = applyFilters(allChatsData.data); 
        setDisplayChats(filteredChats); 
      }
    }, [allChatsData, searchTerm, selectedCategory]);
  
    // Handle incoming messages via WebSocket
    useEffect(() => {
      if (socket) {
        socket.on('message', (newMessage) => {
          if (newMessage?.chatId && chatIdsRef.current.includes(newMessage.chatId)) {
            console.log('New Matched Chat ID:', newMessage.chatId);
            refetch();  
          }
        });
      }
      return () => {
        if (socket) {
          socket.off('message');  
        }
      };
    }, [socket, refetch]);
  
    const handleSearchChange = (term: string) => setSearchTerm(term);
  
    const selectedCategoryHandler = (category: ChatStatus | 'All') => {
      setSelectedCategory(category);
      setDropDownVisibility(false);
    };
  
    const toggleDropDownVisibility = () => setDropDownVisibility(!dropDownVisibility);
  
    const applyFilters = (chats: any[]) => {
      return chats.filter((chat) => {
        const matchesCategory = selectedCategory === 'All' || chat.chatStatus === selectedCategory;
        const matchesSearch =
          chat.customer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.customer.lastname.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    };
  
    return (
      <View style={[styles.container, dark && { backgroundColor: COLORS.black }]}>
        <LoadingOverlay visible={allChatsLoading} />
        <View style={styles.header}>
          <Text style={[styles.mainHeading, dark && { color: COLORS.white }]}>Pending Chats</Text>
          <Text style={styles.textDetail}>Manage all Default chats</Text>
        </View>
  
        <View style={styles.filterInput}>
          <View style={styles.filter}>
            <Text style={styles.filterHeading}>Filter by:</Text>
            <Pressable
              style={styles.filterCategory}
              onPress={toggleDropDownVisibility}
            >
              <Text style={[styles.allText, dark && { color: COLORS.white }]}>
                {selectedCategory}
              </Text>
              <Image
                source={icons.arrowDown}
                style={[styles.arrowDown, dark && { tintColor: COLORS.white }]}
              />
            </Pressable>
            {dropDownVisibility && (
              <View style={[styles.dropDown, dark && { backgroundColor: COLORS.dark3 }]}>
                {['All', 'pending', 'successful', 'declined'].map((status) => (
                  <Pressable
                    key={status}
                    style={styles.dropDownItem}
                    onPress={() => selectedCategoryHandler(status as ChatStatus | 'All')}
                  >
                    <Text style={styles.dropDownText}>{status}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
  
          <View style={styles.searchContainer}>
            <Image source={icons.search} style={styles.searchIcon} />
            <TextInput
              placeholder="Search customer name"
              placeholderTextColor={dark ? COLORS.grayscale400 : COLORS.black}
              
              style={[styles.searchInput, dark && { color: COLORS.white }]}
              onChangeText={handleSearchChange}
            />
          </View>
        </View>
  
        <FlatList
          data={displayChats}
          style={styles.chatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChatContactList
              id={item.id.toString()}
              pfp={item.customer.profilePicture}
              name={`${item.customer.firstname} ${item.customer.lastname}`}
              icon={icons.gallery}
              time={item.recentMessageTimestamp}
              msg={item.recentMessage?.message}
              status={item.chatStatus}
              messageCount={item.messagesCount}
            />
          )}
        />
      </View>
    );
  };
  
  export default PendingChats;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: COLORS.white,
    },
    header: {
      marginTop: 5,
      marginBottom: 24,
    },
    mainHeading: {
      fontSize: 18,
      fontWeight: '500',
      marginBottom: 5,
    },
    textDetail: {
      fontSize: 14,
      color: COLORS.greyscale600,
    },
    filterInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    filter: {
      flex: 0.7,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterHeading: {
      fontSize: 14,
      color: COLORS.greyscale600,
    },
    filterCategory: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    allText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 5,
    },
    arrowDown: {
      width: 12,
      height: 12,
      marginLeft: 5,
    },
    searchContainer: {
      flex: 1,
      justifyContent: 'center',
      padding:0,
    },
    searchIcon: {
      position: 'absolute',
      width: 13,
      height: 13,
      left: 16,
      tintColor: COLORS.greyscale600,
    },
    searchInput: {
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: 10,
      paddingRight: 16,
      paddingLeft: 37,
      color: COLORS.black,
      borderColor: COLORS.grayscale400,
    },
    chatList: {
      marginTop: 20,
    },
    dropDown: {
      position: 'absolute',
      top: 32,
      padding: 10,
      zIndex: 1,
      elevation: 5,
      borderRadius: 5,
      backgroundColor: COLORS.white,
    },
    dropDownItem: {
      paddingVertical: 8,
    },
    dropDownText: {
      fontSize: 14,
      color: COLORS.greyscale900,
    },
  });
  