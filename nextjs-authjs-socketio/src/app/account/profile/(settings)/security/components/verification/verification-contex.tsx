import { createContext, useContext, useReducer, useState } from 'react';

type VerificationState = {
  showPassword: boolean;
  showPhone: boolean;
  showOtp: boolean;
};

const initialState = {
  showPassword: true,
  showPhone: false,
  showOtp: false,
};

function reducer(state: VerificationState, menu: string) {
  switch (menu) {
    case 'password':
      return {
        ...state,
        showPassword: true,
        showPhone: false,
        showOtp: false,
      };
    case 'phone':
      return {
        ...state,
        showPassword: false,
        showPhone: true,
        showOtp: false,
      };
    case 'otp':
      return {
        ...state,
        showPassword: false,
        showPhone: false,
        showOtp: true,
      };
    default:
      return state;
  }
}

const VerificationContext = createContext<{
  showPassword: boolean;
  showPhone: boolean;
  showOtp: boolean;
  dispatch: React.Dispatch<string>;
  isVerified: Boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<Boolean>>;
  path: string;
}>({
  showPassword: false,
  showPhone: false,
  showOtp: false,
  dispatch: (menu: string) => {},
  isVerified: false,
  setIsVerified: () => {},
  path: '',
});

export default function VerificationProvider({
  children,
  isVerified,
  setIsVerified,
  path,
}: {
  children: React.ReactNode;
  isVerified: Boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<Boolean>>;
  path: string;
}) {
  const [updated_state, dispatch] = useReducer(reducer, initialState);
  const { showPassword, showPhone, showOtp } = updated_state;

  return (
    <VerificationContext.Provider
      value={{
        dispatch,
        showPassword,
        showPhone,
        showOtp,
        isVerified,
        setIsVerified,
        path,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error(
      'useVerification must be used within a VerificationProvider',
    );
  }
  return context;
}
