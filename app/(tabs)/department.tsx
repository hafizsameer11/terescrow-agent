import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS, icons } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/themeContext';
import Box from '@/components/DashboardBox';
import RecentChats from '@/components/RecentChats';
import Button from '@/components/Button';
import { getDepartments, getDepartmentStats } from '@/utils/queries/adminQueries';
import { useQuery } from '@tanstack/react-query';
import { token } from '@/utils/apiConfig';
import { DepartmentResponse } from '@/utils/queries/datainterfaces';
import { DataTable } from 'react-native-paper';
import { useAuth } from '@/contexts/authContext';
export interface Department {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  status?: string;
  noOfAgents?: number;
  createdAt?: string;
  updatedAt?: string;
}
const getRandomStatus = () => {
  const statuses = ['active', 'offline'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};
export default function Department() {
  const [query, setQuery] = useState('');
  const { dark } = useTheme();
  const [filteredData, setFilteredData] = useState<DepartmentResponse['data']>(
    []
  );
  const textColor = {
    color: dark ? COLORS.white : COLORS.black,
  };
  const { token, userData } = useAuth();


  const {
    data: departmentsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['departmentsData'],
    queryFn: () => getDepartments({ token }),
    enabled: !!token,
  });
  useEffect(() => {
    if (departmentsData?.data) {
      setFilteredData(departmentsData.data);
    }
  }, [departmentsData]);
  console.log('Inside the Deaprtment', departmentsData);

  const {
    data: departmentStats,
    isLoading: customerStatsLoading,
    isError: isCustomerStatsError,
    error: customerStatsError,
  } = useQuery({
    queryKey: ['departmentStats'],
    refetchInterval: 30000,
    queryFn: () => getDepartmentStats(token),
    enabled: !!token && userData?.role === 'admin',
  });
  useEffect(() => {
    console.log('customerStats', departmentStats);
  }, [departmentStats]);
    const getStatusBgColor = (status: string) => {
      if (!status) return COLORS.transparentWhite;
      if (status === 'active') return COLORS.primary;
      if (status === 'inactive') return COLORS.warning;
      return COLORS.transparentWhite;
    };
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text === '') {
      setFilteredData(departmentsData?.data || []);
    } else {
      const filterData = departmentsData?.data.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filterData || []);
    }
  };
  // const renderRow = (
  //   item: DepartmentResponse['data'][number],
  //   index: number
  // ) => {
  //   const getStatusBgColor = (status: string) => {
  //     if (!status) return COLORS.transparentWhite;
  //     if (status === 'active') return COLORS.primary;
  //     if (status === 'inactive') return COLORS.warning;
  //     return COLORS.transparentWhite;
  //   };
  //   return (
  //     <View style={tableHeader.row} key={index}>
  //       <View style={[tableHeader.cell, tableHeader.nameCell]}>
  //         <Image
  //           source={icons.bitCoin}
  //           style={{
  //             width: 20,
  //             height: 20,
  //             tintColor: dark ? COLORS.white : COLORS.black,
  //           }}
  //         />
  //         <Text style={[{ marginLeft: 8 }, textColor]}>{item.title}</Text>
  //       </View>
  //       <Text
  //         style={[
  //           tableHeader.cell,
  //           {
  //             backgroundColor: getStatusBgColor(item?.status!),
  //             borderRadius: 5,
  //             color: COLORS.white,
  //             paddingVertical: 5,
  //             paddingHorizontal: 1,
  //           },
  //         ]}
  //       >
  //         {item.status}
  //       </Text>
  //       <Text style={[tableHeader.cell, textColor]}>{item.noOfAgents}</Text>
  //       <Text style={[tableHeader.cell, textColor]}>{item.description}</Text>
  //       <View style={[tableHeader.actionCell, tableHeader.nameCell]}>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View
      style={[
        styles.safeArea,
        { backgroundColor: dark ? COLORS.dark1 : COLORS.transparentWhite },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Department
          </Text>
        </View>
        <View>
          {departmentStats?.data &&
            departmentStats.data.map((item, index) => {
              // Check if it's the start of a new row (every 2 items)
              if (index % 2 === 0) {
                return (
                  <View style={styles.row} key={`row-${index}`}>
                    <Box
                      title={departmentStats.data[index]?.departmentName || 'Unknown'}
                      value={`$${departmentStats.data[index]?.amount || 0}`}
                      percentage={7} // Replace with actual percentage if needed
                      condition
                    />
                    {/* Render second item in the same row if it exists */}
                    {departmentStats.data[index + 1] && (
                      <Box
                        title={
                          departmentStats.data[index + 1]?.departmentName || 'Unknown'
                        }
                        value={`$${departmentStats.data[index + 1]?.amount || 0}`}
                        percentage={5} // Replace with actual percentage if needed
                        condition
                      />
                    )}
                  </View>
                );
              }
              return null; // Skip rendering for odd indices as they are handled in the row
            })}
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              borderColor: dark ? COLORS.dark3 : COLORS.gray,
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Image
              source={icons.search}
              style={[
                styles.icon,
                { tintColor: dark ? COLORS.white : COLORS.black },
              ]}
            />
          </View>
          <TextInput
            style={[
              styles.searchBar,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
            placeholder="Search"
            placeholderTextColor={dark ? COLORS.white : COLORS.black}
            value={query}
            onChangeText={handleSearch}
          />
        </View>
        {/* <ScrollView horizontal>
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
              <Text style={[tableHeader.headerCell, textColor]}>
                Department Name
              </Text>
              <Text
                style={[tableHeader.headerCell, textColor, { width: '25%' }]}
              >
                Status
              </Text>
              <Text style={[tableHeader.headerCell, textColor]}>
                No of Agents
              </Text>
              <Text style={[tableHeader.headerCell, textColor]}>
                Description
              </Text>
            </View>

            <ScrollView style={tableHeader.tableBody}>
              {filteredData.map((item, index) => renderRow(item, index))}
            </ScrollView>
          </View>
        </ScrollView> */}
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            {/* Table Header */}
            <DataTable.Header style={[styles.tableHeader, dark && styles.darkHeader]}>
              <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
                Name
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
                Status
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
                No of Agents
              </DataTable.Title>
              <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
                Type
              </DataTable.Title>

            </DataTable.Header>

            {/* Table Rows */}
            {/* {!isLoading && } */}
            {!isLoading && filteredData && filteredData?.map((item, index) => (
              <DataTable.Row key={index} style={[styles.tableRow, { position: "relative" }]}>
                <DataTable.Cell style={{ width: 120 }}>
                  {item.title}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  <Text
                    style={{
                      backgroundColor:
                      getStatusBgColor(item?.status!),
                      color: COLORS.white,
                      textAlign: "center",
                      borderRadius: 5,
                      padding: 4,
                    }}
                  >
                    {item.status}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 150 }}>
                  {item.noOfAgents}
                </DataTable.Cell>
                <DataTable.Cell style={{ width: 100 }}>
                  {item.Type}
                </DataTable.Cell>

              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  table: {
    marginTop: 20,
  },
  tableHeader: {
    backgroundColor: COLORS.grayscale200,
  },
  safeArea: {
    flex: 1,
  },
  darkHeader: {
    backgroundColor: COLORS.dark2,
  },
  headerCell: {
    // fontWeight: "bold",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    left: 15,
    top: 12,
    paddingRight: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    marginBottom: 300,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
  },
  searchContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchBar: {
    height: 40,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  boxContainer: {
    padding: 15,
  },
  iconButton: {
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  icon: {
    width: 16,
    height: 16,
  },
});

const tableHeader = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  nameCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
    paddingRight: 100,
    backgroundColor: COLORS.grayscale200,
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
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
