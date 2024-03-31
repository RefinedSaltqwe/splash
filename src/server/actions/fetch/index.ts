"use server";
import {
  FunnelsWithFunnelPages,
  type AgencyWithSubAccounts,
  type GetAllUsersInAgency,
  type GetAuthUserDetails,
  type GetLanesWithTicketAndTags,
  type GetMediaFromSubAccount,
  type GetTagsForSubaccount,
  type InvoiceWithService,
  type PipelineWithLanesAndTickets,
  type TimesheetWithInputTimes,
  FunnelsWithFunnelPagesNoNull,
} from "@/types/prisma";
import {
  type LaneDetail,
  type UserWithPermissionsAndSubAccounts,
} from "@/types/stripe";
import { currentUser } from "@clerk/nextjs";
import {
  Prisma,
  type AuthorizedEmail,
  type Customer,
  type Invoice,
  type Pipeline,
  type ServiceType,
  type Supplier,
  type TwoFactorConfirmation,
  type TwoFactorToken,
  type User,
  type VerificationToken,
  type Contact,
} from "@prisma/client";
import { cache } from "react";
import { db } from "../../db";

export const getUserPermissions = cache(
  async (userId: string): Promise<UserWithPermissionsAndSubAccounts | null> => {
    let response;
    try {
      response = await db.user.findUnique({
        where: { id: userId },
        select: { Permissions: { include: { SubAccount: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching customers.");
      }
      throw error;
    }
    return response;
  },
);

export const getMedia = cache(
  async (subaccountId: string): Promise<GetMediaFromSubAccount | null> => {
    const mediafiles = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
      include: { Media: true },
    });
    return mediafiles;
  },
);

export const getAuthUserDetails = cache(
  async (): Promise<GetAuthUserDetails | null> => {
    try {
      const user = await currentUser();
      if (!user) {
        return null;
      }

      const userData = await db.user.findUnique({
        where: {
          email: user.emailAddresses[0]!.emailAddress,
        },
        include: {
          Agency: {
            include: {
              SidebarOption: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  Children: true,
                },
              },
              SubAccount: {
                include: {
                  SidebarOption: {
                    orderBy: {
                      order: "asc",
                    },
                  },
                },
              },
            },
          },
          Permissions: true,
        },
      });

      return userData;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching customers.");
      }
      throw error;
    }
  },
);

export const getCustomers = cache(
  async (agencyId: string): Promise<Customer[] | undefined> => {
    try {
      const customers = await db.customer.findMany({
        where: {
          agencyId,
        },
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
  },
);

export const getCustomer = cache(async (id: string): Promise<Customer> => {
  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
    });
    return customer!;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error fetching customer.");
    }
    throw error;
  }
});

export const getPipelines = cache(
  async (subaccountId: string): Promise<PipelineWithLanesAndTickets[] | []> => {
    const response = await db.pipeline.findMany({
      where: { subAccountId: subaccountId },
      include: {
        Lane: {
          include: { Tickets: true },
        },
      },
    });
    return response;
  },
);

export const getPipelinesOnly = cache(
  async (subaccountId: string): Promise<Pipeline[] | []> => {
    const response = await db.pipeline.findMany({
      where: { subAccountId: subaccountId },
    });
    return response;
  },
);

export const getSuppliers = cache(
  async (agencyId: string): Promise<Supplier[] | []> => {
    try {
      const suppliers = await db.supplier.findMany({
        where: {
          agencyId,
        },
        orderBy: { createdAt: "asc" },
      });
      return [...suppliers];
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching customers.");
      }
      throw error;
    }
  },
);

