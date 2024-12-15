import Toast from 'react-native-toast-message';
import { ITeamChatResponse } from './queries/commonQueries';
import { IAllCustomerChatsRes } from './queries/agentQueries';

export const showTopToast = (props: showTopToastProps) => {
  Toast.show({
    type: props.type,
    text1: props.text1,
    text2: props.text2,
    position: 'top',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
  });
};

export const timeFormatter = (date: Date) => {
  const newDate = new Date(date);
  const hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

interface showTopToastProps {
  type: 'error' | 'success' | 'info';
  text1: string;
  text2: string;
}

export const sortChatsByLatestMessage = (
  chats: ITeamChatResponse['data'] | undefined
): typeof chats => {
  if (!chats) return undefined;

  return [...chats].sort((a, b) => {
    const latestMessageA = a.messages[0]?.createdAt
      ? new Date(a.messages[0].createdAt).getTime()
      : 0;
    const latestMessageB = b.messages[0]?.createdAt
      ? new Date(b.messages[0].createdAt).getTime()
      : 0;

    // Sort in descending order of the latest message's createdAt
    return latestMessageB - latestMessageA;
  });
};

export const sortCustomerChatsByLatestMessage = (
  chats: IAllCustomerChatsRes['data'] | undefined
): typeof chats => {
  if (!chats) return undefined;

  return [...chats].sort((a, b) => {
    const latestMessageA = a?.recentMessage?.createdAt
      ? new Date(a.recentMessage.createdAt).getTime()
      : 0;
    const latestMessageB = b?.recentMessage?.createdAt
      ? new Date(b.recentMessage.createdAt).getTime()
      : 0;

    // Sort in descending order of the latest message's createdAt
    return latestMessageB - latestMessageA;
  });
};
