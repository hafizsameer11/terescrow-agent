import { icons } from "@/constants";

export const topMenuItems = [
  {
    title: "Dashboard",
    name: "index",
    icon: icons.dashboard,
    roles: ["admin"],
  },
  {
    title: "Customer",
    name: "customer",
    icon: icons.user,
    roles: ["admin"],
  },
  {
    title: "Chat",
    name: "chat",
    icon: icons.chat,
    roles: ["admin", "agent"],
  },
  {
    title: "Transactions",
    name: "transactions",
    icon: icons.sendMoney,
    roles: ["admin", "agent"],
  },
  {
    title: "Rates",
    name: "rates",
    icon: icons.discount,
    roles: ["admin"],
  },
  {
    title: "Log",
    name: "log",
    icon: icons.document,
    roles: ["admin"],
  },
  {
    title: "Department",
    name: "department",
    icon: icons.rating,
    roles: ["admin"],
  },
  {
    title: "Teams",
    name: "teams",
    icon: icons.people2,
    roles: ["admin"],
  },
  {
    title: "Users",
    name: "users",
    icon: icons.people7,
    roles: ["admin"],
  },
];

export const bottomMenuItems = [
  {
    title: "Notifications",
    name: "notifications",
    icon: icons.notification2,
  },
  {
    title: "Settings",
    name: "settings",
    icon: icons.settings,
  },
  {
    title: "Team Communication",
    name: "teamcommunication",
    icon: icons.people5,
  },
  //   {
  //     title: 'Log Out',
  //     name: 'logout',
  //     icon: icons.logout,
  //   },
];
