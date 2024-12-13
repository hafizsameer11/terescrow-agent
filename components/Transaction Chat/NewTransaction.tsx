import { useEffect, useRef, useState } from 'react';
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

type Proptypes = {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
};

const cardTypesData = [
  { id: 1, title: 'E-code' },
  { id: 2, title: 'Physical Card' },
];

const NewTransaction: React.FC<Proptypes> = ({ visibility, setVisibility }) => {
  // const [modalVisibility, setModalVisible] = useState(true);
  const { token } = useAuth();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const resetButtonRef = useRef<typeof TouchableOpacity>(null);
  const queryClient = useQueryClient();

  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isError: isDepartmentsError,
    error: departmentsError,
  } = useQuery({
    queryKey: ['all-departments'],
    queryFn: () => getDepartments(token),
  });

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useQuery({
    queryKey: [selectedDepartmentId, 'categories'],
    queryFn: () => getCategories(token, selectedDepartmentId),
    enabled: !!selectedDepartmentId,
  });

  const {
    data: subcategoriesData,
    isLoading: isLoadingSubcategories,
    isError: isErrorSubcategories,
    error: errorSubcategories,
  } = useQuery({
    queryKey: [selectedDepartmentId, selectedCategoryId, 'subcategories'],
    queryFn: () =>
      getSubCategories(token, selectedDepartmentId, selectedCategoryId),
  });

  const { mutate: cryptoTrasaction, isPending: isCryptoTransactionPending } =
    useMutation({
      mutationKey: ['create-crypto-transaction'],
      mutationFn: createCryptoTransaction,
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
    setSelectedDepartmentId('');
    setSelectedCategoryId('');
    setVisibility(false);
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
          visible={
            isCryptoTransactionPending ||
            isCardTransactionPending ||
            departmentsLoading
          }
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
              validationSchema={validationNewTransaction}
              initialValues={{
                departmentId: '',
                categoryId: '',
                subCategoryId: '',
                countryId: '',
                customerId: '',
                amount: '',
                exchangeRate: '',
                amountNaira: '',
                cryptoAmount: '',
                toAddress: '',
                fromAddress: '',
                cardType: '',
                cardNumber: '',
              }}
              onSubmit={(values) => {
                const compulsoryData = {
                  amount: +values.amount,
                  exchangeRate: +values.exchangeRate,
                  amountNaira: +values.amountNaira,
                  categoryId: +values.categoryId,
                  countryId: +values.countryId,
                  customerId: +values.customerId,
                  departmentId: +values.departmentId,
                  subCategoryId: +values.subCategoryId,
                };
                if (+values.departmentId > 2) {
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
                if (
                  selectedDepartmentId &&
                  values.departmentId !== selectedDepartmentId
                ) {
                  setSelectedDepartmentId(values.departmentId);
                  // setSelectedCategoryId('');
                  setFieldValue('categoryId', '');
                  setFieldValue('subCategoryId', '');
                }

                if (
                  selectedCategoryId &&
                  selectedDepartmentId &&
                  values.categoryId !== selectedCategoryId
                ) {
                  setFieldValue('subCategoryId', '');
                }
                setSelectedDepartmentId(values.departmentId);
                setSelectedCategoryId(values.categoryId);

                if (values.amount && values.exchangeRate) {
                  setFieldValue(
                    'amountNaira',
                    (Number(values.amount) * Number(values.exchangeRate))
                      .toFixed(2)
                      .toString()
                  );
                }
                return (
                  <>
                    <ScrollView style={styles.body}>
                      {departmentsData?.data && (
                        <CustomSelect
                          key={'department'}
                          currValue={values.departmentId}
                          options={[...departmentsData?.data].map((item) => ({
                            id: item.id,
                            title: item.title,
                          }))}
                          id="departmentId"
                          modalLabel="Select Department"
                          placeholder="-Select department-"
                          setFieldValue={setFieldValue}
                          error={errors.departmentId}
                        />
                      )}
                      {values.departmentId && categoriesData?.data ? (
                        <CustomSelect
                          key={'categoryId'}
                          id="categoryId"
                          currValue={values.categoryId}
                          options={[...categoriesData?.data.categories].map(
                            (item) => ({
                              id: item.category.id,
                              title: item.category.title,
                            })
                          )}
                          modalLabel="Select Category"
                          placeholder="-Select category-"
                          setFieldValue={setFieldValue}
                          error={errors.categoryId}
                        />
                      ) : categoriesLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={COLORS.primary}
                        />
                      ) : isCategoriesError ? (
                        <Text style={{ color: 'red' }}>
                          {categoriesError.message}
                        </Text>
                      ) : null}
                      {values.departmentId &&
                        values.categoryId &&
                        (subcategoriesData?.data ? (
                          <CustomSelect
                            key={'subCategoryId'}
                            id="subCategoryId"
                            currValue={values.subCategoryId}
                            options={[
                              ...subcategoriesData?.data.subCategories,
                            ].map((item) => ({
                              id: item.subCategory.id,
                              title: item.subCategory.title,
                            }))}
                            modalLabel="Select SubCategory"
                            placeholder="-Select Subcategory-"
                            setFieldValue={setFieldValue}
                            error={errors.subCategoryId}
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

                      {values.departmentId &&
                        values.categoryId &&
                        values.subCategoryId && (
                          <>
                            <Input
                              label="Amount in Dollars"
                              id="amount"
                              value={values.amount}
                              placeholder="Enter amount in dollars"
                              onChangeText={handleChange('amount')}
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
                              placeholder="Enter exchange rate"
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
                              placeholder="Amount in Naira"
                              keyboardType="numeric"
                              errorText={
                                touched.amountNaira
                                  ? errors.amountNaira
                                  : undefined
                              }
                              readOnly
                            />
                            {+values.departmentId < 3 ? (
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
                                  placeholder="Enter card number"
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
                                  placeholder="Enter crypto amount"
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
                                  placeholder="Enter from address"
                                  errorText={
                                    touched.fromAddress
                                      ? errors.fromAddress
                                      : undefined
                                  }
                                  keyboardType="numeric"
                                />
                                <Input
                                  id="toAddress"
                                  value={values.toAddress}
                                  onChangeText={handleChange('toAddress')}
                                  onBlur={handleBlur('toAddress')}
                                  label="To Address"
                                  placeholder="Enter to address"
                                  keyboardType="numeric"
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
                      >
                        <Text style={styles.buttonText}>Continue</Text>
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
