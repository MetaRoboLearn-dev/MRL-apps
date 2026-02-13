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
    ? 'bg-tomato-600' : 'bg-tomato-300 pt-2 pb-3.5 translate-y-1.5 hover:bg-tomato-600 hover:translate-y-0.5';

  const handleClick = () => {
    setActive(!active);
  }

  return (
    <div className="header flex-between font-display">
      <div className="bg-sunglow-400 text-dark-neutrals-400 tab">
        Uređivač koda
      </div>

      <div className={'text-dark tab'}>
        Vaša grupa: <span className={'font-extrabold'} onClick={() => {
          showModal('Izmjena naziva grupe', <GroupNameForm />)
      }}>{groupName}</span>
      </div>

      <div
        className={`${style} text-light tab hover:cursor-pointer transition`}
        onClick={handleClick}
      >
        <h1>Priručnik</h1>
      </div>
    </div>
  );
};

export default CodeHeader;
