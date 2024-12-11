import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';

export const getAllChatsWithCustomer = async (
  token: string
): Promise<IAllChatsRes> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetAllChatsWithCustomer,
    'GET',
    undefined,
    token
  );
};

export const getChatDetails = async (
  chatId: string,
  token: string
): Promise<IChatDetailsRes> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.GetChatDetails + '/' + chatId,
    'GET',
    undefined,
    token
  );
};

interface IAllChatsRes extends ApiResponse {
  data: {
    id: number;
    customer: {
      id: number;
      username: string;
      firstname: string;
      lastname: string;
      profilePicture: string | null;
    };
    recentMessage: string;
    recentMessageTimestamp: Date;
    chatStatus: ChatStatus;
  }[];
}

interface IChatDetailsRes extends ApiResponse {
  data: {
    id: number;
    customer: {
      id: number;
      username: string;
      firstname: string;
      lastname: string;
      profilePicture: string | null;
    };
    messages: IResMessage[];
    chatDetails: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      chatId: number;
      departmentId: number;
      categoryId: number;
      status: ChatStatus;
    };
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
}

export enum ChatStatus {
  pending,
  successful,
  declined,
}

export enum ChatType {
  customer_to_agent,
  team_chat,
  group_chat,
}
