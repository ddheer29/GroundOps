import React from 'react'

import RawToast, {ToastConfig, ToastProps} from 'react-native-toast-message'
import { CustomBaseToast } from './CustomBaseToast'
import { VectorIcon } from '../icons'
import { ShowOptions } from '../types'


const toastConfig: ToastConfig = {
  success: ({...rest}) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={{borderLeftColor: '#10b981'}}
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
    )
  },
  error: ({...rest}) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={{borderLeftColor: '#ef4444'}}
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
    )
  },
  info: ({...rest}) => {
    return (
      <CustomBaseToast
        onTrailingIconPress={rest?.hide}
        style={{borderLeftColor: '#3b82f6'}}
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
    )
  },
}

const Toast = ({...rest}: ToastProps) => {
  return <RawToast config={toastConfig} {...rest} />
}

Toast.show = (props: ShowOptions) => {
  RawToast.show(props)
}

Toast.hide = () => {
  RawToast.hide()
}

export default Toast
