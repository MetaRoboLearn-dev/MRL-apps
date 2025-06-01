import {useVehicle} from "../../../hooks/useVehicle.ts";
import {useUI} from "../../../hooks/useUI.ts";

interface Props {
  id: string;
  label: string;
  isChecked: boolean;
  onTabChange: (id: string) => void;
  remove: (id: string) => void;
}

const SimTab = ({id, label, isChecked, onTabChange, remove} : Props) => {
  const { isMoving } = useVehicle();
  const { modalVisible } = useUI();

  const style = isChecked ?
    ('bg-turquoise-700 text-white font-bold py-2') :
    ('bg-turquoise-50 text-dark-neutrals-200 pt-2 pb-3.5 translate-y-2.5 ' +
      'hover:cursor-pointer hover:bg-turquoise-100 hover:text-white-smoke-900 hover:translate-y-1.5 transition');

  return (
    <li className={`${style} font-display mx-1 px-4 rounded-t-lg cursor-pointer peer-checked:bg-turquoise-700`}>
      <label className="block">
        <input
          type="radio"
          name="simTab"
          value={'1'}
          className="hidden peer"
          checked={isChecked}
          onChange={() => onTabChange(id)}
        />
        <span className={'cursor-pointer'}>{label}</span>
        <span className={`ml-2 cursor-pointer hover:font-bold ${isMoving || modalVisible ? 'hidden' : ''}`} onClick={() => remove(id)}>x</span>
      </label>
    </li>
  );
};

export default SimTab;