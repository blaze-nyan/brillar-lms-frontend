import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: Yup.array()
    .of(Yup.string().required("Phone number is required"))
    .min(1, "At least one phone number is required"),
  education: Yup.string().required("Education is required"),
  address: Yup.string().required("Address is required"),
  supervisor: Yup.string().required("Supervisor is required"),
});

export const leaveRequestValidationSchema = Yup.object({
  leaveType: Yup.string()
    .oneOf(["annualLeave", "sickLeave", "casualLeave"], "Invalid leave type")
    .required("Leave type is required"),
  startDate: Yup.date()
    .min(new Date(), "Start date cannot be in the past")
    .required("Start date is required"),
  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  days: Yup.number()
    .positive("Days must be a positive number")
    .required("Number of days is required"),
  reason: Yup.string().max(500, "Reason must be at most 500 characters"),
});

export const profileUpdateValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  phoneNumber: Yup.array()
    .of(Yup.string().required("Phone number is required"))
    .min(1, "At least one phone number is required"),
  education: Yup.string(),
  address: Yup.string(),
});
