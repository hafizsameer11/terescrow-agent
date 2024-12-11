import Toast from 'react-native-toast-message';

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
