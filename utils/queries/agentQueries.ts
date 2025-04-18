import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';
import { CustomerTransactionResponse } from './datainterfaces';

export const getAllChatsWithCustomer = async (
  token: string
): Promise<IAllCustomerChatsRes> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetAllChatsWithCustomer,
    'GET',
    undefined,
    token
  );
};
export const getAllDefaultChats = async (
  token: string
): Promise<IDefaultChats> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetPendingChats,
    'GET',
    undefined,
    token
  );
};

export const getCustomerChatDetails = async (
  chatId: string,
  token: string
): Promise<IChatDetailsRes> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetCustomerChatDetails + '/' + chatId,
    'GET',
    undefined,
    token
  );
};

export const getAgentStats = async (token: string): Promise<StatsResponse> => {
  return await apiCall(
    API_ENDPOINTS.COMMON.GetAgentStats,
    'GET',
    undefined,
    token
  );

}
export const getTeamNotifications = async (token: string): Promise<IInAppNotificationResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetTeamNotifications,
    'GET',
    undefined,
    token
  );

}


export const getCustomerNotifications = async (token: string): Promise<IInAppNotificationResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetCustomerNotifications,
    'GET',
    undefined,
    token
  );

}

export const getAllNotiications = async (token: string): Promise<IInAppNotificationResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetAllNotifications,
    'GET',
    undefined,
    token
  );

}
export const getTransactionForAgent = async (token: string): Promise<CustomerTransactionResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetTransactionForAgent,
    'GET',
    undefined,
    token
  );
}
export const getTransactionStatsForAgent = async (token: string): Promise<TransactionStateResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetTransactionStats,
    'GET',
    undefined,
    token
  );
}
export const getNotesForCustomer = async (token: string, id: string): Promise<any> => {
  return await apiCall(
    ` ${API_ENDPOINTS.AGENT.GetNotesForCustomer}/${id}`,
    'GET',
    undefined,
    token
  );
}

export const getAllQuickReplies = async (token: string): Promise<QuickReplyResponse> => {
  return await apiCall(API_ENDPOINTS.AGENT.GetQuickReplies, 'GET', undefined, token)
}
export const deleteQuickReply = async (id: number, token: string): Promise<ApiResponse> => {
  return await apiCall(`${API_ENDPOINTS.AGENT.DeleteQuickReply}/${id}`, 'GET', undefined, token)
}
export interface QuickReply {
  id: number
  message: string
  userId: number
  createdAt: string
}
export interface QuickReplyResponse extends ApiResponse {
  data: QuickReply[]
}

export interface IInAppNotificationResponse extends ApiResponse {
  data: InAppNotifications[]
}
interface TransactionStateResponse {
  status: string;
  message: string;
  data: {
    totalTransactions: number; // Total number of transactions
    totaltransactionAmountSum: {
      _sum: {
        amount: number; // Sum of all transaction amounts
        amountNaira: number; // Sum of transaction amounts in Naira
      };
    };
    cryptoTransactions: {
      _count: number; // Total number of crypto transactions
      _sum: {
        amount: number | null; // Sum of crypto transaction amounts
        amountNaira: number | null; // Sum of crypto transaction amounts in Naira
      };
    };
    giftCardTransactions: {
      _count: number; // Total number of gift card transactions
      _sum: {
        amount: number; // Sum of gift card transaction amounts
        amountNaira: number; // Sum of gift card transaction amounts in Naira
      };
    };
  };
}
export interface InAppNotifications {
  id: number,
  title: string,
  description: string,
  type: string,
  createdAt: string,
  isRead: boolean,

}
interface StatsData {
  totalChats: number;
  successfulllTransactions: number;
  pendingChats: number;
  declinedChats: number;
}

interface StatsResponse {
  status: string;
  message: string;
  data: StatsData;
}

export interface IAllCustomerChatsRes extends ApiResponse {
  data: {
    id: number;
    customer: IUser;
    recentMessage: IResMessage;
    recentMessageTimestamp: Date;
    chatStatus: ChatStatus;
    messagesCount: number;
    department?: IDepartment;
  }[];
}
export interface IDefaultChats extends ApiResponse {
  data: {
    id: number;
    customer: IUser;
    recentMessage: IResMessage;
    recentMessageTimestamp: Date;
    chatStatus: ChatStatus;
    messagesCount: number;
    department: IDepartment;
  }[];
}

export interface IDepartment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive';
  title: string;
  description: string;
  icon: string;
}

export interface ICategory {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  subTitle: string | null;
  image: string | null;
}
interface ChatDetails {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  chatId: number;
  category: ICategory;
  department: IDepartment;
  departmentId: number;
  categoryId: number;
  status: ChatStatus;
}

interface IChatDetailsRes extends ApiResponse {
  data: {
    id: number;
    customer: IUser;
    messages: IResMessage[];
    chatDetails: ChatDetails;
    chatType: ChatType;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface IResMessage {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  chatId: number;
  message: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  image?: string;
}

export enum ChatStatus {
  pending = 'pending',
  successful = 'successful',
  declined = 'declined',
  unsucessful = 'unsucessful',
}

export enum ChatType {
  customer_to_agent = 'customer_to_agent',
  team_chat = 'team_chat',
  group_chat = 'group_chat',
}

export interface IUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  profilePicture: string | null;
}
