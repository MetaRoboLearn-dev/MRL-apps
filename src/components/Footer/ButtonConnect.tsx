import {FaRobot} from "react-icons/fa";
import {useSettings} from "../../hooks/useSettings.ts";

interface Props {
  disabled: boolean;
  setEditingUrl: (editingUrl: boolean) => void;
  urlInput: string;
  setUrlInput: (urlInput: string) => void;
}

const ButtonConnect = ({disabled, setEditingUrl, urlInput, setUrlInput} : Props) => {
  const { setRobotUrl } = useSettings();

  const changeRobotUrl = () => {
    setRobotUrl(urlInput)
    if (!urlInput) return;
    localStorage.setItem('robotUrl', urlInput);
    setEditingUrl(false);
  }

  return (
    <>
      <input type='text'
             placeholder={'Unesite adresu'}
             value={urlInput}
             onChange={(e) => setUrlInput(e.target.value)}
             className={'bg-light-cyan-50 p-2 rounded border-2 border-dark-neutrals-100 font-display'}/>
      <button disabled={disabled}
              className={`bg-sunglow-500 text-dark-neutrals-400 button-lg ml-2
                      ${disabled ? 'bg-sunglow-700' : 'hover:cursor-pointer hover:bg-sunglow-600'} transition`}
              onClick={changeRobotUrl}>
        <FaRobot size={24}/>
        <span className={'ml-4'}>Spoji se</span>
      </button>
    </>
  );
};

export default ButtonConnect;