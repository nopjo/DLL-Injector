import { Trash2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { getFileName } from "../../utils/fileUtils";

interface DllHistoryProps {
  onDllSelected: (dllPath: string) => void;
  savedDlls: string[];
  setSavedDlls: React.Dispatch<React.SetStateAction<string[]>>;
}

const DllHistory = ({
  onDllSelected,
  savedDlls,
  setSavedDlls,
}: DllHistoryProps) => {
  const removeDll = async (dllToRemove: string) => {
    const newDlls = savedDlls.filter((dll) => dll !== dllToRemove);
    await saveDllList(newDlls);
  };

  const saveDllList = async (newDlls: string[]) => {
    try {
      await invoke("save_dll_list", { dlls: newDlls });
      setSavedDlls(newDlls);
    } catch (error) {
      console.error("Failed to save DLL list:", error);
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-400">DLL History:</div>
      </div>
      <div className="bg-slate-700 rounded border border-slate-600">
        {savedDlls.length > 0 ? (
          savedDlls.map((dll) => (
            <div
              key={dll}
              className="flex items-center justify-between p-2 hover:bg-slate-600 cursor-pointer group"
            >
              <span
                className="truncate flex-1 text-sm"
                onClick={() => onDllSelected(dll)}
                title={dll}
              >
                {getFileName(dll)}
              </span>
              <button
                onClick={() => removeDll(dll)}
                className="ml-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <div className="p-2 text-sm text-slate-400">No DLLs in history</div>
        )}
      </div>
    </div>
  );
};

export default DllHistory;
