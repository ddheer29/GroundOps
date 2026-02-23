import React from 'react';
import { StyleSheet } from 'react-native';

import RawToast, { ToastConfig, ToastProps } from 'react-native-toast-message';
import { CustomBaseToast } from './CustomBaseToast';
import { VectorIcon } from '../icons';
import { ShowOptions } from '../types';

const styles = StyleSheet.create({
  successBorder: { borderLeftColor: '#10b981' },
  errorBorder: { borderLeftColor: '#ef4444' },
  infoBorder: { borderLeftColor: '#3b82f6' },
});

const toastConfig: ToastConfig = {
  success: ({ ...rest }) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={styles.successBorder}
        leadingIcon={
          <VectorIcon
            name={'checkmark-circle-outline'}
            size={24}
            color={'#10b981'}
          />
        }
        text1NumberOfLines={3}
        text2NumberOfLines={2}
        {...rest}
        {...rest?.props?.successProps}
      />
    );
  },
  error: ({ ...rest }) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={styles.errorBorder}
        leadingIcon={
          <VectorIcon
            name={'close-circle-outline'}
            size={24}
            color={'#ef4444'}
          />
        }
        text1NumberOfLines={3}
        text2NumberOfLines={2}
        {...rest}
        {...rest?.props?.errorProps}
      />
    );
  },
  info: ({ ...rest }) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={styles.infoBorder}
        leadingIcon={
          <VectorIcon
            name={'information-circle-outline'}
            size={24}
            color={'#3b82f6'}
          />
        }
        text1NumberOfLines={3}
        text2NumberOfLines={2}
        {...rest}
        {...rest?.props?.infoProps}
      />
    );
  },
};

const Toast = ({ ...rest }: ToastProps) => {
  return <RawToast config={toastConfig} {...rest} />;
};

Toast.show = (props: ShowOptions) => {
  RawToast.show(props);
};

Toast.hide = () => {
  RawToast.hide();
};

export default Toast;
