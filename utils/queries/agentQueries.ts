import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';

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

export interface IAllCustomerChatsRes extends ApiResponse {
  data: {
    id: number;
    customer: IUser;
    recentMessage: IResMessage;
    recentMessageTimestamp: Date;
    chatStatus: ChatStatus;
    messagesCount: number;
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
}

export enum ChatStatus {
  pending = 'pending',
  successful = 'successful',
  declined = 'declined',
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
