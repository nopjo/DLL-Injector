import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Check, PencilIcon, List } from "lucide-react";

interface TargetProcessProps {
  onProcessSelectorOpen: () => void;
}

const TargetProcess = ({ onProcessSelectorOpen }: TargetProcessProps) => {
  const [targetGame, setTargetGame] = useState("ac_client.exe");
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [inputTargetGame, setInputTargetGame] = useState("");

  useEffect(() => {
    fetchTargetGame();
  }, []);

  const fetchTargetGame = async () => {
    try {
      const result = await invoke<string>("get_target_game");
      setTargetGame(result);
      setInputTargetGame(result);
    } catch (error) {
      console.error("Failed to get target game:", error);
    }
  };

  const updateTargetGame = async () => {
    try {
      await invoke("set_target_game", { processName: inputTargetGame });
      setTargetGame(inputTargetGame);
      setIsEditingTarget(false);
    } catch (error) {
      console.error("Failed to set target game:", error);
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-400">Target Process:</div>
        </div>
        {isEditingTarget ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputTargetGame}
              onChange={(e) => setInputTargetGame(e.target.value)}
              className="bg-slate-700 text-white text-sm p-1 rounded border border-slate-600 w-40"
              placeholder="process.exe"
            />
            <button
              onClick={updateTargetGame}
              className="bg-blue-500 hover:bg-blue-400 p-1 rounded text-xs"
            >
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-blue-300 text-sm font-medium">
              {targetGame}
            </span>
            <button
              onClick={() => setIsEditingTarget(true)}
              className="bg-slate-700 hover:bg-slate-600 p-1 rounded text-xs"
            >
              <PencilIcon size={14} />
            </button>
            <button
              onClick={onProcessSelectorOpen}
              className="bg-slate-700 hover:bg-slate-600 p-1 rounded text-xs text-blue-300"
              title="Select from process list"
            >
              <List size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetProcess;
