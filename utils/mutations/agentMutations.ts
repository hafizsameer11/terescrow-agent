import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';
import { ChatStatus, IResMessage } from '../queries/agentQueries';

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

export const changeChatStatus = async (
  data: { chatId: string; setStatus: ChatStatus },
  token: string
): Promise<ApiResponse> => {
  return apiCall(API_ENDPOINTS.AGENT.ChangeChatStatus, 'POST', data, token);
};

export const createCryptoTransaction = async ({
  data,
  token,
}: {
  data: ICryptoTransactionReq;
  token: string;
}): Promise<ApiResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.CreateCryptoTransaction,
    'POST',
    data,
    token
  );
};

export const createCardTransaction = async ({
  data,
  token,
}: {
  data: ICardTransactionReq;
  token: string;
}): Promise<ApiResponse> => {
  return await apiCall(
    API_ENDPOINTS.AGENT.CreateCardTransaction,
    'POST',
    data,
    token
  );
};

interface IMesssageToCustomer extends ApiResponse {
  data: IResMessage;
}

interface ITransactionReq {
  departmentId: number;
  categoryId: number;
  subCategoryId: number;
  countryId: number;
  chatId: number;
  amount: number;
  exchangeRate: number;
  amountNaira: number;
}
interface ICryptoTransactionReq extends ITransactionReq {
  cryptoAmount: number;
  toAddress: string;
  fromAddress: string;
}

interface ICardTransactionReq extends ITransactionReq {
  cardType: string;
  cardNumber: string;
}
