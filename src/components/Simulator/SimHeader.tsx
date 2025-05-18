import SimTab from "./SimTab.tsx";
import {useEffect, useState} from "react";
import SimCreate from "./SimCreate.tsx";
import {useSettings} from "../../hooks/useSettings.ts";

const SimHeader = () => {
  const { selectedTab, setSelectedTab } = useSettings();
  const [simKeys, setSimKeys] = useState<string[]>([]);

  useEffect(() => {
    const loadDemo = async () => {
      if (localStorage.getItem('selectedID') === null) {
        const res = await fetch('/demo.json');
        const data = await res.json();
        localStorage.setItem('sim1', JSON.stringify(data));
        setSelectedTab('sim1'); // optional: select it immediately
      }

      const keys = Object.keys(localStorage).filter((key) => key !== 'selectedID');
      setSimKeys(keys);
    };

    loadDemo();
  }, [selectedTab, setSelectedTab]);

  useEffect(() => {
    localStorage.setItem('selectedID', selectedTab);
  }, [selectedTab]);

  const handleTabChange = (id: string) => {
    setSelectedTab(id);
  };

  const remove = (id: string) => {
    if (selectedTab === id) {
      setSelectedTab('');
    }
    localStorage.removeItem(id);
    setSimKeys(Object.keys(localStorage).filter((key) => key !== 'selectedID'));
  };

  return (
    <div className={'w-full flex justify-between items-end'}>
      <ul className={"bg-white px-4 h-14 flex items-end"}>
        {simKeys.map((key) => (
          <SimTab
            key={key}
            id={key}
            label={key}
            isChecked={key === selectedTab}
            onTabChange={handleTabChange}
            remove={remove}
          />
        ))}
      </ul>
      <SimCreate />
    </div>
  );
};

export default SimHeader;
