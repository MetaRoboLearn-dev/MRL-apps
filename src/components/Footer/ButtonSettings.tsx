import {BsGearFill} from "react-icons/bs";
import {useSettings} from "../../hooks/useSettings.ts";

interface Props {
  disabled: boolean;
  setEditingUrl: (editingUrl: boolean) => void;
  setUrlInput: (urlInput: string) => void;
}

const ButtonSettings = ({disabled, setEditingUrl, setUrlInput}: Props) => {
  const { robotUrl } = useSettings();

  return (
    <button disabled={disabled}
            className={`bg-dark-neutrals-100 text-dark-neutrals-400 button-square ml-2 
                          ${disabled ? 'bg-dark-neutrals-400 text-dark-neutrals-600' : 'hover:cursor-pointer hover:bg-dark-neutrals-200'} transition`}
            onClick={() => {
              setEditingUrl(true);
              setUrlInput(robotUrl || '')
            }}>
      <BsGearFill size={18} />
    </button>
  );
};

export default ButtonSettings;