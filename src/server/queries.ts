"use server";
import { sendEmailInvitationByResend } from "@/lib/mail";
import {
  type CreateFunnelFormSchema,
  type CreateMediaType,
  type UpsertFunnelPage,
} from "@/types/stripe";
import { clerkClient, currentUser } from "@clerk/nextjs";
import {
  type LaborTracking,
  Prisma,
  type Agency,
  type Lane,
  type MaterialsUsed,
  type Role,
  type SubAccount,
  type Tag,
  type Ticket,
  type User,
} from "@prisma/client";
import { randomUUID } from "crypto";
import { type z } from "zod";
import { db } from "./db";

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean,
) => {
  let response;
  try {
    response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    });
    if (!response) {
      throw new Error("Cannot change the user permission.");
    }
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
};

export const getSubaccountDetails = async (subaccountId: string) => {
  let response;
  try {
    response = await db.subAccount.findUnique({
      where: {
        id: subaccountId,
      },
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
};

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === "AGENCY_OWNER") return null;

  const response = await db.user.upsert({
    where: {
      id: user.id,
    },
    update: user,
    create: {
      id: user.id,
      image: user.image,
      email: user.email,
      name: user.name,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      emailVerified: user.emailVerified,
      status: user.status,
      phoneNumber: user.phoneNumber,
      country: user.country,
      street: user.street,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      jobRole: user.jobRole,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      agencyId,
    },
  });

  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();
  try {
    if (user) {
      const invitationExists = await db.invitation.findUnique({
        where: {
          email: user.emailAddresses[0]!.emailAddress,
          status: "PENDING",
        },
      });

      if (invitationExists) {
        const userDetails = await createTeamUser(invitationExists.agencyId, {
          email: invitationExists.email,
          agencyId: invitationExists.agencyId,
          image: user.imageUrl,
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          role: invitationExists.role,
          createdAt: new Date(),
          updatedAt: new Date(),
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          password: user.passwordEnabled,
          emailVerified: new Date(),
          status: "Active",
          phoneNumber: "",
          country: "Canada",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          jobRole: "",
          isTwoFactorEnabled: false,
        });

        await saveActivityLogsNotification({
          agencyId: invitationExists?.agencyId,
          description: `Joined`,
          subaccountId: undefined,
        });

        if (userDetails) {
          const updateClerk = await clerkClient.users.updateUserMetadata(
            user.id,
            {
              privateMetadata: {
                role: userDetails.role || "SUBACCOUNT_USER",
              },
            },
          );

          if (!updateClerk) {
            throw new Error("There is an error updating clerk metadata.");
          }

          const checkInvitation = await db.invitation.findUnique({
            where: { email: userDetails.email },
          });

          if (checkInvitation) {
            const deleteInvitation = await db.invitation.delete({
              where: { email: userDetails.email },
            });

            if (!deleteInvitation) {
              throw new Error("There is an error deleting invivation");
            }
          }

          return userDetails.agencyId;
        } else return null;
      } else {
        const agency = await db.user.findUnique({
          where: {
            email: user.emailAddresses[0]!.emailAddress,
          },
        });
        return agency ? agency.agencyId : null;
      }
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      throw new Error("System error. There is an error in the server: ", error);
    }
    throw error;
  }
};

export const getAgencyIdByLoggedInUser = async () => {
  try {
    const user = await currentUser();
    if (user) {
      const agency = await db.user.findUnique({
        where: {
          email: user.emailAddresses[0]!.emailAddress,
        },
      });
      return agency ? agency.agencyId : null;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string;
  description: string;
  subaccountId?: string;
}) => {
  const authUser = await currentUser();
  let userData;
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subaccountId },
          },
        },
      },
    });
    if (response) {
      userData = response;
    }
  } else {
    userData = await db.user.findUnique({
      where: { email: authUser?.emailAddresses[0]!.emailAddress },
    });
  }

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  let foundAgencyId = agencyId;
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        "You need to provide atleast an agency Id or subaccount Id",
      );
    }
    const response = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });
    if (response) foundAgencyId = response.agencyId;
  }
  if (subaccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
        SubAccount: {
          connect: { id: subaccountId },
        },
      },
    });
  } else {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    });
  }
};

