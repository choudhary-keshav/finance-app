export const categories = [
  { id: "Food", name: "Food" },
  { id: "travel", name: "Travel" },
  { id: "other", name: "Other" },
];

export const dateOptions = [
  { value: "thisWeek", label: "This Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom" },
];
export const initialTransactionFormData = {
  userId: "",
  transactionId: "",
  transactionDate: "",
  description: "",
  amount: "",
  type: "",
  balance: "",
  category: "",
};