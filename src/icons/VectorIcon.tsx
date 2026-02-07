import React from 'react';
import Icon from '@react-native-vector-icons/ionicons';

interface VectorIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const VectorIcon = ({ name, size = 24, color = '#000' }: VectorIconProps) => {
  return <Icon name={name as any} size={size} color={color} />;
};
