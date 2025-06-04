import {useSettings} from "../../../hooks/useSettings.ts";

const SimSpeedSlider = () => {
  const { animationSpeed, setAnimationSpeed } = useSettings();

  return (
    <div className="flex items-center justify-center mb-2 font-bold">
      <label className="text-md text-dark-neutrals-400 mr-4 whitespace-nowrap">
        Brzina
      </label>
      <input
        id="steps-range"
        type="range"
        min="20"
        max="100"
        step="10"
        value={animationSpeed * 1000}
        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
        className="w-30 h-2 rounded-lg appearance-none bg-gray-300 accent-tomato-600 cursor-pointer"
      />
    </div>
  );
};

export default SimSpeedSlider;
