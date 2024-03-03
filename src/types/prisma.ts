import {
  type User,
  type BreakIn,
  type BreakOut,
  type Invoice,
  type Service,
  type TimeIn,
  type TimeOut,
  type TimeTotal,
  type Timesheet,
  type AgencySidebarOption,
  type SubAccount,
  type Permissions,
  type Agency,
  type SubAccountSidebarOption,
  type SidebarOptionChildren,
  type Funnel,
  type FunnelPage,
  type Pipeline,
  type Lane,
  type Ticket,
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
