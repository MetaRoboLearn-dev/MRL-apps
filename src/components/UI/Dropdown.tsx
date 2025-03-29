import {PropsWithChildren, useEffect, useRef, useState} from "react";
import { RiArrowRightDoubleLine } from "react-icons/ri";

interface Props {
  items: string[];
  current: string;
  onSelect: (item: string) => void;
}

const Dropdown = ({ children, items, current, onSelect }: PropsWithChildren<Props>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={'relative inline-block'} ref={dropdownRef}>
      <div className={`bg-turquoise-700 text-white-smoke-200 rounded-lg border-grey-darker flex items-center
                      mx-2 py-2 px-5 text-base select-none font-semibold
                      transition ease-in-out
                      hover:cursor-pointer hover:scale-103
                      ${isOpen ? 'scale-103' : ''}`}
           onClick={() => setIsOpen(!isOpen)}>
        <span>{children}</span>
        <svg className={`w-2.5 h-2.5 ms-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
             aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 10 6">
          <path stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"/>
        </svg>
      </div>

      <div className={`bg-white-smoke-200 rounded-lg absolute top-12 right-2 min-w-44 border-turquoise-700 border-4
                    transition-all duration-300 ease-in-out transform origin-top
                    ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}>
        <ul className="py-2">
          {items.map((item: string) => (
            <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer flex items-center gap-2" onClick={() => onSelect(item)}>
              <RiArrowRightDoubleLine fontSize={'20'} />
              <div className={"text-lg"}>{item}</div>
              {item === current ? <span className={"text-xs text-turquoise-800"}>ODABRANO</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;