import { API_ENDPOINTS } from '../apiConfig';
import { apiCall, ApiResponse } from '../customApiCalls';
import { ChatStatus, IResMessage } from '../queries/agentQueries';

export const sendMessageToCustomer = async (
  data: FormData,
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
export const overTakeChat = async (
  chatId: string,
  token: string
): Promise<ApiResponse> => (
  await apiCall(
    `${API_ENDPOINTS.AGENT.TakeOverDefaultChat}/${chatId}`,
    'POST',
    undefined,
    token
  )
)

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

export const editAgentProfile = async (
  data: EditAgentProfileReq,
  token: string,
  id: number
): Promise<ApiResponse> => {
  return await apiCall(`${API_ENDPOINTS.COMMON.UpdateCustomer}/${id}`, 'POST', data, token);
};

export const createNoteForCustomer = async (
  data: CreateNoteForCustomerReq,
  token: string
): Promise<ApiResponse> => (
  await apiCall(API_ENDPOINTS.AGENT.CreateNoteForCustomer, 'POST', data, token
  )
)
export const deleteNoteForCustomer = async (
  noteId: number,
  token: string
): Promise<ApiResponse> => (
  await apiCall(`${API_ENDPOINTS.AGENT.DeleteNote}/${noteId}`, 'GET', undefined, token)
)

export const updateQuickReply = async (
  data: { message: string },
  token: string,
  id: number
): Promise<ApiResponse> =>
  await apiCall(`${API_ENDPOINTS.AGENT.UpdateQuickReply}/${id}`, 'POST', data, token)

export const createQuickReply = async (
  data: { message: string },
  token: string
): Promise<ApiResponse> =>
  await apiCall(`${API_ENDPOINTS.AGENT.CreateQuickReplies}`, 'POST', data, token)
interface IMesssageToCustomer extends ApiResponse {
  data: IResMessage;
}

interface ITransactionReq {
  subCategoryId: number;
  countryId: number;
  chatId: number;
  amount: number;
  exchangeRate: number;
  amountNaira: number;
}
interface ICryptoTransactionReq extends ITransactionReq {
  cryptoAmount: number;
  departmentId?: number;
  categoryId?: number;
  toAddress: string;
  fromAddress: string;
}

interface ICardTransactionReq extends ITransactionReq {
  cardType: string;
  cardNumber: string;
  departmentId?: number;
  categoryId?: number;
}
export interface EditAgentProfileReq {
  firstname: string,
  lastname: string,
  profilePicture: string,
  email: string,
  phoneNumber: string,
  gender: string,
  username: string
  country?: string
}
export interface CreateNoteForCustomerReq {
  userId: number,
  note: string,
  title?: string
}