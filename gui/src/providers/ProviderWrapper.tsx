import {PropsWithChildren} from 'react';
import UIProvider from "./UIProvider.tsx";
import {SettingsProvider} from "./SettingsProvider.tsx";
import {CodeProvider} from "./CodeProvider.tsx";
import GridProvider from "./GridProvider.tsx";
import {VehicleProvider} from "./VehicleProvider.tsx";
import ToastProvider from "./ToastProvider.tsx";

const ProviderWrapper = ({children}: PropsWithChildren) => {
  return (
    <ToastProvider>
        <UIProvider>
          <SettingsProvider>
            <CodeProvider>
              <GridProvider>
                <VehicleProvider>
                  {children}
                </VehicleProvider>
              </GridProvider>
            </CodeProvider>
          </SettingsProvider>
        </UIProvider>
      </ToastProvider>
  );
};

export default ProviderWrapper;