export const getSupplierById = cache(
  async (id: string): Promise<Supplier | undefined> => {
    try {
      const supplier = await db.supplier.findUnique({
        where: {
          id,
        },
      });
      return supplier!;
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
  async (agencyId: string): Promise<ServiceType[] | undefined> => {
    try {
      const services = await db.serviceType.findMany({
        where: {
          agencyId,
        },
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

export const getInvoices = cache(
  async (agencyId: string): Promise<Invoice[] | undefined> => {
    try {
      const invoices = await db.invoice.findMany({
        where: {
          agencyId,
        },
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
  },
);

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

export const getUsers = cache(
  async (agencyId: string): Promise<User[] | undefined> => {
    try {
      const user = await db.user.findMany({
        where: {
          agencyId,
        },
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
  },
);

export const getUsersExcludeCurrentUserById = cache(
  async (id: string, agencyId: string): Promise<User[] | undefined> => {
    try {
      const users = await db.user.findMany({
        where: {
          agencyId,
        },
        orderBy: { createdAt: "asc" },
        include: {
          Agency: { include: { SubAccount: true } },
          Permissions: { include: { SubAccount: true } },
        },
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
export const getAllUsersInAgency = cache(
  async (agencyId: string): Promise<GetAllUsersInAgency[] | undefined> => {
    try {
      const users = await db.user.findMany({
        where: {
          Agency: {
            id: agencyId,
          },
        },
        orderBy: { createdAt: "asc" },
        include: {
          Agency: { include: { SubAccount: true } },
          Permissions: { include: { SubAccount: true } },
        },
      });

      return users;
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

export const getUserDetails = cache(
  async (id: string): Promise<GetAuthUserDetails | null> => {
    try {
      const user = await currentUser();
      if (!user) {
        return null;
      }

      const userData = await db.user.findUnique({
        where: {
          id,
        },
        include: {
          Agency: {
            include: {
              SidebarOption: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  Children: true,
                },
              },
              SubAccount: {
                include: {
                  SidebarOption: {
                    orderBy: {
                      order: "asc",
                    },
                  },
                },
              },
            },
          },
          Permissions: true,
        },
      });

      return userData;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientKnownRequestError
      ) {
        throw new Error("System error. There is an error fetching customers.");
      }
      throw error;
    }
  },
);

export const getAgencyByIdWithSubAccounts = cache(
  async (id: string): Promise<AgencyWithSubAccounts | undefined> => {
    try {
      const agency = await db.agency.findUnique({
        where: {
          id,
        },
        include: {
          SubAccount: true,
        },
      });
      return agency!;
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
  async (id: string): Promise<GetAllUsersInAgency | undefined> => {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
        include: {
          Agency: { include: { SubAccount: true } },
          Permissions: { include: { SubAccount: true } },
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

export const getTimesheets = cache(
  async (agencyId: string): Promise<TimesheetWithInputTimes[] | undefined> => {
    //! WIP: Only get this week's timesheet
    try {
      const timesheets = await db.timesheet.findMany({
        where: {
          Agency: {
            id: agencyId,
          },
        },
        orderBy: { id: "asc" },
        include: {
          timeIn: true,
          timeOut: true,
          breakIn: true,
          breakOut: true,
          timeTotal: true,
        },
      });
      return timesheets;
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

export const getLatestTimeSheets = cache(
  async (agencyId: string): Promise<TimesheetWithInputTimes[] | undefined> => {
    //! WIP: Only get this week's timesheet
    try {
      const getLatestTimesheet = await db.timesheet.findFirst({
        where: {
          Agency: {
            id: agencyId,
          },
        },
        orderBy: {
          dateFr: "desc",
        },
      });
      const timesheets = await db.timesheet.findMany({
        where: {
          Agency: {
            id: agencyId,
          },
          user: {
            role: {
              not: "AGENCY_OWNER",
            },
          },
          dateFr: getLatestTimesheet?.dateFr,
        },
        orderBy: { id: "asc" },
        include: {
          timeIn: true,
          timeOut: true,
          breakIn: true,
          breakOut: true,
          timeTotal: true,
        },
      });
      return timesheets;
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

export const getPipelineDetails = cache(
  async (pipelineId: string): Promise<Pipeline | undefined | null> => {
    const response = await db.pipeline.findUnique({
      where: {
        id: pipelineId,
      },
    });
    return response;
  },
);

export const getLanesWithTicketAndTags = cache(
  async (pipelineId: string): Promise<LaneDetail[] | undefined | null> => {
    const response = await db.lane.findMany({
      where: {
        pipelineId,
      },
      orderBy: { order: "asc" },
      include: {
        Tickets: {
          orderBy: {
            order: "asc",
          },
          include: {
            Tags: true,
            Assigned: true,
            Customer: true,
          },
        },
      },
    });
    return response;
  },
);

export const getTagsForSubaccount = cache(
  async (subaccountId: string): Promise<GetTagsForSubaccount | null> => {
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
      select: { Tags: true },
    });
    return response;
  },
);

export const getTicketsWithTags = cache(async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: { Tags: true, Assigned: true, Customer: true },
  });
  return response;
});

export const getSubAccountTeamMembers = cache(
  async (subaccountId: string): Promise<User[] | null> => {
    const subaccountUsersWithAccess = await db.user.findMany({
      where: {
        Agency: {
          SubAccount: {
            some: {
              id: subaccountId,
            },
          },
        },
        role: "SUBACCOUNT_USER",
        Permissions: {
          some: {
            subAccountId: subaccountId,
            access: true,
          },
        },
      },
    });
    return subaccountUsersWithAccess;
  },
);

export const searchContacts = cache(
  async (searchTerms: string): Promise<Contact[] | null> => {
    const response = await db.contact.findMany({
      where: {
        name: {
          contains: searchTerms,
        },
      },
    });
    return response;
  },
);

export const getContacts = cache(async (): Promise<Contact[] | null> => {
  const response = await db.contact.findMany();
  return response;
});

export const getFunnels = cache(
  async (subacountId: string): Promise<FunnelsWithFunnelPagesNoNull[]> => {
    const funnels = await db.funnel.findMany({
      where: { subAccountId: subacountId },
      include: { FunnelPages: true },
    });

    return funnels;
  },
);

export const getFunnel = cache(
  async (funnelId: string): Promise<FunnelsWithFunnelPages> => {
    const funnel = await db.funnel.findUnique({
      where: { id: funnelId },
      include: {
        FunnelPages: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return funnel;
  },
);

export const getFunnelPageDetails = cache(async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  });

  return response;
});
