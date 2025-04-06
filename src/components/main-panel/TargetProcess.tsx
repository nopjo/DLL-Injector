import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { List } from "lucide-react";

interface TargetProcessProps {
  onProcessSelectorOpen: () => void;
  targetGame?: string;
}

const TargetProcess = ({
  onProcessSelectorOpen,
  targetGame: propTargetGame,
}: TargetProcessProps) => {
  const [localTargetGame, setLocalTargetGame] = useState("ac_client.exe");

  const displayName = propTargetGame || localTargetGame;

  useEffect(() => {
    if (!propTargetGame) {
      fetchTargetGame();
    }
  }, [propTargetGame]);

  const fetchTargetGame = async () => {
    try {
      const result = await invoke<string>("get_target_game");
      setLocalTargetGame(result);
    } catch (error) {
      console.error("Failed to get target game:", error);
    }
  };

  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-400">Target Process:</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-300 text-sm font-medium">
            {displayName}
          </span>
          <button
            onClick={onProcessSelectorOpen}
            className="bg-slate-700 hover:bg-slate-600 p-1 rounded text-xs text-blue-300"
            title="Select from process list"
          >
            <List size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetProcess;
