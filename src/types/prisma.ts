import {
  type Agency,
  type AgencySidebarOption,
  type BreakIn,
  type BreakOut,
  type Contact,
  type Funnel,
  type FunnelPage,
  type Invoice,
  type Lane,
  type Media,
  type Permissions,
  type Pipeline,
  type Service,
  type SidebarOptionChildren,
  type SubAccount,
  type SubAccountSidebarOption,
  type Tag,
  type Ticket,
  type TimeIn,
  type TimeOut,
  type TimeTotal,
  type Timesheet,
  type User,
} from "@prisma/client";
// ? Custom Types
export type InvoiceWithService = Invoice & { services: Service[] };

export type TimesheetWithInputTimes =
  | (Timesheet & {
      timeIn: TimeIn | null;
      timeOut: TimeOut | null;
      breakIn: BreakIn | null;
      breakOut: BreakOut | null;
      timeTotal: TimeTotal | null;
    })
  | null;

// ====================== GetAuthUserPermissions
export type PermissionsWithSubaccounts =
  | (Permissions & {
      SubAccount: SubAccount | null;
    })[]
  | null;

export type GetAuthUserPermissions =
  | (User & {
      Permissions: PermissionsWithSubaccounts[];
    })
  | null;

// ====================== GetAuthUserDetails

export type SubAccountWithSideBarOptions =
  | (SubAccount & {
      SidebarOption: SubAccountSidebarOption[];
    })
  | null;
export type AgencySidebarOptionWithChildren =
  | (AgencySidebarOption & {
      Children: SidebarOptionChildren[];
    })
  | null;

export type AgencyWithSidebarOptions =
  | (Agency & {
      SidebarOption: AgencySidebarOptionWithChildren[];
      SubAccount: SubAccountWithSideBarOptions[];
    })
  | null;
export type GetAuthUserDetails =
  | (User & {
      Agency: AgencyWithSidebarOptions | null;
      Permissions: Permissions[];
    })
  | null;
//========================== getAllUsersInAgency

export type AgencyWithSubAccounts =
  | (Agency & {
      SubAccount: SubAccount[];
    })
  | null;
export type PermissionsWithSubAccount =
  | (Permissions & {
      SubAccount: SubAccount;
    })
  | null;
export type GetAllUsersInAgency =
  | (User & {
      Agency: AgencyWithSubAccounts | null;
      Permissions: PermissionsWithSubAccount[];
    })
  | null;

//========================== FunnelsWithFunnelPagesAndTotalFunnelVisits
export type FunnelsWithFunnelPages =
  | (Funnel & {
      FunnelPages: FunnelPage[];
    })
  | null;

export type FunnelsWithFunnelPagesNoNull = Funnel & {
  FunnelPages: FunnelPage[];
};

export type TotalFunnelVisits = number | undefined;

export type FunnelsWithFunnelPagesAndTotalFunnelVisits =
  | (Funnel & { totalFunnelVisits: TotalFunnelVisits } & {
      FunnelPages: FunnelPage[];
    })
  | null;

//========================== PipelineWithLanesAndTickets
export type LaneAndTickets =
  | (Lane & {
      Tickets: Ticket[];
    })
  | null;

export type PipelineWithLanesAndTickets =
  | (Pipeline & {
      Lane: LaneAndTickets[];
    })
  | null;
//========================== GetMediaFromSubAccount
export type GetMediaFromSubAccount =
  | (SubAccount & {
      Media: Media[];
    })
  | null;
//========================== GetLanesWithTicketAndTags

export type TicketsWithTagsAssignedCustomer =
  | (Ticket & {
      Tags: Tag[];
      Customer: Contact | null;
      Assigned: User | null;
    })
  | null;

export type GetLanesWithTicketAndTags =
  | (Lane & {
      Tickets: TicketsWithTagsAssignedCustomer[];
    })
  | null;

//========================== GetTagsForSubaccount
export type GetTagsForSubaccount = {
  Tags: Tag[];
} | null;
