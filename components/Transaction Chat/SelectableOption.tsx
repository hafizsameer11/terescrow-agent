import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import ServiceTypeOption from "./ServiceTypeOption";

const serviceTypes = [
  { id: "1", name: "Sell - Gift Card" },
  { id: "2", name: "Buy - Crypto" },
];

const SelectableOption: React.FC<{
  onSelect: (option: string) => void;
  onCloseModal: () => void;
  modalState: boolean;
}> = (props) => {
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.modalState}
        // onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalContainer,
              //   dark && { backgroundColor: COLORS.black },
            ]}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={props.onCloseModal}
                style={[
                  styles.closeModalButtom,
                  //   dark && { backgroundColor: COLORS.white },
                ]}
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
              {serviceTypes.map((item) => (
                <ServiceTypeOption
                  key={item.id}
                  text={item.name}
                  onClickHandler={props.onSelect}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SelectableOption;

const styles = StyleSheet.create({
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
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
