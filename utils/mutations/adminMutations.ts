import { apiCall, ApiResponse } from '../customApiCalls';
import { API_ENDPOINTS } from '../apiConfig';

export const createChatGroup = async ({
  data,
  token,
}: {
  data: IChatGroupReq;
  token: string;
}): Promise<ApiResponse> => {
  return await apiCall(
    API_ENDPOINTS.ADMIN.CreateChatGroup,
    'POST',
    data,
    token
  );
};

interface IChatGroupReq {
  participants: { id: number }[];
  groupName: string;
}
