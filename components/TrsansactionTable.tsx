import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { Image } from "expo-image";
import { COLORS, icons } from "@/constants";
import { Transaction } from "@/utils/queries/datainterfaces";
import { ScrollView } from "react-native-gesture-handler";

interface TransactionTableProps {
  data: Transaction[];
  darkMode?: boolean;
  isShown: boolean;
  userRole: string;
  onMenuToggle: (index: number) => void;
  onTransactionDetails: (id: number, transaction: Transaction) => void;
  menuVisible: number | null;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  data,
  darkMode = false,
  isShown,
  userRole,
  onMenuToggle,
  onTransactionDetails,
  menuVisible,
}) => {
  const getStatusBgColor = (status: string) => {
    if (status === "pending") return COLORS.warning;
    if (status === "successfull") return COLORS.primary;
    if (status === "failed") return COLORS.red;
    return COLORS.transparentWhite;
  };

  const handleCustomerDetails = (customerId: string) => {
    // Implement navigation or customer details logic here
    console.log("View customer details for:", customerId);
  };

  return (
    <ScrollView horizontal style={{ overflowX: 'scroll', overflowY: 'visible' }}>
      <DataTable style={styles.table}>
        {/* Table Header */}
        <DataTable.Header
          style={[styles.tableHeader, darkMode && styles.darkHeader]}
        >
          <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
            Name
          </DataTable.Title>
          <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
            Status
          </DataTable.Title>
          <DataTable.Title style={[styles.headerCell, { width: 150 }]}>
            Department
          </DataTable.Title>
          <DataTable.Title style={[styles.headerCell, { width: 100 }]}>
            Amount
          </DataTable.Title>
          <DataTable.Title style={[styles.headerCell, { width: 120 }]}>
            Date
          </DataTable.Title>
        </DataTable.Header>

        {/* Table Rows */}
        {data.map((item, index) => (
          <DataTable.Row key={index} style={styles.tableRow}>
            <DataTable.Cell style={{ width: 120 }}>
              {item.customer?.username}
            </DataTable.Cell>
            <DataTable.Cell style={{ width: 100 }}>
              <Text
                 style={{
                                      // backgroundColor:
                                      //   item.status === "pending"
                                      //     ? COLORS.warning
                                      //     : item.status === "successfull"
                                      //       ? COLORS.primary
                                      //       : COLORS.red,
                                      backgroundColor:COLORS.primary,
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
              {item.department?.niche} {item.department?.Type}
            </DataTable.Cell>
            <DataTable.Cell style={{ width: 100 }}>
              {item.amount}
            </DataTable.Cell>
            <DataTable.Cell style={{ width: 120 }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </DataTable.Cell>
            <DataTable.Cell>
              <View style={styles.actionCell}>
                <TouchableOpacity onPress={() => onMenuToggle(index)}>
                  <Image
                    source={icons.threeDots}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: darkMode ? COLORS.white : COLORS.black,
                    }}
                  />
                </TouchableOpacity>
                {menuVisible === index && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      { backgroundColor: darkMode ? COLORS.dark2 : COLORS.white },
                    ]}
                  >
                    {/* {isShown && userRole === "admin" && (
                      <TouchableOpacity
                        style={[styles.dropdownItem]}
                        onPress={() =>
                          handleCustomerDetails(item.customer?.id.toString())
                        }
                      >
                        <Text
                          style={{
                            color: darkMode ? COLORS.white : COLORS.black,
                          }}
                        >
                          View Customer Details
                        </Text>
                      </TouchableOpacity>
                    )} */}
                    <TouchableOpacity
                      style={[styles.dropdownItem]}
                      onPress={() => onTransactionDetails(item.id, item)}
                    >
                      <Text
                        style={{
                          color: darkMode ? COLORS.white : COLORS.black,
                        }}
                      >
                        View Transaction Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
};

export default TransactionTable;

const styles = StyleSheet.create({
  table: {
    marginTop: 20,
  },
  tableHeader: {
    backgroundColor: COLORS.grayscale200,
  },
  darkHeader: {
    backgroundColor: COLORS.dark2,
  },
  headerCell: {
    fontWeight: "bold",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  actionCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: -20,
    right: 40,
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
