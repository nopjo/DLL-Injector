import { FileText } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";

interface DllSelectorProps {
  selectedDll: string | null;
  onDllSelected: (dllPath: string) => void;
}

const DllSelector = ({ selectedDll, onDllSelected }: DllSelectorProps) => {
  const selectDllFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "DLL Files", extensions: ["dll"] }],
      });

      if (selected && typeof selected === "string") {
        onDllSelected(selected);
      }
    } catch (error) {
      console.error("Failed to select DLL:", error);
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">Selected DLL:</div>
      </div>
      <div className="bg-slate-700 rounded p-2 flex items-center justify-between border border-slate-600">
        <div className="truncate text-sm flex-1">
          {selectedDll ? selectedDll : "No file selected"}
        </div>
        <button
          onClick={selectDllFile}
          className="ml-2 bg-slate-600 hover:bg-slate-500 rounded p-1 transition-colors"
        >
          <FileText size={16} />
        </button>
      </div>
    </div>
  );
};

export default DllSelector;
