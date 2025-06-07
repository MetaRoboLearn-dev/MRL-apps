import {PropsWithChildren, useEffect, useState} from "react";
import {CodeContext} from "./Context.tsx";
import {useSettings} from "../hooks/useSettings.ts";

export const CodeProvider = ({ children }: PropsWithChildren) => {
  const { selectedTab } = useSettings();
  const [code, setCode] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(selectedTab || '');
    if (!raw) {
      setCode('');
      return
    }

    const data = JSON.parse(raw);

    setCode(data.code);
    setLoaded(true)
  }, [selectedTab]);

  useEffect(() => {
    if (!selectedTab || !loaded) return;

    try {
      const current = localStorage.getItem(selectedTab);
      const parsed = current ? JSON.parse(current) : {};

      const updated = {
        ...parsed,
        code,
      };

      localStorage.setItem(selectedTab, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update localStorage entry:", err);
    }
  }, [code, loaded, selectedTab]);

  return (
    <CodeContext.Provider value={{
      code, setCode
    }}>
      {children}
    </CodeContext.Provider>
  );
};
