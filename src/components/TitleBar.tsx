import { Minus, Syringe, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";

const TitleBar = () => {
  const handleClose = async () => {
    await getCurrentWindow().close();
  };

  const handleMinimize = async () => {
    await getCurrentWindow().minimize();
  };

  return (
    <div
      data-tauri-drag-region
      className="bg-slate-800 p-3 flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <Syringe className="text-blue-400" />
        <h1 className="text-xl font-bold text-white select-none">
          DLL Injector
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleMinimize}
          className="text-slate-300 hover:text-white p-1 hover:bg-slate-700 rounded focus:outline-none transition-colors"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={handleClose}
          className="text-slate-300 hover:text-white hover:bg-slate-700 p-1 rounded focus:outline-none transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
