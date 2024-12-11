import { apiCall } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<ILoginResponse> => {
  return await apiCall(API_ENDPOINTS.COMMON.login, 'POST', data);
};

export enum UserRoles {
  admin = 'admin',
  customer = 'customer',
  agent = 'agent',
}

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
  };
  token: string;
}