export const initUser = async (newUser: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0]!.emailAddress,
    },
    update: newUser,
    create: {
      id: user.id,
      image: user.imageUrl,
      email: user.emailAddresses[0]!.emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role ?? "SUBACCOUNT_USER",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      password: user.passwordEnabled,
      emailVerified: new Date(),
      status: "Active",
      phoneNumber: newUser.phoneNumber,
      country: "Canada",
      street: newUser.street,
      city: newUser.city,
      state: newUser.state,
      postalCode: newUser.postalCode,
      jobRole: "Owner",
      isTwoFactorEnabled: false,
    },
  });

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role ?? "SUBACCOUNT_USER",
    },
  });

  return userData;
};

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>,
) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  });
  return response;
};

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const response = await db.notification.findMany({
      where: { agencyId },
      include: { User: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const upsertAgency = async (agency: Agency) => {
  if (!agency.companyEmail) return null;

  const agencyDetails = await db.agency.upsert({
    where: {
      id: agency.id,
    },
    update: agency,
    create: {
      users: {
        //This connect the user with the email equal to agency company email since they are the same
        connect: { email: agency.companyEmail },
      },
      ...agency,
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "dashboard",
            href: `/admin/${agency.id}`,
            order: 1,
          },
          {
            name: "Analytics",
            href: `/admin/${agency.id}/analytics`,
            icon: "analytics",
            order: 2,
          },
          {
            name: "Services",
            href: `/admin/${agency.id}/services`,
            icon: "services",
            order: 3,
          },
          {
            name: "Expense",
            href: `/admin/${agency.id}/expense`,
            icon: "expense",
            order: 4,
            Children: {
              create: [
                {
                  name: "Overview",
                  href: `/admin/${agency.id}/expense/overview`,
                  order: 1,
                },
                {
                  name: "Transactions",
                  href: `/admin/${agency.id}/expense/transactions`,
                  order: 2,
                },
                {
                  name: "Bills",
                  href: `/admin/${agency.id}/expense/bills`,
                  order: 3,
                },
                {
                  name: "Suppliers",
                  href: `/admin/${agency.id}/expense/suppliers`,
                  order: 4,
                },
              ],
            },
          },
          {
            name: "Team",
            href: `/admin/${agency.id}/team`,
            icon: "shield",
            order: 5,
            Children: {
              create: [
                {
                  name: "List",
                  href: `/admin/${agency.id}/team/list`,
                  order: 1,
                },
                {
                  name: "Time Sheet",
                  href: `/admin/${agency.id}/team/time-sheet`,
                  order: 2,
                },
                {
                  name: "Labor Tracking",
                  href: `/admin/${agency.id}/team/labor-tracking`,
                  order: 3,
                },
              ],
            },
          },
          {
            name: "Inventory",
            href: `/admin/${agency.id}/inventory`,
            icon: "inventory",
            order: 6,
          },
          {
            name: "Customers",
            href: `/admin/${agency.id}/customers`,
            icon: "customers",
            order: 7,
          },
          {
            name: "Suppliers",
            href: `/admin/${agency.id}/suppliers`,
            icon: "suppliers",

            order: 8,
          },
          {
            name: "Invoice",
            href: `/admin/${agency.id}/invoice`,
            icon: "invoice",
            order: 9,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            href: `/admin/${agency.id}/launchpad`,
            order: 10,
          },
          {
            name: "Billing",
            icon: "payment",
            href: `/admin/${agency.id}/billing`,
            order: 11,
          },
          {
            name: "Sub Accounts",
            icon: "person",
            href: `/admin/${agency.id}/all-subaccounts`,
            order: 12,
          },
        ],
      },
    },
  });

  return agencyDetails;
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null;
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: "AGENCY_OWNER",
    },
  });
  if (!agencyOwner) return console.log("🔴Erorr could not create subaccount");
  const permissionId = randomUUID();
  const response = await db.subAccount.upsert({
    where: { id: subAccount.id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: "Lead Cycle" },
      },
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "dashboard",
            href: `/subaccount/${subAccount.id}`,
            order: 1,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            href: `/subaccount/${subAccount.id}/launchpad`,
            order: 2,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            href: `/subaccount/${subAccount.id}/funnels`,
            order: 3,
          },
          {
            name: "Media",
            icon: "database",
            href: `/subaccount/${subAccount.id}/media`,
            order: 4,
          },
          {
            name: "Automations",
            icon: "chip",
            href: `/subaccount/${subAccount.id}/automations`,
            order: 5,
          },
          {
            name: "Pipelines",
            icon: "flag",
            href: `/subaccount/${subAccount.id}/pipelines`,
            order: 6,
          },
          {
            name: "Contacts",
            icon: "person",
            href: `/subaccount/${subAccount.id}/contacts`,
            order: 7,
          },
        ],
      },
    },
  });
  return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId: laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  });
  return response;
};

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType,
) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const deleteMediaQuery = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });
  return response;
};

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string,
) => {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId ?? randomUUID(),
      subAccountId: subaccountId,
    },
  });

  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput,
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id ?? randomUUID() },
    update: pipeline,
    create: pipeline,
  });

  return response;
};

