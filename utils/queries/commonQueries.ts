import axios from 'axios';
import { apiCall, ApiResponse } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';
import { ChatType, IUser } from './agentQueries';

export const getDepartments = async (
  token: string
): Promise<IDepartmentResponse> => {
  return await apiCall(
    API_ENDPOINTS.COMMON.GetActionDepartments,
    'GET',
    undefined,
    token
  );
};

export const getCategories = async (
  token: string,
  departmentId: string
): Promise<ICategoryResponse> => {
  return await apiCall(
    API_ENDPOINTS.COMMON.GetActionCatagories + '/' + departmentId,
    'GET',
    undefined,
    token
  );
};

export const getSubCategories = async (
  token: string,
  departmentId: string,
  categoryId: string
): Promise<ISubCategoryResponse> => {
  return await apiCall(
    `${API_ENDPOINTS.COMMON.GetActionSubacategories}?departmentId=${departmentId}&categoryId=${categoryId}`,
    'GET',
    undefined,
    token
  );
};

export const getAllTeamChats = async (
  token: string
): Promise<ITeamChatResponse> => {
  // console.log('messages fetching...');
  return await apiCall(
    API_ENDPOINTS.COMMON.GetAllTeamChats,
    'GET',
    undefined,
    token
  );
};

export const getTeamChatDetails = async (
  token: string,
  chatId: string
): Promise<ITeamChatDetailsResponse> => {
  return await apiCall(
    API_ENDPOINTS.COMMON.GetTeamChatDetails + '/' + chatId,
    'GET',
    undefined,
    token
  );
};

// department quick actions
export interface IDepartmentResponse extends ApiResponse {
  data: {
    id: number;
    icon: string;
    title: string;
    status: 'active' | 'inactive';
    description: string;
  }[];
}

export interface ICategoryResponse extends ApiResponse {
  data: {
    departmentId: number;
    categories: {
      category: {
        id: number;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        subTitle: string | null;
        image: string | null;
      };
    }[];
  };
}

export interface ISubCategoryResponse extends ApiResponse {
  data: {
    departmentId: string;
    categoryId: string;
    subCategories: [
      {
        subCategory: {
          id: number;
          title: string;
          createdAt: Date;
          updatedAt: Date;
          price: number;
        };
      }
    ];
  };
}

export interface ITeamChatDetailsResponse extends ApiResponse {
  data: {
    id: number;
    _count: {
      messages: number;
    };
    chatType: ChatType;
    participants: {
      user: IUser;
    }[];
    messages: {
      id: number;
      createdAt: Date;
      updatedAt: Date;
      chatId: number;
      message: string;
      senderId: number;
      receiverId: number;
      isRead: boolean;
    }[];
    chatGroup: {
      groupName: string;
      groupProfile: string | null;
      adminId: number;
    } | null;
  };
}

export interface ITeamChatResponse extends ApiResponse {
  data: ITeamChatDetailsResponse['data'][];
}
