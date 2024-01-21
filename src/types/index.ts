export type User = {
  id: string;
  firstname: string;
  lastname: string;
  status: "Active" | "Pending" | "Terminated" | "Disabled";
  email: string;
  phoneNumber: string;
  role: string;
  amount: number;
};

export type Team = {
  id: string;
  members: string[];
  teamLeader: string; //userId
};

export type ServiceType = {
  id: string;
  type: string; // Specific
};

export type Service = {
  id?: string;
  serviceTypeId: string;
  price: number;
  invoiceId: string;
  description: string;
};

export type Invoice = {
  id: string;
  customerId: string;
  createdAt: Date;
  dueDate: Date;
  payment: number;
  total: number;
  shipping: number | "Free";
  tax: number;
  subTotal: number;
  status: "1" | "2" | "3" | "4"; //"Paid" | "Unpaid" | "Partially Paid" | "Overdue";
};

export type Customer = {
  id: string;
  name: string;
  companyName: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
};

export type Supplier = {
  id: string;
  name: string;
  companyName: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
};

//! Expenses
