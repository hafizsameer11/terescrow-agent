export const API_BASE_URL = "http://192.168.43.106:8000";

export const API_TEMPLATE_URL = API_BASE_URL + "/api/";

const API_DOMAIN = "http://192.168.18.17:8000/api";

export const API_ENDPOINTS = {
  COMMON: {
    login: API_TEMPLATE_URL + "public/login",
    GetActionCatagories: API_TEMPLATE_URL + "public/categories", //with dept id parameter
    GetActionSubacategories: API_TEMPLATE_URL + "public/subcategories", //inside query parameter, need dept id and cat id
    GetActionDepartments: API_TEMPLATE_URL + "public/departments",
  },
  AGENT: {
    GetAllChatsWithCustomer:
      API_TEMPLATE_URL + "agent/get-all-chats-with-customer",
    GetChatDetails: API_TEMPLATE_URL + "agent/get-chat", //pass chat id as param
    SendMessageToCustomer: API_TEMPLATE_URL + "agent/send-to-customer",
    SendMessageToTeam: API_TEMPLATE_URL + "agent/send-to-team",
    ChangeChatStatus: API_TEMPLATE_URL + "agent/change-chat-status", // body {chatId, setStatus}
    CreateCryptoTransaction:
      API_TEMPLATE_URL + "agent/create-crypto-transaction",
    CreateCardTransaction: API_TEMPLATE_URL + "agent/create-card-transaction",
  },

};

const OUR_ENDPOINT= {
  
  //Sir wale.
  CUSTOMER: {
    AllCustomers: API_DOMAIN + "/admin/get-all-customers",
    CustomerDetails: API_DOMAIN + "/admin/get-customer-details",
    CustomerTransactions: API_DOMAIN + "/admin/get-customer-transactions",
  },
  OPERATIONS: {
    Traansactions: API_DOMAIN + '/get-admin-transaction',
    Departments: API_DOMAIN + '/admin/get-all-department',
    AgentByDepartment: API_DOMAIN + '/admin/get-agent-by-department',
    GetRate: API_DOMAIN + '/admin/get-rate',
    GetTeam: API_DOMAIN + '/admin/get-team-members',
    GetCategories: API_DOMAIN + '/admin/get-all-categories',
    GetSubCategories: API_DOMAIN + '/admin/get-all-subcategories',
    GetAllUsers: API_DOMAIN + '/admin/get-all-users',
    GetBanner: API_DOMAIN + '/admin/get-all-banners',
    CreateBanner: API_DOMAIN + '/admin/create-banner',
    UpdateBanner: API_DOMAIN + '/admin/update-banner',
    DeleteBanner: API_DOMAIN + '/admin/delete-banner',
    CreateDepartment: API_DOMAIN + '/admin/create-department',
    UpdateDepartment: API_DOMAIN + '/admin/update-department',
    DeleteDepartment: API_DOMAIN + '/admin/delete-department',

    CreateAgent: API_DOMAIN + '/admin/create-agent',
    UpdateAgent: API_DOMAIN + '/admin/update-agent',

    CreateCategory: API_DOMAIN + '/admin/create-category',
    UpdateCategory: API_DOMAIN + '/admin/update-category',
    DeleteCategory: API_DOMAIN + '/admin/delete-category',
    CreateSubCategory: API_DOMAIN + '/admin/create-subcategory',
    UpdateSubCategory: API_DOMAIN + '/admin/update-subcategory'
  }
}
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoiamFuZWRvZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDI2NTY1MSwiZXhwIjoxNzM0MzUyMDUxfQ.WcAYp6kVtc5DYyK0NuK1yt0C9gwt9t8um_XSE5qMHvA";
export {token, OUR_ENDPOINT ,API_DOMAIN};