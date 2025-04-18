import { icons } from "@/constants";

export const topMenuItems = [
  {
    title: "Dashboard",
    name: "index",
    icon: icons.dashboard,
    roles: ["admin", "agent"],
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
    title: "Pending Chat",
    name: "pendingchat",
    icon: icons.chatBubble,
    roles: ["agent"],
  },
  {
    title: "Quick Replies",
    name: "quickreplies",
    icon: icons.quickreply,
    roles: ["agent"],
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
  }
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
    title: "Team Chat",
    name: "teamcommunication",
    icon: icons.people5,
  },
  {
    title: "Logout",
    name: "logout",
    icon: icons.logout,
  }


];
