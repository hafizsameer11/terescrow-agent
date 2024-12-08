import * as Yup from "yup";
export const validationSignIn = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: Yup.string().required("Password is required"),
});

export const validationEditProfile = Yup.object().shape({
  name: Yup.string().required("Name is required"),

  userName: Yup.string().required("User name is required"),

  email: Yup.string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  phoneNumber: Yup.string().required("Phone number is required"),

  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female", "other"], "Invalid gender"),

  country: Yup.string().required("Country is required"),

  password: Yup.string().required("Password is required"),
});

export const validationNewNotification = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
});