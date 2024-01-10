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
  id: string;
  serviceTypeId: string;
  customerId: string;
  teamId?: string;
  status: "Completed" | "In Progress" | "Finished";
};

export type Invoice = {
  id: string;
  customerId: string;
  serviceId: string;
  createdAt: Date;
  dueDate: Date;
  payment: number;
  amount: number;
  status: "1" | "2" | "3" | "4"; //"Paid" | "Unpaid" | "Partially Paid" | "Overdue";
  //SubTotal, Tax, Total
};

export type Customer = {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
};

export type Supplier = {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
};

//! Expenses
