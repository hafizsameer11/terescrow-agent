import * as Yup from 'yup';
export const validationSignIn = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ),

  password: Yup.string().required('Password is required'),
});

export const validationEditProfile = Yup.object().shape({
  name: Yup.string().required('Name is required'),

  userName: Yup.string().required('User name is required'),

  email: Yup.string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email address'
    ),

  phoneNumber: Yup.string().required('Phone number is required'),

  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),

  country: Yup.string().required('Country is required'),

  password: Yup.string().required('Password is required'),
});

export const validationNewNotification = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  message: Yup.string().required('Message is required'),
});

export const validationNewTransaction = Yup.object().shape({
  departmentId: Yup.string().required('Department ID is required'),
  categoryId: Yup.string().required('Category ID is required'),
  subCategoryId: Yup.string().required('Sub-category ID is required'),
  countryId: Yup.string().required('Country ID is required'),
  customerId: Yup.string().required('Customer ID is required'),
  amount: Yup.string().required('Amount is required'),
  exchangeRate: Yup.string().required('Exchange rate is required'),
  amountNaira: Yup.string().required('Amount in Naira is required'),
  cryptoAmount: Yup.string().when('departmentId', {
    is: (value: string) => Number(value) > 2,
    then: (schema) => schema.required('Crypto amount is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  toAddress: Yup.string().when('departmentId', {
    is: (value: string) => Number(value) > 2,
    then: (schema) => schema.required('To address is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  fromAddress: Yup.string().when('departmentId', {
    is: (value: string) => Number(value) > 2,
    then: (schema) => schema.required('From address is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  cardType: Yup.string().when('departmentId', {
    is: (value: string) => Number(value) < 3,
    then: (schema) => schema.required('Card type is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  cardNumber: Yup.string().when('departmentId', {
    is: (value: string) => Number(value) < 3,
    then: (schema) => schema.required('Card number is required'),
    otherwise: (schema) => schema.nullable(),
  }),
});
