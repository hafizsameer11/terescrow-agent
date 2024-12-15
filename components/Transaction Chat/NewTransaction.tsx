import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS, icons } from '@/constants';
import SellGiftCardInputs from './SellGiftCardInputs';
import BuyCrypto from './BuyCrypto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getDepartments,
  getSubCategories,
  ICategoryResponse,
  IDepartmentResponse,
} from '@/utils/queries/commonQueries';
import { useAuth } from '@/contexts/authContext';
import CustomSelect from '../CustomSelect';
import InputField from './InputField';
import {
  createCardTransaction,
  createCryptoTransaction,
} from '@/utils/mutations/agentMutations';
import { showTopToast } from '@/utils/helpers';
import { ApiError } from '@/utils/customApiCalls';
import { Formik } from 'formik';
import { validationNewTransaction } from '../Validation';
import Input from '../CustomInput';
import LoadingOverlay from '../LoadingOverlay';
import { ICategory, IDepartment } from '@/utils/queries/agentQueries';
import StaticInput from '../StaticInput';

type Proptypes = {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  currChatId?: number;
  currDepartment?: IDepartment;
  currCategory?: ICategory;
};

const cardTypesData = [
  { id: 1, title: 'E-code' },
  { id: 2, title: 'Physical Card' },
];

const NewTransaction: React.FC<Proptypes> = ({
  visibility,
  setVisibility,
  currChatId,
  currDepartment,
  currCategory,
}) => {
  // const [modalVisibility, setModalVisible] = useState(true);
  const { token, userData } = useAuth();
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const resetButtonRef = useRef<typeof TouchableOpacity>(null);
  const queryClient = useQueryClient();

  // const {
  //   data: departmentsData,
  //   isLoading: departmentsLoading,
  //   isError: isDepartmentsError,
  //   error: departmentsError,
  // } = useQuery({
  //   queryKey: ['all-departments'],
  //   queryFn: () => getDepartments(token),
  // });

  // const {
  //   data: categoriesData,
  //   isLoading: categoriesLoading,
  //   isError: isCategoriesError,
  //   error: categoriesError,
  // } = useQuery({
  //   queryKey: [selectedDepartmentId, 'categories'],
  //   queryFn: () => getCategories(token, selectedDepartmentId),
  //   enabled: !!selectedDepartmentId,
  // });

  const {
    data: subcategoriesData,
    isLoading: isLoadingSubcategories,
    isError: isErrorSubcategories,
    error: errorSubcategories,
  } = useQuery({
    queryKey: [currDepartment?.id, currCategory?.id, 'subcategories'],
    queryFn: () =>
      getSubCategories(
        token,
        currDepartment?.id.toString()!,
        currCategory?.id.toString()!
      ),
    enabled: !!currDepartment?.id && !!currCategory?.id,
  });

  const { mutate: cryptoTrasaction, isPending: isCryptoTransactionPending } =
    useMutation({
      mutationKey: ['create-crypto-transaction'],
      mutationFn: createCryptoTransaction,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['customer-chat-details'] });
        queryClient.refetchQueries({ queryKey: ['customer-chat-details'] });
        showTopToast({
          type: 'success',
          text1: 'Success',
          text2: data?.message || 'Transaction Completed successfully',
        });
        closeModal();
      },
      onError: (error: ApiError) => {
        showTopToast({
          type: 'error',
          text1: 'Error',
          text2: error?.message || 'Failed to create transaction',
        });
      },
    });
  const { mutate: cardTrasaction, isPending: isCardTransactionPending } =
    useMutation({
      mutationKey: ['create-card-transaction'],
      mutationFn: createCardTransaction,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['customer-chat-details'] });
        showTopToast({
          type: 'success',
          text1: 'Success',
          text2: data?.message || 'Transaction Completed successfully',
        });
        closeModal();
      },
      onError: (error: ApiError) => {
        showTopToast({
          type: 'error',
          text1: 'Error',
          text2: error?.message || 'Failed to create transaction',
        });
      },
    });

  const closeModal = () => {
    setSelectedSubCategoryId('');
    setVisibility(false);
  };

  // const setDepartmentValue = (field: string, id: string) => {
  //   if (id.toString() == selectedDepartmentId) return;
  //   setSelectedDepartmentId(id.toString());
  //   setSelectedCategoryId('');
  //   setSelectedSubCategoryId('');
  // };
  // const setCategoryValue = (field: string, id: string) => {
  //   if (id.toString() == selectedCategoryId) return;
  //   setSelectedCategoryId(id.toString());
  //   setSelectedSubCategoryId('');
  // };

  const setSubCategoryValue = (field: string, id: string) => {
    // if (id.toString() == selectedSubCategoryId) return;
    setSelectedSubCategoryId(id.toString());
  };

  // const selectCurrDepartment = (field: string, id: string) => {
  //   if (id.toString() == selectedDepartmentId) return;
  //   setSelectedDepartmentId(id.toString());
  //   setSelectedCategoryId('');
  //   setSelectedSubcategoryId('');
  // };
  // const selectCurrCategory = (field: string, id: string) => {
  //   if (id.toString() == selectedCategoryId) return;
  //   setSelectedCategoryId(id.toString());
  //   setSelectedSubcategoryId('');
  // };

  // const selectCurrSubCategory = (field: string, id: string) => {
  //   console.log(id);
  //   setSelectedSubcategoryId(id.toString());
  // };

  return (
    <>
      <Modal animationType="fade" transparent={true} visible={visibility}>
        <LoadingOverlay
          visible={isCryptoTransactionPending || isCardTransactionPending}
        />
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
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                New Transaction
              </Text>
            </View>
            <Formik
              // validationSchema={validationNewTransaction}
              initialValues={{
                countryId: '',
                // customerId: '',
                amount: '',
                exchangeRate: '',
                amountNaira: ' ',
                cryptoAmount: '',
                toAddress: '',
                fromAddress: '',
                cardType: '',
                cardNumber: '',
              }}
              onSubmit={(values) => {
                console.log(values);
                if (
                  !currCategory ||
                  !currDepartment ||
                  !currChatId ||
                  !userData?.id
                )
                  return;
                const compulsoryData = {
                  amount: +values.amount,
                  exchangeRate: +values.exchangeRate,
                  amountNaira: +values.amountNaira,
                  subCategoryId: +selectedSubCategoryId,
                  countryId: 2,
                  chatId: +currChatId,
                };
                if (+currDepartment.id > 2) {
                  cryptoTrasaction({
                    data: {
                      ...compulsoryData,
                      cryptoAmount: +values.cryptoAmount,
                      fromAddress: values.fromAddress,
                      toAddress: values.toAddress,
                    },
                    token,
                  });
                } else {
                  cardTrasaction({
                    data: {
                      ...compulsoryData,
                      cardType: values.cardType,
                      cardNumber: values.cardNumber,
                    },
                    token,
                  });
                }
              }}
            >
              {({
                values,
                setFieldValue,
                handleChange,
                handleBlur,
                handleReset,
                handleSubmit,
                touched,
                errors,
              }) => {
                return (
                  <>
                    <ScrollView style={styles.body}>
                      {currDepartment && (
                        <StaticInput
                          label="Department"
                          text={currDepartment.title}
                        />
                      )}

                      {currCategory && (
                        <StaticInput
                          label="Category"
                          text={currCategory.title}
                        />
                      )}

                      {currCategory &&
                        currDepartment &&
                        (subcategoriesData?.data ? (
                          <CustomSelect
                            key={'subCategoryId'}
                            id="subCategoryId"
                            currValue={selectedSubCategoryId}
                            options={[
                              ...subcategoriesData?.data.subCategories,
                            ].map((item) => ({
                              id: item.subCategory.id,
                              title: item.subCategory.title,
                            }))}
                            modalLabel="Select SubCategory"
                            placeholder="-Select Subcategory-"
                            setFieldValue={setSubCategoryValue}
                            // error={errors.subCategoryId}
                          />
                        ) : isLoadingSubcategories ? (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.primary}
                          />
                        ) : isErrorSubcategories ? (
                          <Text style={{ color: 'red' }}>
                            {errorSubcategories.message}
                          </Text>
                        ) : null)}

                      {currCategory &&
                        currDepartment &&
                        selectedSubCategoryId && (
                          <>
                            <Input
                              label="Amount in Dollars"
                              id="amount"
                              value={values.amount}
                              keyboardType="numeric"
                              // placeholder="Enter amount in dollars"
                              onChangeText={(text: string) => {
                                setFieldValue('amount', text);
                                setFieldValue(
                                  'amountNaira',
                                  (+text * +values.exchangeRate)
                                    .toFixed(2)
                                    .toString()
                                );
                              }}
                              onBlur={handleBlur('amountInDollars')}
                              errorText={
                                touched.amount ? errors.amount : undefined
                              }
                              readOnly={!values.exchangeRate}
                            />
                            <Input
                              id="exchangeRate"
                              label="Exchange Rate (Naira per Dollar)"
                              value={values.exchangeRate} // Controlled value
                              onChangeText={handleChange('exchangeRate')}
                              // placeholder="Enter exchange rate"
                              errorText={
                                touched.exchangeRate
                                  ? errors.exchangeRate
                                  : undefined
                              }
                              keyboardType="numeric"
                            />

                            <Input
                              id="amountNaira"
                              label="Amount in Naira"
                              value={values.amountNaira}
                              onChangeText={handleChange('amountNaira')}
                              // placeholder="Amount in Naira"
                              keyboardType="numeric"
                              errorText={
                                touched.amountNaira
                                  ? errors.amountNaira
                                  : undefined
                              }
                              readOnly
                            />
                            {+currDepartment.id < 3 ? (
                              <>
                                <CustomSelect
                                  currValue={values.cardType}
                                  options={cardTypesData}
                                  id="cardType"
                                  modalLabel="Card Type"
                                  placeholder="-Select Card Type-"
                                  setFieldValue={setFieldValue}
                                />

                                <Input
                                  id="cardNumber"
                                  value={values.cardNumber}
                                  onChangeText={handleChange('cardNumber')}
                                  onBlur={handleBlur('cardNumber')}
                                  label="Card Number"
                                  // placeholder="Enter card number"
                                  errorText={
                                    touched.cardNumber
                                      ? errors.cardNumber
                                      : undefined
                                  }
                                  keyboardType="numeric"
                                />
                              </>
                            ) : (
                              <>
                                <Input
                                  id="cryptoAmount"
                                  value={values.cryptoAmount}
                                  onChangeText={handleChange('cryptoAmount')}
                                  onBlur={handleBlur('cryptoAmount')}
                                  label="Crypto Amount"
                                  // placeholder="Enter crypto amount"
                                  errorText={
                                    touched.cryptoAmount
                                      ? errors.cryptoAmount
                                      : undefined
                                  }
                                  keyboardType="numeric"
                                />
                                <Input
                                  id="fromAddress"
                                  value={values.fromAddress}
                                  onChangeText={handleChange('fromAddress')}
                                  onBlur={handleBlur('fromAddress')}
                                  label="From Address"
                                  // placeholder="Enter from address"
                                  errorText={
                                    touched.fromAddress
                                      ? errors.fromAddress
                                      : undefined
                                  }
                                  keyboardType="default"
                                />
                                <Input
                                  id="toAddress"
                                  value={values.toAddress}
                                  onChangeText={handleChange('toAddress')}
                                  onBlur={handleBlur('toAddress')}
                                  label="To Address"
                                  // placeholder="Enter to address"
                                  keyboardType="default"
                                  errorText={
                                    touched.toAddress
                                      ? errors.toAddress
                                      : undefined
                                  }
                                />
                              </>
                            )}
                          </>
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                      <TouchableOpacity
                        onPress={handleSubmit as any}
                        style={styles.button}
                        disabled={
                          isCardTransactionPending || isCryptoTransactionPending
                        }
                      >
                        {<Text style={styles.buttonText}>Continue</Text>}
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        ref={resetButtonRef}
                        onPress={handleReset as any}
                        style={{ display: 'none' }}
                      ></TouchableOpacity> */}
                    </View>
                  </>
                );
              }}
            </Formik>
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
    flex: 1,
    backgroundColor: 'white',
    width: '93%',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  header: {
    width: '100%',
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
    alignItems: 'flex-end',
    borderRadius: 50,
  },
  closeIcon: {
    width: 25,
    height: 25,
    tintColor: COLORS.black,
  },
});
