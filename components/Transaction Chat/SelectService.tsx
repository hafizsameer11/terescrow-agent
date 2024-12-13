import { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import SelectField from './SelectField';
import SelectableOption from './SelectableOption';
import NewTransaction from './NewTransaction';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/authContext';
import { getDepartments } from '@/utils/queries/commonQueries';

const SelectService: React.FC<{ showServices: boolean }> = (props) => {
  const shouldShow = props.showServices;
  const { token } = useAuth();
  const [currentModalVisibility, setCurrentModalVisibility] = useState(false);

  useEffect(() => {
    setCurrentModalVisibility(shouldShow);
  }, [shouldShow]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setselectedOption] = useState('Sell - Gift Card');
  const [isContinue, setisContinue] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onSelectOptionHandler = (option: string) => {
    setModalVisible(false);
    setselectedOption(option);
  };

  const onContinuePressHandler = () => {
    setisContinue(true);
    setCurrentModalVisibility(false);
  };

  const currentModalCloseHandler = () => {
    setCurrentModalVisibility(false);
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={currentModalVisibility}
      >
        <View style={styles.overlay}>
          <View style={[styles.modalContainer]}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={currentModalCloseHandler}
                style={[styles.closeModalButtom]}
              >
                <Image
                  source={[icons.close2]}
                  style={[
                    { width: 10, height: 10, tintColor: COLORS.white },
                    // dark && { tintColor: COLORS.black },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <SelectField
                text={selectedOption}
                label="Service Type"
                icon={icons.arrowDown}
                onClickHandler={openModal}
                isClickable={true}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onContinuePressHandler}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <SelectableOption
        onSelect={onSelectOptionHandler}
        onCloseModal={closeModal}
        modalState={modalVisible}
      />
      {/* {isContinue && <NewTransaction selectedService={selectedOption} />} */}
    </>
  );
};

export default SelectService;

const styles = StyleSheet.create({
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
  },
  header: {
    width: '100%',
    alignItems: 'flex-end',
  },
  body: {
    marginTop: 20,
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
