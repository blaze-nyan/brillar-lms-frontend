import { format, parseISO, isValid } from "date-fns";

export const formatDate = (
  date: string | Date,
  formatStr: string = "PPP"
): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatStr) : "Invalid Date";
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatPhoneNumbers = (phoneNumbers: string[]): string => {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    return "No phone numbers available";
  }
  return phoneNumbers.join(", ");
};

export const getLeaveTypeColor = (type: string): string => {
  switch (type) {
    case "annualLeave":
      return "#4caf50";
    case "sickLeave":
      return "#f44336";
    case "casualLeave":
      return "#ff9800";
    default:
      return "#757575";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "approved":
      return "#4caf50";
    case "pending":
      return "#ff9800";
    case "rejected":
      return "#f44336";
    case "cancelled":
      return "#757575";
    default:
      return "#757575";
  }
};
