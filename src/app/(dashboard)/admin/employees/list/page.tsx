import ClientButtonLink from "@/app/(dashboard)/_components/ButtonLinks/ClientButtonLink";
import Card from "@/app/(dashboard)/_components/containers/Card";
import Heading from "@/components/shared/Heading";
import { type User } from "@/types";
import React from "react";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";

type EmployeeListProps = object;

async function getData(): Promise<User[]> {
  //? Fetch data from your API here.
  const generatedUsers: User[] = generateRandomUsers(15);
  const users = generatedUsers;
  return users;
}
// ! ----------------------------------------------------------TEMPORARY DATA ----------------------
function generateRandomId(): string {
  // You can implement your own logic to generate unique IDs
  return Math.random().toString(36).substring(2, 10);
}

function generateRandomPhoneNumber(): string {
  // You can implement your own logic to generate random phone numbers
  return Math.floor(Math.random() * 10000000000).toString();
}

function generateRandomNumber(): number {
  // You can implement your own logic to generate random phone numbers
  return Math.floor(Math.random() * 5);
}

const generateRandomUser = (): User => ({
  id: generateRandomId(),
  firstname: "John",
  lastname: "Doe",
  status:
    generateRandomNumber() === 1
      ? "Active"
      : generateRandomNumber() === 2
        ? "Disabled"
        : generateRandomNumber() === 3
          ? "Pending"
          : "Terminated",
  email: "john.doe@example.com",
  amount: 100,
  phoneNumber: generateRandomPhoneNumber(),
  role: "Mason",
});

const generateRandomUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateRandomUser());
  }
  return users;
};
// !-----------------------------------------------------------------------------------

const EmployeeList: React.FC<EmployeeListProps> = async () => {
  const data = await getData();
  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <Heading title="List" />
        <ClientButtonLink
          buttonName="Create User"
          href="/admin/employees/list/create"
          variant={"secondary"}
        />
      </div>

      <Card padding={false}>
        <DataTable columns={columns} data={data} users={data} />
      </Card>
    </section>
  );
};

export default EmployeeList;
