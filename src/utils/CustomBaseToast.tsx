import React from 'react';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';
import { StyleProp, ViewStyle } from 'react-native';

interface CustomBaseToastProps extends BaseToastProps {
  onTrailingIconPress?: () => void;
  style?: StyleProp<ViewStyle>;
  leadingIcon?: React.ReactNode;
}

export const CustomBaseToast = ({ 
  onTrailingIconPress, 
  style, 
  leadingIcon,
  ...rest 
}: CustomBaseToastProps) => {
  return (
    <BaseToast
      {...rest}
      style={[
        {
          borderLeftWidth: 5,
          paddingHorizontal: 15,
          paddingVertical: 10,
        },
        style,
      ]}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: 13,
      }}
      renderLeadingIcon={() => leadingIcon}
    />
  );
};
