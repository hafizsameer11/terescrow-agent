import { apiCall, ApiResponse } from '../customApiCalls';
import { API_ENDPOINTS, token } from '../apiConfig';
import { UserRoles } from '@/contexts/socketContext';
import { IResMessage } from '../queries/agentQueries';

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<ILoginResponse> => {
  return await apiCall(API_ENDPOINTS.COMMON.login, 'POST', data);
};
export const loginAgent = async (data: {
  email: string;
  password: string;
}): Promise<ILoginResponse> => {
  return await apiCall(API_ENDPOINTS.COMMON.AgntLogin, 'POST', data);
};

export const sendMessageToTeam = async (
  data:FormData,
  token: string
): Promise<ISendMessageToTeamResponse> => {
  console.log(data, token);
  return await apiCall(
    API_ENDPOINTS.COMMON.SendMessageToTeam,
    'POST',
    data,
    token
  );
};

export const readAllMessages = async ({
  chatId,
  token,
}: {
  chatId: string;
  token: string;
}): Promise<ApiResponse> => {
  return await apiCall(
    API_ENDPOINTS.COMMON.MarkAllAsRead,
    'POST',
    { chatId },
    token
  );
};

interface ILoginResponse {
  message: string;
  data: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    profilePicture: string | null;
    email: string;
    role: UserRoles;
    createdAt?: string;
    gender?: string;
    assignedDepartments: { department: { id: number; title: string } }[];


  };
  token: string;
}

interface ISendMessageToTeamResponse extends ApiResponse {
  data: IResMessage;
}