export const executeDeletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      }),
    );

    await db.$transaction(updateTrans);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      }),
    );

    await db.$transaction(updateTrans);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    }
  }
};

export const upsertLaneQuery = async (
  name: string,
  id: string | undefined,
  pipelineId: string,
  order: number | undefined,
) => {
  let orderr: number;
  const lane = { name, id, pipelineId, order };

  if (!order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId,
      },
    });

    orderr = lanes.length;
  } else {
    orderr = order;
  }

  const response = await db.lane.upsert({
    where: { id: id ?? randomUUID() },
    update: lane,
    create: { ...lane, order: orderr },
    include: {
      Tickets: {
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  });

  return response;
};

export const deleteLaneQuery = async (laneId: string) => {
  const resposne = await db.lane.delete({ where: { id: laneId } });
  return resposne;
};

export const upsertTicketQuery = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[],
  materialsUsed?: MaterialsUsed[],
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: { laneId: ticket.laneId },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  const response = await db.ticket.upsert({
    where: {
      id: ticket.id ?? randomUUID(),
    },
    update: {
      ...ticket,
      Tags: { set: tags },
      MaterialsUsed: { set: materialsUsed ?? [] },
      updatedAt: new Date(),
    },
    create: {
      ...ticket,
      Tags: { connect: tags },
      MaterialsUsed: { connect: materialsUsed ?? [] },
      order,
      updatedAt: new Date(),
    },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  });

  return response;
};
export const upsertScheduleQuery = async (
  payload: Prisma.LaborTrackingUncheckedCreateInput,
) => {
  const response = await db.laborTracking.upsert({
    where: {
      id: payload.id ?? "",
    },
    update: {
      ...payload,
    },
    create: {
      ...payload,
    },
  });

  return response;
};

export const deleteTicketQuery = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: {
      id: ticketId,
    },
  });

  return response;
};

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput,
) => {
  const response = await db.tag.upsert({
    where: { id: tag.id ?? randomUUID(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  });

  return response;
};

export const deleteTagQuery = async (tagId: string) => {
  const response = await db.tag.delete({ where: { id: tagId } });
  return response;
};

export const upsertContactQuery = async (
  contact: Prisma.ContactUncheckedCreateInput,
) => {
  const response = await db.contact.upsert({
    where: { id: contact.id ?? randomUUID() },
    update: contact,
    create: contact,
  });
  return response;
};

export const upsertInventoryQuery = async (
  item: Prisma.InventoryUncheckedCreateInput,
) => {
  const response = await db.inventory.upsert({
    where: { id: item.id ?? randomUUID() },
    update: {
      ...item,
      updatedAt: new Date(),
    },
    create: {
      ...item,
      name: item.name ?? "",
      cost: item.cost ?? 0,
      quantity: item.quantity ?? 0,
      supplierId: item.supplierId,
      agencyId: item.agencyId,
    },
    include: {
      Supplier: true,
      MaterialsUsed: true,
    },
  });
  return response;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string,
) => {
  const data = await db.funnel.update({
    where: { id: funnelId },
    data: { liveProducts: products },
  });
  return data;
};

export const upsertFunnelPages = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage[],
  funnelId: string,
) => {
  if (!subaccountId || !funnelId) return;
  const funnelPages = funnelPage.map((page) =>
    db.funnelPage.upsert({
      where: { id: page.id ?? "" },
      update: { ...page },
      create: {
        ...page,
        content: page.content
          ? page.content
          : JSON.stringify([
              {
                content: [],
                id: "__body",
                name: "Body",
                styles: { backgroundColor: "white" },
                type: "__body",
              },
            ]),
        funnelId,
      },
    }),
  );

  const response = await db.$transaction(funnelPages);

  if (!response) {
    throw new Error("Error: Failed to create or update funnel page.");
  }

  return response;
};

export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string,
) => {
  if (!funnelPage.id) {
    funnelPage.id = randomUUID();
  }
  if (!subaccountId || !funnelId) return;
  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id ?? "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  if (!response) {
    throw new Error("Error: Failed to create or update funnel page.");
  }
  return response;
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({ where: { id: funnelPageId } });

  return response;
};

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: {
      subDomainName,
    },
    include: { FunnelPages: true },
  });
  return response;
};

export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: { id: userId },
    select: { Permissions: { include: { SubAccount: true } } },
  });

  return response;
};

export const sendEmailInvitation = async (
  role: Role,
  email: string,
  agencyId: string,
) => {
  const user = await currentUser();
  const response = await db.invitation.create({
    data: { email, agencyId, role },
  });
  if (!response) {
    throw new Error("Invitation has been sent already.");
  }

  try {
    await sendEmailInvitationByResend(user?.firstName ?? "Splash Team", email);
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
};
