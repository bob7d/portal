import React from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

interface ILoaderProps {
    status?: string,
    color?: string,
}

// Thin wrapper around ink spinner component
export default ({status, color}: ILoaderProps) => (
  <Text>
    <Text color={color ?? "green"}>
      <Spinner type="dots" />
    </Text>
    {status ? ` ${status}` : ''}
  </Text>
);