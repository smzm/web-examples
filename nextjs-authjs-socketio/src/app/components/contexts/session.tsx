'use client';
import { SessionProvider as Provider } from 'next-auth/react';
import React from 'react';

type Props = {
  children?: React.ReactNode;
};

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Provider>{children}</Provider>;
};
