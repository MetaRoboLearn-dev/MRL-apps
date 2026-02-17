import {PropsWithChildren} from 'react';
import UIProvider from "../UIProvider.tsx";
import ToastProvider from "../ToastProvider.tsx";

const AppProviders = ({children}: PropsWithChildren) => {
  return (
    <ToastProvider>
      <UIProvider>
          {children}
      </UIProvider>
    </ToastProvider>
  );
};

export default AppProviders;