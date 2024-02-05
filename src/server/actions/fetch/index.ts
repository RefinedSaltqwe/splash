"use server";
import { type InvoiceWithService } from "@/types/prisma";
import {
  Prisma,
  type AuthorizedEmail,
  type Customer,
  type Invoice,
  type ServiceType,
  type VerificationToken,
  type User,
  type TwoFactorToken,
  type TwoFactorConfirmation,
} from "@prisma/client";
import { cache } from "react";
import { db } from "../../db";

export const getCustomers = cache(async (): Promise<Customer[] | undefined> => {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: "asc" },
    });
    return [...customers];
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching customers.");
    }
    throw error;
  }
});

export const getCustomer = cache(
  async (id: string): Promise<Customer | undefined> => {
    try {
      const customers = await db.customer.findUnique({
        where: {
          id,
        },
      });
      return customers!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching customer.");
      }
      throw error;
    }
  },
);

export const getServiceType = cache(
  async (id: string): Promise<ServiceType | undefined> => {
    try {
      const service = await db.serviceType.findUnique({
        where: {
          id,
        },
      });
      return service!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error(
          "System error. There is an error fetching service type.",
        );
      }
      throw error;
    }
  },
);

export const getServiceTypes = cache(
  async (): Promise<ServiceType[] | undefined> => {
    try {
      const services = await db.serviceType.findMany({
        orderBy: { name: "asc" },
      });
      return [...services];
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error(
          "System error. There is an error fetching service types.",
        );
      }
      throw error;
    }
  },
);

export const getInvoices = cache(async (): Promise<Invoice[] | undefined> => {
  try {
    const invoices = await db.invoice.findMany({
      orderBy: { createdAt: "asc" },
    });
    return [...invoices];
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching invoices.");
    }
    throw error;
  }
});

export const getInvoiceWithServices = cache(
  async (id: string): Promise<InvoiceWithService | undefined | null> => {
    try {
      const invoiceWithServices = db.invoice.findUnique({
        where: {
          id,
        },
        include: {
          services: true,
        },
      });
      return invoiceWithServices;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error(
          "System error. There is an error fetching invoice and services.",
        );
      }
      throw error;
    }
  },
);

export const getEmail = cache(
  async (email: string): Promise<AuthorizedEmail | undefined> => {
    try {
      const emailExist = await db.authorizedEmail.findUnique({
        where: {
          email,
        },
      });
      return emailExist!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching email.");
      }
      throw error;
    }
  },
);

export const getVerificationTokenByEmail = cache(
  async (email: string): Promise<VerificationToken | undefined> => {
    try {
      const verificationEmail = await db.verificationToken.findFirst({
        where: {
          email,
        },
      });
      return verificationEmail!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching token.");
      }
      throw error;
    }
  },
);

export const getVerificationTokenByToken = cache(
  async (token: string): Promise<VerificationToken | undefined> => {
    try {
      const verificationToken = await db.verificationToken.findUnique({
        where: {
          token,
        },
      });
      return verificationToken!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching token.");
      }
      throw error;
    }
  },
);

export const getTwoFactorTokenByToken = cache(
  async (token: string): Promise<TwoFactorToken | undefined> => {
    try {
      const twoFactorToken = await db.twoFactorToken.findUnique({
        where: {
          token,
        },
      });
      return twoFactorToken!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching token.");
      }
      throw error;
    }
  },
);

export const getTwoFactorTokenByEmail = cache(
  async (email: string): Promise<TwoFactorToken | undefined> => {
    try {
      const twoFactorEmail = await db.twoFactorToken.findFirst({
        where: {
          email,
        },
      });
      return twoFactorEmail!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching token.");
      }
      throw error;
    }
  },
);

export const getTwoFactorConfirmationByUserId = cache(
  async (userId: string): Promise<TwoFactorConfirmation | undefined> => {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({
        where: {
          userId,
        },
      });
      return twoFactorConfirmation!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching token.");
      }
      throw error;
    }
  },
);

export const getUserByEmail = cache(
  async (email: string): Promise<User | undefined> => {
    try {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });
      return user!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching user.");
      }
      throw error;
    }
  },
);

export const getUsers = cache(async (): Promise<User[] | undefined> => {
  try {
    const user = await db.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching user.");
    }
    throw error;
  }
});

export const getUsersExcludeCurrentUserById = cache(
  async (id: string): Promise<User[] | undefined> => {
    try {
      const users = await db.user.findMany({
        orderBy: { createdAt: "asc" },
      });
      let usersWithoutCurrentUser;

      if (users) {
        usersWithoutCurrentUser = users.filter((user) => user.id !== id);
      }

      return usersWithoutCurrentUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching user.");
      }
      throw error;
    }
  },
);

export const getUserById = cache(
  async (id: string): Promise<User | undefined> => {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });
      return user!;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching user.");
      }
      throw error;
    }
  },
);
