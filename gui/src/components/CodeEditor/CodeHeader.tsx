import {useTaskConfig} from "../../hooks/useTaskConfig.ts";

interface Props {
  active: boolean;
  setActive: (active: boolean) => void;
  setEditor: (editor: string) => void;
}

const CodeHeader = ({active, setActive, setEditor}: Props) => {
  const {isEdit} = useTaskConfig()
  const style = active
    ? 'bg-tomato-600' : 'bg-tomato-300 pt-2 pb-3.5 translate-y-1.5 hover:bg-tomato-600 hover:translate-y-0.5';

  const handleClick = () => {
    setActive(!active);
  }

  return (
    <div className="header flex-between font-display">
      <div className="flex">

        {isEdit ? (
          <>
            <div className="bg-sunglow-400 text-dark-neutrals-400 tab hover:bg-sunglow-600 hover:cursor-pointer"
                 onClick={() => {setEditor('python')}}>
              Uređivač koda
            </div>

            <div className="bg-sunglow-400 text-dark-neutrals-400 tab hover:bg-sunglow-600 hover:cursor-pointer"
                 onClick={() => {setEditor('blockly')}}>
              Uređivač blokova
            </div>
        </>
        ) : (
          <div className="bg-sunglow-400 text-dark-neutrals-400 tab">
              Uređivač koda
            </div>
          )
        }

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
