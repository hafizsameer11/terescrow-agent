export const API_BASE_URL = 'http://192.168.18.9:8000';

export const API_TEMPLATE_URL = API_BASE_URL + '/api/';

export const API_ENDPOINTS = {
  COMMON: {
    login: API_TEMPLATE_URL + 'public/login',
    register: API_TEMPLATE_URL + 'register',
    forgotPassword: API_TEMPLATE_URL + 'forgot-password',
    resetPassword: API_TEMPLATE_URL + 'reset-password',
    verifyEmail: API_TEMPLATE_URL + 'verify-email',
    verifyOtp: API_TEMPLATE_URL + 'verify-otp',
    resendOtp: API_TEMPLATE_URL + 'resend-otp',
    changePassword: API_TEMPLATE_URL + 'change-password',
    logout: API_TEMPLATE_URL + 'logout',
    profile: API_TEMPLATE_URL + 'profile',
  },
  AGENT: {
    GetAllChatsWithCustomer:
      API_TEMPLATE_URL + 'agent/get-all-chats-with-customer',
    GetChatDetails: API_TEMPLATE_URL + 'agent/get-chat', //pass chat id as param
    SendMessageToCustomer: API_TEMPLATE_URL + 'agent/send-to-customer',
    SendMessageToTeam: API_TEMPLATE_URL + 'agent/send-to-team',
  },
};
