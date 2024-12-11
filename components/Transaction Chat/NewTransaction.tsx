import { useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import SellGiftCardInputs from "./SellGiftCardInputs";
import BuyCrypto from "./BuyCrypto";

const NewTransaction: React.FC<{ selectedService: string }> = (props) => {
  const [modalVisibility, setModalVisible] = useState(true);
  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <>
      <Modal animationType="fade" transparent={true} visible={modalVisibility}>
        <View style={styles.overlay}>
          <View style={[styles.modalContainer]}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={closeModal}
                style={[styles.closeModalButtom]}
              >
                <Image source={[icons.close2]} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                New Transaction
              </Text>
            </View>
            <View style={styles.body}>
              {props.selectedService === "Sell - Gift Card" ? (
                <SellGiftCardInputs selectedService={props.selectedService} />
              ) : (
                <BuyCrypto selectedService={props.selectedService} />
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={closeModal} style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default NewTransaction;

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "93%",
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  header: {
    width: "100%",
  },
  body: {
    flex: 1,
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
    alignItems: "flex-end",
    borderRadius: 50,
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: COLORS.black,
  },
});
