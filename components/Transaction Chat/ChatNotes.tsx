import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Image } from "expo-image"; // For displaying images
import { COLORS, icons } from "@/constants"; // Replace with your icon source path

interface Note {
  id: string;
  text: string;
  date: string;
  savedBy: string;
}

const ChatNotes: React.FC<{
  closeNotes: () => void;
  showNotesSate: boolean;
}> = (props) => {
  const [isNewNoteModalVisible, setNewNoteModalVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      text: "Customer is kind and reputable and respectful, doesnt stress me at all, but does not like waiting for too long",
      date: "Nov 7, 2024 - 10:22 am",
      savedBy: "Dave",
    },
    {
      id: "2",
      text: "Customer is kind and reputable and respectful, doesnt stress me at all, but does not like waiting for too long",
      date: "Nov 7, 2024 - 10:22 am",
      savedBy: "Dave",
    },
  ]);

  const [newNoteText, setNewNoteText] = useState("");

  // const toggleMainModal = () => {
  //   setMainModalVisible(!isMainModalVisible);
  // };

  const toggleNewNoteModal = () => {
    setNewNoteModalVisible(!isNewNoteModalVisible);
  };

  const addNewNote = () => {
    if (newNoteText.trim()) {
      const newNote: Note = {
        id: (notes.length + 1).toString(),
        text: newNoteText.trim(),
        date: new Date().toLocaleString(),
        savedBy: "You",
      };
      setNotes([newNote, ...notes]);
      setNewNoteText(""); // Clear input field
      toggleNewNoteModal();
    } else {
      alert("Please enter some text for the note!");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id: string) => {
    alert(`Edit note with ID: ${id}`);
  };

  return (
    <>
      {/* Main Modal */}
      <Modal
        visible={props.showNotesSate}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.container}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={props.closeNotes}
            >
              <Image source={icons.close2} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Notes History</Text>
              <TouchableOpacity
                style={styles.newNoteButton}
                onPress={toggleNewNoteModal}
              >
                <Text style={styles.newNoteText}>New Note</Text>
              </TouchableOpacity>
            </View>

            {/* List */}
            <View style={{ flex: 1 }}>
              <FlatList
                style={styles.notesList}
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.noteItem}>
                    <Text style={styles.noteText}>{item.text}</Text>
                    <Text style={styles.noteMeta}>
                      {item.date} Saved by {item.savedBy}
                    </Text>
                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => editNote(item.id)}>
                        <Text
                          style={[styles.actionText, { color: COLORS.green }]}
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteNote(item.id)}>
                        <Text
                          style={[styles.actionText, { color: COLORS.red }]}
                        >
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* New Note Modal */}
      <Modal
        visible={isNewNoteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleNewNoteModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.newNoteContainer}>
            {/* Close Icon */}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={toggleNewNoteModal}
            >
              <Image source={icons.close2} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

            {/* Header */}
            <Text style={styles.newNoteHeader}>Add new note</Text>

            {/* Text Input */}
            <TextInput
              style={styles.input}
              placeholder="Add new note"
              multiline
              value={newNoteText}
              onChangeText={setNewNoteText}
            />

            {/* Complete Button */}
            <TouchableOpacity
              style={styles.completeButton}
              onPress={addNewNote}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
    margin: 20,
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  newNoteButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  newNoteText: {
    fontSize: 14,
    color: "#000",
  },
  noteItem: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 10,
    paddingBottom: 10,
  },
  noteText: {
    fontSize: 14,
    marginBottom: 5,
  },
  noteMeta: {
    fontSize: 12,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  actionText: {
    fontSize: 14,
    color: "#007BFF",
    marginRight: 20,
  },
  newNoteContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  newNoteHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  completeButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notesList: {
    width: "100%",
    marginTop: 10,
  },
});

export default ChatNotes;
