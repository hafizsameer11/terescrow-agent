import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import { createQuickReply, updateQuickReply } from '@renderer/api/queries/agent.mutations';
// import { deleteQuickReply, getAllQuickReplies, QuickReply } from '@renderer/api/queries/agent.queries';
// import { useAuth } from '@renderer/context/authContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteQuickReply, getAllQuickReplies, QuickReply } from '@/utils/queries/agentQueries';
import { useAuth } from '@/contexts/authContext';
import { createQuickReply, updateQuickReply } from '@/utils/mutations/agentMutations';
import { COLORS } from '@/constants';

const QuickReplies = () => {
  const [quickReplyData, setQuickReplyData] = useState<QuickReply[]>([]);
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReply, setSelectedReply] = useState<QuickReply | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  // Fetch quick replies
  const { data: quickReplies } = useQuery({
    queryKey: ['quickReplies'],
    queryFn: () => getAllQuickReplies(token),
    enabled: !!token
  });

  useEffect(() => {
    if (quickReplies) {
      setQuickReplyData(quickReplies.data);
    }
  }, [quickReplies]);

  // Create Quick Reply
  const { mutate: createRep } = useMutation({
    mutationKey: ['create-reply'],
    mutationFn: (data: { message: string }) => createQuickReply(data, token),
    onSuccess: () => {
      Alert.alert('Success', 'Quick reply created successfully.');
      queryClient.invalidateQueries(['quickReplies']);
      setShowCreateModal(false);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Update Quick Reply
  const { mutate: updateReply } = useMutation({
    mutationKey: ['update-reply'],
    mutationFn: ({ data, id }: { data: { message: string }; id: number }) =>
      updateQuickReply(data, token, id),
    onSuccess: () => {
      Alert.alert('Success', 'Quick reply updated successfully.');
      queryClient.invalidateQueries(['quickReplies']);
      setShowUpdateModal(false);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Delete Quick Reply
  const { mutate: deleteQuickRep } = useMutation({
    mutationKey: ['delete-reply'],
    mutationFn: (id: number) => deleteQuickReply(id, token),
    onSuccess: () => {
      Alert.alert('Success', 'Quick reply deleted successfully.');
      queryClient.invalidateQueries(['quickReplies']);
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Handle creation
  const handleCreate = () => {
    if (newMessage.trim() === '') {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }
    createRep({ message: newMessage });
    setNewMessage('');
  };

  // Handle update
  const handleUpdate = () => {
    if (selectedReply && newMessage.trim() !== '') {
      updateReply({ data: { message: newMessage }, id: selectedReply.id });
    } else {
      Alert.alert('Error', 'Please enter a message to update');
    }
  };

  // Handle delete
  const handleDeleteQuickReply = (id: number) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this quick reply?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteQuickRep(id) }
      ]
    );
  };

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(quickReplyData?.length / itemsPerPage);
  const paginatedData = quickReplyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Replies</Text>

      <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.buttonText}>Create Quick Reply</Text>
      </TouchableOpacity>

      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text>Message: {item.message}</Text>
            <Text>
              Created At: {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}{' '}
              {new Date(item.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,  // For AM/PM format, remove this line for 24-hour format
              })}
            </Text>

            <View style={styles.buttonContainer}>
              <Button title="Update" onPress={() => { setSelectedReply(item); setShowUpdateModal(true); }} />
              <Button title="Delete" color="red" onPress={() => handleDeleteQuickReply(item.id)} />
            </View>
          </View>
        )}
      />

      <View style={styles.pagination}>
        <Button title="Previous" disabled={currentPage === 1} onPress={() => setCurrentPage(currentPage - 1)} />
        <Text>Page {currentPage} of {totalPages}</Text>
        <Button title="Next" disabled={currentPage === totalPages} onPress={() => setCurrentPage(currentPage + 1)} />
      </View>

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Enter quick reply"
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Button color={COLORS.primary} title="Create" onPress={handleCreate} />
            <View style={{ height: 10 }}></View>
            <Button title="Cancel" onPress={() => setShowCreateModal(false)} color={COLORS.red} />
          </View>
        </View>
      </Modal>

      {/* Update Modal */}
      <Modal visible={showUpdateModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Update quick reply"
              style={styles.input}
              defaultValue={selectedReply?.message}
              onChangeText={setNewMessage}
            />
            <Button title="Update" onPress={handleUpdate} color={COLORS.primary} />
            <View style={{ height: 10 }}></View>
            <Button title="Cancel" onPress={() => setShowUpdateModal(false)} color={COLORS.red} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  createButton: { backgroundColor: '#147341', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  card: { padding: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
});

export default QuickReplies;
