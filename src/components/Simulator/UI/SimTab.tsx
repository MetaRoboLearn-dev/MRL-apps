import {useVehicle} from "../../../hooks/useVehicle.ts";
import {useUI} from "../../../hooks/useUI.ts";
import {BsXLg} from "react-icons/bs";

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
    ('bg-turquoise-700 text-light py-2') :
    ('bg-turquoise-50 text-disabled-dark pt-2 pb-3.5 translate-y-1.5 ' +
      'hover:cursor-pointer hover:bg-turquoise-100 hover:text-light hover:translate-y-0.5 transition');

  return (
    <li className={`${style} tab peer-checked:bg-turquoise-700`}>
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
        <span className={`ml-2 cursor-pointer ${isMoving || modalVisible ? 'hidden' : ''}`}
              onClick={() => remove(id)}>
          <BsXLg size={10} className={`${isChecked ? 'text-light' : 'text-disabled-dark'} inline stroke-2`} />
        </span>
      </label>
    </li>
  );
};

export default SimTab;