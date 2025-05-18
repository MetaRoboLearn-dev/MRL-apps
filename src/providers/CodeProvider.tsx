import {PropsWithChildren, useEffect, useState} from "react";
import {CodeContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";

export const CodeProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();

  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) return;

    const data = JSON.parse(raw);

    setCode(data.code);
  }, [selectedTab]);

  return (
    <CodeContext.Provider value={{
      code, setCode
    }}>
      {children}
    </CodeContext.Provider>
  );
};
