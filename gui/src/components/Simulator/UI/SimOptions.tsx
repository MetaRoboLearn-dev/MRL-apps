import {useGrid} from "../../../hooks/useGrid.ts";
import {useTaskConfig} from "../../../hooks/useTaskConfig.ts";
import {useState} from "react";

const SimOptions = () => {
  const {
    sizeX, setSizeX,
    sizeZ, setSizeZ,
  } = useGrid()
  const {
    title, setTitle,
    description, setDescription,
    isActive, setIsActive,
    isLogged, setIsLogged,
    hasRobotAccess, setHasRobotAccess
  } = useTaskConfig()

  const [tempSizeX, setTempSizeX] = useState<string>(String(sizeX))
  const [tempSizeZ, setTempSizeZ] = useState<string>(String(sizeZ))
  const [dimError, setDimError] = useState<string | null>(null)

  const changeDim = () => {
    const x = Number(tempSizeX) || 3
    const z = Number(tempSizeZ) || 3

    if (x < 3 || z < 3) {
      setDimError("Both dimensions must be at least 3.")
      return
    }
    setDimError(null)
    setSizeX(x)
    setSizeZ(z)
  }

  return (
    <div className="bg-tomato-50 flex flex-col flex-grow items-center w-full border-t-8 border-y-10 border-tomato-500 relative overflow-hidden p-12 gap-3 font-display">

      <div className="w-full">
        <label className="block text-sm font-semibold mb-1 text-gray-800">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-500 rounded-md text-gray-900"
          placeholder="Task title"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-semibold mb-1 text-gray-800">Description</label>
        <input
          type="text"
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-500 rounded-md text-gray-900"
          placeholder="Optional description"
        />
      </div>

      <div className="w-full">
        <div className="flex gap-3 w-full">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-800">Size X *</label>
            <input
              type="number"
              min={3}
              value={tempSizeX}
              onChange={(e) => { setTempSizeX(e.target.value); setDimError(null); }}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 ${dimError ? 'border-red-500' : 'border-gray-500'}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-800">Size Z *</label>
            <input
              type="number"
              min={3}
              value={tempSizeZ}
              onChange={(e) => { setTempSizeZ(e.target.value); setDimError(null); }}
              className={`w-full px-3 py-2 border rounded-md text-gray-900 ${dimError ? 'border-red-500' : 'border-gray-500'}`}
            />
          </div>
          <button
            onClick={changeDim}
            className="flex-1 px-3 py-2 bg-tomato-500 hover:bg-tomato-600 text-white font-semibold rounded-md self-end transition-colors cursor-pointer"
          >
            Postavi
          </button>
        </div>
        {dimError && <p className="mt-1 text-sm text-red-600 font-semibold">{dimError}</p>}
      </div>

      <div className="flex gap-6 w-full">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-sm font-semibold text-gray-800">Active</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasRobotAccess}
            onChange={(e) => setHasRobotAccess(e.target.checked)}
          />
          <span className="text-sm font-semibold text-gray-800">Can send to robot</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isLogged}
            onChange={(e) => setIsLogged(e.target.checked)}
          />
          <span className="text-sm font-semibold text-gray-800">Is logged</span>
        </label>
      </div>

    </div>
  );
};

export default SimOptions;