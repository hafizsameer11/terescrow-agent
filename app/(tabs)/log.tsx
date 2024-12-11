import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import Button from '@/components/Button';
import FilterModal from '@/components/FilterModal';
import FullTransactionModal from '@/components/TransactionDetailModal';
import { transactionsData } from '@/utils/usersData';
import FullEditTransactionModal from '@/components/FullEditTransactionModal';

const dummyData = Array(15).fill({
  id: uuid.v4(),
  name: 'Razer Gold',
  location: 'United States',
  type: 'E-Code',
  amountUSD: '$100',
  amountNGN: 'NGN170,000',
  profit: 'NGN3,000',
  paid: 'NGN,000',
  loggedBy: 'Dave',
});

const Log = () => {
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState('giftCard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [editTransactionModalVisible, setEditTransactionModalVisible] =
    useState(false);

  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const handleMenuToggle = (index: number) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const handleEditTransactionModal = () =>
    setEditTransactionModalVisible(!editTransactionModalVisible);

  const handleTransactionModal = () =>
    setTransactionModalVisible(!transactionModalVisible);
  const handlePressModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePress = (btn: string) => {
    setActiveBtn(btn);
  };

  const renderRow = (item: (typeof dummyData)[0], index: number) => (
    <View style={tableHeader.row} key={index}>
      <View style={tableHeader.nameLocationCell}>
        <Text style={[tableHeader.cell, textColor]}>{item.name}</Text>
        <Text style={tableHeader.location}>{item.location}</Text>
      </View>
      <Text style={[tableHeader.cell, textColor]}>{item.type}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.amountUSD}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.amountNGN}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.profit}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.paid}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.loggedBy}</Text>
      <View style={tableHeader.actionCell}>
        <TouchableOpacity onPress={() => handleMenuToggle(index)}>
          <Image
            source={icons.threeDots}
            style={{
              width: 20,
              height: 20,
              marginBottom: 17,
              marginRight: 13,
              tintColor: dark ? COLORS.white : COLORS.black,
            }}
          />
        </TouchableOpacity>
        {menuVisible === index && (
          <View
            style={[
              tableHeader.dropdownMenu,
              { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
            ]}
          >
            <TouchableOpacity
              style={[tableHeader.dropdownItem]}
              onPress={handleEditTransactionModal}
            >
              <Text style={textColor}>Edit Log</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[tableHeader.dropdownItem]}
              onPress={handleTransactionModal}
            >
              <Text style={textColor}>View Transaction Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[tableHeader.dropdownItem]}>
              <Text style={{ color: 'red' }}>Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.headerText,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Log Card
          </Text>
          <View style={[styles.headerButtonsContainer, { gap: 10 }]}>
            <Button
              title="Log New Card"
              style={[styles.customBtn, { height: 45 }]}
              fontSize={13}
            />
            <View
              style={[
                styles.filterIconContainer,
                {
                  borderColor: dark ? COLORS.dark3 : COLORS.gray,
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                },
              ]}
            >
              <TouchableOpacity onPress={handlePressModal}>
                <Image
                  source={icons.filter}
                  style={[
                    styles.filterIcon,
                    { tintColor: dark ? COLORS.white : COLORS.black },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.headerButtonsContainer,
            { borderColor: dark ? COLORS.dark2 : '#ccc', borderWidth: 1 },
          ]}
        >
          <TouchableOpacity
            onPress={() => handlePress('giftCard')}
            style={[
              styles.button,
              activeBtn === 'giftCard' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === 'giftCard'
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Gift Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('crypto')}
            style={[
              styles.button,
              activeBtn === 'crypto' && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    activeBtn === 'crypto'
                      ? COLORS.white
                      : dark
                      ? COLORS.white
                      : COLORS.black,
                },
              ]}
            >
              Crypto
            </Text>
          </TouchableOpacity>
        </View>
        <FilterModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </ScrollView>
      <ScrollView horizontal>
        <View>
          <View
            style={[
              tableHeader.headerRow,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale200,
                borderColor: dark ? COLORS.dark2 : '#ccc',
              },
            ]}
          >
            <Text style={[tableHeader.headerCell, textColor]}>Name</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Type</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Amount ($)</Text>
            <Text style={[tableHeader.headerCell, textColor]}>
              Amount (NGN)
            </Text>
            <Text style={[tableHeader.headerCell, textColor]}>Profit</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Paid</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Logged by</Text>
            <Text style={[tableHeader.headerCell, textColor]}>Actions</Text>
          </View>
          <ScrollView style={tableHeader.tableBody}>
            {dummyData.map((item, index) => renderRow(item, index))}
          </ScrollView>
        </View>
        <FullTransactionModal
          visible={transactionModalVisible}
          onClose={() => setTransactionModalVisible(false)}
          transactionId={transactionsData[0].id}
        />
        <FullEditTransactionModal
          visible={editTransactionModalVisible}
          onClose={() => setEditTransactionModalVisible(false)}
          transactionId={transactionsData[0].id}
        />
      </ScrollView>
    </View>
  );
};

export default Log;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 13,
    marginBottom: 40,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    marginVertical: 15,
  },
  customBtn: {
    borderRadius: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
    top: 5,
    paddingRight: 10,
  },
  filterIconContainer: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
});

const tableHeader = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: 'bold',
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: '85%',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  actionCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  location: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
    paddingLeft: 13,
  },
  nameLocationCell: {
    flex: 1,
    flexDirection: 'column',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 30,
    right: 20,
    elevation: 5,
    borderRadius: 5,
    padding: 10,
    width: 200,
    zIndex: 200,
  },
  dropdownItem: {
    padding: 10,
  },
});
