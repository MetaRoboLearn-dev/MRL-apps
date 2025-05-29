import {useState} from "react";
import {useUI} from "../../hooks/useUI.ts";
import {useSettings} from "../../hooks/useSettings.ts";

const SimCreateForm = () => {
  const { setModalVisible } = useUI();
  const { setSelectedTab } = useSettings();

  const [id, setId] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [x, setX] = useState<string>('');
  const [z, setZ] = useState<string>('');

  const clear= () =>{
    setId('');
    setLabel('');
    setX('');
    setZ('');
  }

  const create = () => {
    if(localStorage.getItem(id)) return

    localStorage.setItem(id, JSON.stringify({
      "sizeX": x,
      "sizeZ": z,
      "start": null,
      "finish": null,
      "barriers": [],
      "stickers": [],
      "code": ""
    }));

    setSelectedTab(id);
  }

  return (
    <>
      <div className={'flex flex-col mb-3'}>
        <label className={'mr-5 text-lg'}>Oznaka</label>
        <input type='text'
               placeholder={'Unesite oznaku'}
               value={id}
               onChange={(e) => setId(e.target.value)}
               className={'w-full bg-sunglow-600 p-2 rounded'}/>
      </div>
      <div className={'flex flex-col mb-3'}>
        <label className={'mr-5 text-lg'}>Naziv</label>
        <input type='text'
               placeholder={'Unesite naziv'}
               value={label}
               onChange={(e) => setLabel(e.target.value)}
               className={'w-full bg-sunglow-600 p-2 rounded'}/>
      </div>
      <div className={'flex justify-between w-full'}>
        <div className={'flex flex-col mr-2'}>
          <label className={'mr-5 text-lg'}>Širina</label>
          <input type='text'
                 placeholder={'Unesite širinu'}
                 value={x}
                 onChange={(e) => setX(e.target.value)}
                 className={'w-full bg-sunglow-600 p-2 rounded'}/>
        </div>
        <div className={'flex flex-col'}>
          <label className={'mr-5 text-lg'}>Dužina</label>
          <input type='text'
                 placeholder={'Unesite dužinu'}
                 value={z}
                 onChange={(e) => setZ(e.target.value)}
                 className={'w-full bg-sunglow-600 p-2 rounded'}/>
        </div>
      </div>
      <div className={'text-lg pt-8 text-right'}>
        <span
          className={'bg-sunglow-600/70 px-4 py-2 rounded font-semibold transition hover:cursor-pointer hover:bg-sunglow-600 mr-3'}
          onClick={() => {
            setModalVisible(false);
            create();
            clear();
          }}>Stvori</span>
        <span
          className={'bg-sunglow-600/70 px-4 py-2 rounded font-semibold transition hover:cursor-pointer hover:bg-sunglow-600'}
          onClick={() => {
            setModalVisible(false);
            clear();
          }}>Odustani</span>
      </div>
    </>
  );
};

export default SimCreateForm;