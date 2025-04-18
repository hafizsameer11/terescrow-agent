// import { getTeamChatDetails } from "./queries/commonQueries";

export const API_BASE_URL = 'https://46.202.154.203';

export const API_TEMPLATE_URL = API_BASE_URL + '/api/';

const API_DOMAIN = "https://46.202.154.203/api";

export const API_ENDPOINTS = {
  COMMON: {
    login: API_TEMPLATE_URL + 'public/login',
    AgntLogin: API_TEMPLATE_URL + 'agent/auth/login',
    GetActionCatagories: API_TEMPLATE_URL + 'public/categories',
    GetActionSubacategories: API_TEMPLATE_URL + 'public/subcategories',
    GetActionDepartments: API_TEMPLATE_URL + 'public/departments',
    GetAllTeamChats: API_TEMPLATE_URL + 'get-all-teams-chats',
    SendMessageToTeam: API_TEMPLATE_URL + 'send-message-to-team',
    GetTeamChatDetails: API_TEMPLATE_URL + 'get-team-chat-details',
    GetUnreadMessageCount: API_DOMAIN + '/public/get-unread-count',
    GetAllChatsWithTeam: API_TEMPLATE_URL + 'get-all-chats-with-team',
    MarkAllAsRead: API_TEMPLATE_URL + '/public/read-all-messages',
    GetAgentStats: API_TEMPLATE_URL + 'agent/utilities/get-agent-stats',
    EditAgentProfile: API_TEMPLATE_URL + 'agent/utilities/edit-agent-profile',
    UpdateCustomer: API_DOMAIN + '/admin/operations/update-customer',
  },
  AGENT: {
    GetAllChatsWithCustomer:
      API_TEMPLATE_URL + 'agent/get-all-chats-with-customer',
    GetCustomerChatDetails: API_TEMPLATE_URL + 'agent/get-chat',
    SendMessageToCustomer: API_TEMPLATE_URL + 'agent/send-to-customer',
    ChangeChatStatus: API_TEMPLATE_URL + 'agent/change-chat-status',
    CreateCryptoTransaction:
      API_TEMPLATE_URL + 'agent/create-crypto-transaction',
    CreateCardTransaction: API_TEMPLATE_URL + 'agent/create-card-transaction',
    GetTeamNotifications: API_TEMPLATE_URL + 'agent/utilities/get-team-notifications',
    GetAllNotifications: API_TEMPLATE_URL + 'agent/utilities/get-all-notifications',
    GetCustomerNotifications: API_TEMPLATE_URL + 'agent/utilities/get-customer-notifications',
    GetTransactionForAgent: API_TEMPLATE_URL + 'agent/utilities/get-transactions-for-agent',
    GetTransactionStats: API_TEMPLATE_URL + 'admin/operations/get-transaction-stats',
    GetPendingChats: API_TEMPLATE_URL + 'agent/utilities/get-all-default-chats',
    TakeOverDefaultChat: API_TEMPLATE_URL + 'agent/utilities/take-over-chat',
    CreateNoteForCustomer: API_TEMPLATE_URL + 'agent/utilities/create-note',
    GetNotesForCustomer: API_TEMPLATE_URL + 'agent/utilities/get-notes',
    DeleteNote: API_TEMPLATE_URL + 'agent/utilities/delete-note',
    CreateQuickReplies: API_DOMAIN + '/agent/utilities/create-quick-reply',
    GetQuickReplies: API_DOMAIN + '/agent/utilities/get-all-quick-replies',
    DeleteQuickReply: API_DOMAIN + '/agent/utilities/delete-quick-reply',
    UpdateQuickReply: API_DOMAIN + '/agent/utilities/update-quick-reply',
  },
  ADMIN: {
    CreateChatGroup: API_DOMAIN + '/admin/create-chat-group',
  },
};

const OUR_ENDPOINT = {
  CUSTOMER: {
    AllCustomers: API_DOMAIN + "/admin/operations/get-all-customers",
    CustomerDetails: API_DOMAIN + "/admin/operations/get-customer-details",
    CustomerTransactions: API_DOMAIN + "/admin/operations/get-customer-transactions",
  },
  OPERATIONS: {
    DashBoardStats: API_DOMAIN + '/admin/operations/get-dashboard-stats',
    CustomerStats: API_DOMAIN + '/admin/operations/get-customer-stats',
    DepartmentStats: API_DOMAIN + '/admin/operations/get-department-transaction',
    Traansactions: API_DOMAIN + '/admin/operations/get-all-transactions',
    Departments: API_DOMAIN + '/admin/operations/get-all-department',
    AgentByDepartment: API_DOMAIN + '/admin/operations/get-agent-by-department',
    GetRate: API_DOMAIN + '/admin/operations/get-rate',
    GetTeam: API_DOMAIN + '/admin/operations/get-team-members',
    GetCategories: API_DOMAIN + '/admin/operations/get-all-categories',
    GetAllAgents: API_DOMAIN + '/admin/operations/get-all-agents',
    GetSubCategories: API_DOMAIN + '/admin/operations/get-all-subcategories',
    GetAllUsers: API_DOMAIN + '/admin/operations/get-all-users',
    GetBanner: API_DOMAIN + '/admin/operations/get-all-banners',
    CreateBanner: API_DOMAIN + '/admin/operations/create-banner',
    UpdateBanner: API_DOMAIN + '/admin/operations/update-banner',
    DeleteBanner: API_DOMAIN + '/admin/operations/delete-banner',
    CreateDepartment: API_DOMAIN + '/admin/operations/create-department',
    UpdateDepartment: API_DOMAIN + '/admin/operations/update-department',
    DeleteDepartment: API_DOMAIN + '/admin/operations/delete-department',

    CreateAgent: API_DOMAIN + '/admin/operations/create-agent',
    UpdateAgent: API_DOMAIN + '/admin/operations/update-agent',

    CreateCategory: API_DOMAIN + '/admin/operations/create-category',
    UpdateCategory: API_DOMAIN + '/admin/operations/update-category',
    DeleteCategory: API_DOMAIN + '/admin/operations/delete-category',
    CreateSubCategory: API_DOMAIN + '/admin/operations/create-subcategory',
    UpdateSubCategory: API_DOMAIN + '/admin/operations/update-subcategory'
  }
}
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoianV0anV0dSEiLCJyb2xlIjoiYWdlbnQiLCJpYXQiOjE3MzQyOTU3NjksImV4cCI6MTczNDM4MjE2OX0.FYQfKL0OxfQcGP4RJEk-UQlafXlGUSqwopk6R8Ire1o";
export { token, OUR_ENDPOINT, API_DOMAIN };