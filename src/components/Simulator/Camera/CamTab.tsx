import {useSettings} from "../../../hooks/useSettings.ts";

const CamTab = () => {
  const { camMode, setCamMode } = useSettings();

  const style = camMode ?
    ('bg-indigo-700 font-bold py-2') :
    ('bg-indigo-300 pt-2 pb-3.5 translate-y-2.5 ' +
      'hover:cursor-pointer hover:bg-indigo-500 hover:translate-y-1.5 transition');

  const switchToCam = () => {
    setCamMode(!camMode);
  }

  return (
    <li className={`${style} text-white-smoke-400 font-bold font-display mx-1 px-4 rounded-t-lg cursor-pointer hover:text-white`}
        onClick={switchToCam}>
      <label className="block">
        <span className={'cursor-pointer '}>Kamera</span>
      </label>
    </li>
  );
};

export default CamTab;