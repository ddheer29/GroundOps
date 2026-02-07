import { ToastShowParams } from 'react-native-toast-message';

export interface ShowOptions extends ToastShowParams {
  successProps?: any;
  errorProps?: any;
  infoProps?: any;
}

export interface ToastProps {
  config?: any;
  [key: string]: any;
}
