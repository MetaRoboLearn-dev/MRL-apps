import {useUI} from "../../hooks/useUI.ts";
import {useSettings} from "../../hooks/useSettings.ts";
import {useState} from "react";

const GroupNameForm = () => {
  const { setModalVisible } = useUI();
  const { groupName, setGroupName } = useSettings();

  const [newName, setNewName] = useState<string>(groupName);

  const set = () =>{
    setGroupName(newName);
  }

  return (
    <>
      <div className={'flex flex-col mb-3'}>
        <label className={'mr-5 text-lg'}>Naziv grupe</label>
        <input type='text'
               placeholder={'Unesite oznaku'}
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               className={'w-full bg-sunglow-600 p-2 rounded'}/>
      </div>

      <div className={'text-lg pt-8 text-right'}>
        <span
          className={'bg-sunglow-600/70 px-4 py-2 rounded font-semibold transition hover:cursor-pointer hover:bg-sunglow-600 mr-3'}
          onClick={() => {
            setModalVisible(false);
            set();
          }}>Stvori
        </span>
        <span
          className={'bg-sunglow-600/70 px-4 py-2 rounded font-semibold transition hover:cursor-pointer hover:bg-sunglow-600'}
          onClick={() => {
            setModalVisible(false);
          }}>Odustani
        </span>
      </div>
    </>
  );
};

export default GroupNameForm;