import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import FilterModal from '@/components/FilterModal';
import { COLORS, icons } from '@/constants';
import { useTheme } from '@/contexts/themeContext';
import { useQuery } from '@tanstack/react-query';
import { getRate } from '@/utils/queries/adminQueries';
import { token } from '@/utils/apiConfig';

const Rates = () => {
  const { dark } = useTheme();
  const [activeBtn, setActiveBtn] = useState('giftCardsRate');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: ratesData, isLoading } = useQuery({
    queryKey: ['ratesData'],
    queryFn: () => getRate({ token }),
    enabled: !!token,
  });

  const handlePressModal = () => setIsModalVisible(!isModalVisible);
  const handlePress = (btn: string) => setActiveBtn(btn);
  const getdatefromtimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const gettimefromtimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };
  const renderRow = (item: any, index: number) => (
    <View key={index} style={tableHeader.row}>
      <Text style={[tableHeader.cell, textColor]}>{getdatefromtimestamp(item.createdAt)}</Text>
      <Text style={[tableHeader.cell, textColor]}>{gettimefromtimestamp(item.createdAt)}</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.rate}/1$</Text>
      <Text style={[tableHeader.cell, textColor]}>{item.agent}</Text>
      {/* <Text style={[tableHeader.cell, textColor]}>₦{item.rate}</Text> */}
      {/* <Text style={[tableHeader.cell, textColor]}>Paid</Text> */}
      <Text style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        <Text style={[tableHeader.cell, textColor]}>$ {item.amount} </Text>

        <Text>
          <Text style={[tableHeader.cell, { color: COLORS.gray, fontSize: 12 }]}>- ₦{item.amountNaira}</Text>
        </Text>
      </Text>
      {/* </Text> */}
      {/* <View style={[tableHeader.actionCell]}>
        <TouchableOpacity>
          <Image source={icons.edit} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.trash} style={styles.actionIcon} />
        </TouchableOpacity>
      </View> */}
    </View>
  );

  const textColor = { color: dark ? COLORS.white : COLORS.black };

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
            Rates
          </Text>

        </View>

        {/* <View style={styles.headerButtonsContainer}>
          <TouchableOpacity
            onPress={() => handlePress('giftCardsRate')}
            style={[styles.button, activeBtn === 'giftCardsRate' && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: activeBtn === 'giftCardsRate' ? COLORS.white : textColor.color,
                },
              ]}
            >
              Gift Card Rate
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress('cryptoRate')}
            style={[styles.button, activeBtn === 'cryptoRate' && styles.activeButton]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: activeBtn === 'cryptoRate' ? COLORS.white : textColor.color,
                },
              ]}
            >
              Crypto Rate
            </Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView horizontal>
          <View>
            <View style={[tableHeader.headerRow, { backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale200 }]}>
              {['Date', 'Time', 'Rate', 'Logged By', 'Amount'].map((header, idx) => (
                <Text key={idx} style={[tableHeader.headerCell, textColor]}>{header}</Text>
              ))}
            </View>

            <ScrollView style={tableHeader.tableBody}>
              {ratesData?.data?.map((item, index) => renderRow(item, index))}
            </ScrollView>
          </View>
        </ScrollView>

        <FilterModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </ScrollView>
    </View>
  );
};

export default Rates;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { paddingHorizontal: 13 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  headerButtonsContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 10, backgroundColor: 'transparent' },
  activeButton: { backgroundColor: COLORS.primary, borderRadius: 10 },
  buttonText: { fontWeight: 'bold' },
  filterIconContainer: { borderWidth: 1, padding: 10, borderRadius: 10 },
  filterIcon: { width: 20, height: 20 },
  customBtn: { borderRadius: 10, backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary },
  actionIcon: { width: 20, height: 20, marginHorizontal: 5 },
});

const tableHeader = StyleSheet.create({
  headerRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, backgroundColor: COLORS.grayscale200 },
  headerCell: { fontWeight: 'bold', flex: 1, paddingHorizontal: 10, textAlign: 'center', width: 120 },
  tableBody: { maxHeight: '85%', paddingTop: 10 },
  row: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  cell: { flex: 1, paddingHorizontal: 10, textAlign: 'center' },
  actionCell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
