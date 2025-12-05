import {useSettings} from "../../hooks/useSettings.ts";
import {useUI} from "../../hooks/useUI.ts";
import GroupNameForm from "../Forms/GroupNameForm.tsx";

interface Props {
  active: boolean;
  setActive: (active: boolean) => void;
}

const CodeHeader = ({active, setActive}: Props) => {
  const { groupName } = useSettings()
  const { showModal } = useUI();

  const style = active
    ? 'bg-tomato-600 hover:translate-y-1'
    : 'bg-tomato-300 pt-2 pb-3.5 translate-y-2.5 hover:bg-tomato-600 hover:translate-y-1.5';

  const handleClick = () => {
    setActive(!active);
  }

  return (
    <div className="bg-white px-4 w-full h-14 flex justify-between items-end z-10">
      <div className="flex items-center space-x-4">
        <div className="bg-sunglow-400 text-dark-neutrals-400 font-bold font-display mx-1 py-2 px-4 rounded-t-lg">
          Uređivač koda
        </div>
      </div>

      <div className={'text-dark-neutrals-400 font-bold font-display mx-1 py-2 px-4 rounded-t-lg select-none'}>
        Vaša grupa: <span className={'font-extrabold'} onClick={() => {
          showModal('Izmjena naziva grupe', <GroupNameForm />)
      }}>{groupName}</span>
      </div>

      <div
        className={`${style} text-white-smoke-200 font-bold font-display mx-1 py-2 px-4 rounded-t-lg select-none hover:cursor-pointer transition`}
        onClick={handleClick}
      >
        <h1>Priručnik</h1>
      </div>
    </div>
  );
};

export default CodeHeader;
