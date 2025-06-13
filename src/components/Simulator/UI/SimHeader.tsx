import SimTab from "./SimTab.tsx";
import {useEffect, useState} from "react";
import SimCreate from "./SimCreate.tsx";
import {useSettings} from "../../../hooks/useSettings.ts";
import {useVehicle} from "../../../hooks/useVehicle.ts";
import {useUI} from "../../../hooks/useUI.ts";
import CamTab from "../Camera/CamTab.tsx";

const SimHeader = () => {
  const { selectedTab, setSelectedTab } = useSettings();
  const { isMoving } = useVehicle();
  const { modalVisible } = useUI();
  const [simKeys, setSimKeys] = useState<string[]>([]);

  useEffect(() => {
    const loadDemo = async () => {
      if (localStorage.getItem('selectedID') === null) {
        const res = await fetch('/demo.json');
        const data = await res.json();
        localStorage.setItem('sim1', JSON.stringify(data));
        setSelectedTab('sim1');
      }
      const keys = Object.keys(localStorage).filter((key) => key !== 'selectedID' && key !== 'robotUrl');
      setSimKeys(keys);
    };

    loadDemo();
  }, [selectedTab, setSelectedTab]);

  useEffect(() => {
    localStorage.setItem('selectedID', selectedTab);
  }, [selectedTab]);

  const handleTabChange = (id: string) => {
    if (isMoving || modalVisible) return;
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
        <CamTab />
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
