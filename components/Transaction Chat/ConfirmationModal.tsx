import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import { useTheme } from '@/contexts/themeContext';
import NewTransaction from './NewTransaction';
import React, { useState } from 'react';
import { ICategory, IDepartment } from '@/utils/queries/agentQueries';
const ConfirmationModal: React.FC<{
  modalState: boolean;
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
  currChatId?: number;
  currDepartment?: IDepartment;
  currCategory?: ICategory;
}> = ({
  modalState,
  setModalState,
  currChatId,
  currCategory,
  currDepartment,
}) => {
  const [transactionModalVisibility, setTransactionModalVisibility] =
    useState(false);
  const { dark } = useTheme();
  const handleConfirm = () => {
    setModalState(false);
    setTransactionModalVisibility(true);
  };
  console.log(transactionModalVisibility);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState}
        onRequestClose={() => setModalState(false)}
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
                onPress={() => setModalState(false)}
                style={[
                  styles.closeModalButton,
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
      <NewTransaction
        visibility={transactionModalVisibility}
        setVisibility={setTransactionModalVisibility}
        currChatId={currChatId}
        currCategory={currCategory}
        currDepartment={currDepartment}
      />
    </>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '93%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  body: {
    marginTop: 20,
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    color: COLORS.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  message: {
    fontSize: 14,
    color: COLORS.greyscale600,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    marginTop: 20,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: COLORS.black,
    padding: 5,
    borderRadius: 50,
  },
});
