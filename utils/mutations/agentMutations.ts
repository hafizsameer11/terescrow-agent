import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';
import { IResMessage } from '../queries/agentQueries';

export const sendMessageToCustomer = async (
  data: { chatId: string; message: string },
  token: string
): Promise<IMesssageToCustomer> => {
  console.log(data);
  return await apiCall(
    API_ENDPOINTS.AGENT.SendMessageToCustomer,
    'POST',
    data,
    token
  );
};

interface IMesssageToCustomer extends ApiResponse {
  data: IResMessage;
}
